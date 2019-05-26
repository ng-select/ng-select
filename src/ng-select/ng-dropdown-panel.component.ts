import { DOCUMENT } from '@angular/common';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { animationFrameScheduler, asapScheduler, fromEvent, merge, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';

import { DropdownPosition } from './ng-select.component';
import { NgOption } from './ng-select.types';
import { VirtualScrollService } from './virtual-scroll.service';
import { WindowService } from './window.service';

const TOP_CSS_CLASS = 'ng-select-top';
const BOTTOM_CSS_CLASS = 'ng-select-bottom';
const SCROLL_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: 'ng-dropdown-panel',
    template: `
        <div *ngIf="headerTemplate" class="ng-dropdown-header">
            <ng-container [ngTemplateOutlet]="headerTemplate" [ngTemplateOutletContext]="{ searchTerm: filterValue }"></ng-container>
        </div>
        <div #scroll class="ng-dropdown-panel-items scroll-host">
            <div #padding [class.total-padding]="virtualScroll"></div>
            <div #content [class.scrollable-content]="virtualScroll && items.length > 0">
                <ng-content></ng-content>
            </div>
        </div>
        <div *ngIf="footerTemplate" class="ng-dropdown-footer">
            <ng-container [ngTemplateOutlet]="footerTemplate" [ngTemplateOutletContext]="{ searchTerm: filterValue }"></ng-container>
        </div>
    `
})
export class NgDropdownPanelComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {

    @Input() items: NgOption[] = [];
    @Input() markedItem: NgOption;
    @Input() position: DropdownPosition = 'auto';
    @Input() appendTo: string;
    @Input() bufferAmount;
    @Input() virtualScroll = false;
    @Input() headerTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;
    @Input() filterValue: string = null;

    @Output() update = new EventEmitter<any[]>();
    @Output() scroll = new EventEmitter<{ start: number; end: number }>();
    @Output() scrollToEnd = new EventEmitter<void>();
    @Output() outsideClick = new EventEmitter<void>();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;
    @ViewChild('scroll', { read: ElementRef }) scrollElementRef: ElementRef;
    @ViewChild('padding', { read: ElementRef }) paddingElementRef: ElementRef;

    private readonly _destroy$ = new Subject<void>();
    private readonly _dropdown: HTMLElement;
    private _virtualPadding: HTMLElement;
    private _scrollablePanel: HTMLElement;
    private _contentPanel: HTMLElement;
    private _select: HTMLElement;
    // private _isScrolledToMarked = false;
    private _scrollToEndFired = false;

    constructor(
        private _renderer: Renderer2,
        private _zone: NgZone,
        private _virtualScrollService: VirtualScrollService,
        private _window: WindowService,
        _elementRef: ElementRef,
        @Optional() @Inject(DOCUMENT) private _document: any
    ) {
        this._dropdown = _elementRef.nativeElement;
    }

    private _currentPosition: DropdownPosition;

    get currentPosition(): DropdownPosition {
        return this._currentPosition;
    }

    @HostListener('mousedown', ['$event'])
    handleMousedown($event: MouseEvent) {
        const target = $event.target as HTMLElement;
        if (target.tagName === 'INPUT') {
            return;
        }
        $event.preventDefault();
    }

    ngOnInit() {
        this._select = this._dropdown.parentElement;
        this._virtualPadding = this.paddingElementRef.nativeElement;
        this._scrollablePanel = this.scrollElementRef.nativeElement;
        this._contentPanel = this.contentElementRef.nativeElement;
        this._handleScroll();
        this._handleOutsideClick();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this._handleItemsChange(changes.items.currentValue);
        }
    }

    ngOnDestroy() {
        this._disposeDocumentResizeListener();
        this._destroy$.next();
        this._destroy$.complete();
        this._destroy$.unsubscribe();
        if (this.appendTo) {
            this._renderer.removeChild(this._dropdown.parentNode, this._dropdown);
        }
    }

    ngAfterContentInit() {
        this._whenContentReady().then(() => {
            if (this._destroy$.closed) {
                return;
            }
            if (this.appendTo) {
                this._appendDropdown();
                this._handleDocumentResize();
            }
            this.updateDropdownPosition();
        });
    }

    scrollInto(item: NgOption) {
        if (!item) {
            return;
        }
        const index = this.items.indexOf(item);
        if (index < 0 || index >= this.items.length) {
            return;
        }

        const d = this._virtualScrollService.dimensions;
        const scrollEl: Element = this.scrollElementRef.nativeElement;
        const buffer = Math.floor(d.panelHeight / d.itemHeight) - 1;
        if (this.virtualScroll) {
            scrollEl.scrollTop = (index * d.itemHeight) - (d.itemHeight * Math.min(index, buffer));
        } else {
            const contentEl: HTMLElement = this.contentElementRef.nativeElement;
            const childrenHeight = Array.from(contentEl.children).slice(0, index).reduce((c, n) => c + n.clientHeight, 0);
            scrollEl.scrollTop = childrenHeight - (d.itemHeight * Math.min(index, buffer));
        }
    }

    scrollIntoTag() {
        const el: Element = this.scrollElementRef.nativeElement;
        const d = this._virtualScrollService.dimensions;
        el.scrollTop = d.itemHeight * (this.items.length + 1);
    }

    updateDropdownPosition() {
        this._currentPosition = this._calculateCurrentPosition(this._dropdown);
        if (this._currentPosition === 'top') {
            this._renderer.addClass(this._dropdown, TOP_CSS_CLASS);
            this._renderer.removeClass(this._dropdown, BOTTOM_CSS_CLASS);
            this._renderer.addClass(this._select, TOP_CSS_CLASS);
            this._renderer.removeClass(this._select, BOTTOM_CSS_CLASS)
        } else {
            this._renderer.addClass(this._dropdown, BOTTOM_CSS_CLASS);
            this._renderer.removeClass(this._dropdown, TOP_CSS_CLASS);
            this._renderer.addClass(this._select, BOTTOM_CSS_CLASS);
            this._renderer.removeClass(this._select, TOP_CSS_CLASS);
        }

        if (this.appendTo) {
            this._updateAppendedDropdownPosition();
        }

        this._dropdown.style.opacity = '1';
    }

    private _disposeDocumentResizeListener = () => { };

    private _handleScroll() {
        this._zone.runOutsideAngular(() => {
            fromEvent(this.scrollElementRef.nativeElement, 'scroll')
                .pipe(
                    takeUntil(this._destroy$),
                    auditTime(0, SCROLL_SCHEDULER)
                )
                .subscribe(() => {
                    this._calculateItemsRange();
                    this._fireScrollToEnd();
                });
        });
    }

    private _handleOutsideClick() {
        if (!this._document) {
            return;
        }

        this._zone.runOutsideAngular(() => {
            merge(
                fromEvent(this._document, 'touchstart', { capture: true }),
                fromEvent(this._document, 'mousedown', { capture: true })
            ).pipe(takeUntil(this._destroy$))
             .subscribe($event => this._checkToClose($event));
        });
    }

    private _checkToClose($event: any) {
        if (this._select.contains($event.target) || this._dropdown.contains($event.target)) {
            return;
        }

        const path = $event.path || ($event.composedPath && $event.composedPath());
        if ($event.target && $event.target.shadowRoot && path && path[0] && this._select.contains(path[0])) {
            return;
        }

        this.outsideClick.emit();
    }

    private _handleItemsChange(items: NgOption[]) {
        this.items = items || [];
        if (this.virtualScroll && this.items.length > 0) {
            this._zone.runOutsideAngular(() => {
                console.log('items change');
                // TODO: if marked exists, calculate padding and render items based on index
                this._calculateItemsRange();
            });
        } else {
            this.update.emit(this.items);
            // TODO: fix scroll to marked
        }
    }

    private _calculateItemsRange() {
        // TODO: separate initial render with scrolling
        if (!this.virtualScroll) {
            return;
        }

        this._calculateInitialDimensions().then(() => {
            this._window.requestAnimationFrame(() => {
                NgZone.assertNotInAngularZone();


                const d = this._virtualScrollService.calculateDimensions(this.items.length);
                const res = this._virtualScrollService.calculateItems(d, this.scrollElementRef.nativeElement, this.bufferAmount);
                this._virtualPadding.style.height = `${res.scrollHeight}px`;
                this._contentPanel.style.transform = 'translateY(' + res.topPadding + 'px)';

                this._zone.run(() => {
                    this.update.emit(this.items.slice(res.start, res.end));
                    this.scroll.emit({ start: res.start, end: res.end });
                });
            });
        });
    }

    private _calculateInitialDimensions(): Promise<void> {
        if (this._virtualScrollService.dimensions) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            console.log('_calculateInitialDimensions');
            const [first] = this.items;
            this.update.emit([first]);
            Promise.resolve().then(() => {
                const option = this._dropdown.querySelector(`#${first.htmlId}`);
                const optionRect = option.getBoundingClientRect();
                const virtualHeight = optionRect.height * this.items.length;
                this._virtualPadding.style.height = `${virtualHeight}px`;
                const panelRect = this._scrollablePanel.getBoundingClientRect();
                this._virtualScrollService.setInitialDimensions(optionRect.height, panelRect.height);

                resolve();
            });
        });
    }

    private _fireScrollToEnd() {
        if (this._scrollToEndFired) {
            return;
        }
        const scroll: HTMLElement = this.scrollElementRef.nativeElement;
        const padding: HTMLElement = this.virtualScroll ?
            this.paddingElementRef.nativeElement :
            this.contentElementRef.nativeElement;

        if (scroll.scrollTop + this._dropdown.clientHeight >= padding.clientHeight) {
            this.scrollToEnd.emit();
            this._scrollToEndFired = true;
        }
    }

    private _handleDocumentResize() {
        if (!this.appendTo) {
            return;
        }
        this._disposeDocumentResizeListener = this._renderer.listen('window', 'resize', () => {
            this._updateAppendedDropdownPosition();
        });
    }

    // private _scrollToMarked() {
    //     if (this._isScrolledToMarked || !this.markedItem) {
    //         return;
    //     }
    //     this._isScrolledToMarked = true;
    //     this.scrollInto(this.markedItem);
    // }

    private _calculateCurrentPosition(dropdownEl: HTMLElement) {
        if (this.position !== 'auto') {
            return this.position;
        }
        const selectRect: ClientRect = this._select.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectRect.top + window.pageYOffset;
        const height = selectRect.height;
        const dropdownHeight = dropdownEl.getBoundingClientRect().height;
        if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
            return 'top';
        } else {
            return 'bottom';
        }
    }

    private _appendDropdown() {
        const parent = document.querySelector(this.appendTo);
        if (!parent) {
            throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`)
        }
        parent.appendChild(this._dropdown);
    }

    private _updateAppendedDropdownPosition() {
        const parent = document.querySelector(this.appendTo) || document.body;
        this._dropdown.style.display = 'none';
        const selectRect: ClientRect = this._select.getBoundingClientRect();
        const boundingRect = parent.getBoundingClientRect();
        this._dropdown.style.display = '';
        const offsetTop = selectRect.top - boundingRect.top;
        const offsetLeft = selectRect.left - boundingRect.left;
        const topDelta = this._currentPosition === 'bottom' ? selectRect.height : -this._dropdown.clientHeight;
        this._dropdown.style.top = offsetTop + topDelta + 'px';
        this._dropdown.style.bottom = 'auto';
        this._dropdown.style.left = offsetLeft + 'px';
        this._dropdown.style.width = selectRect.width + 'px';
        this._dropdown.style.minWidth = selectRect.width + 'px';
    }

    private _whenContentReady(): Promise<void> {
        if (this.items.length === 0) {
            return Promise.resolve();
        }
        const ready = (resolve) => {
            const ngOption = this._dropdown.querySelector('.ng-option');
            if (ngOption) {
                resolve();
                return;
            }
            this._zone.runOutsideAngular(() => {
                setTimeout(() => ready(resolve), 5);
            });
        };
        return new Promise((resolve) => ready(resolve))
    }
}
