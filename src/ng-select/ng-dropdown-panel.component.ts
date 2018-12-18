import {
    Component,
    OnDestroy,
    Renderer2,
    ElementRef,
    Input,
    EventEmitter,
    Output,
    ViewChild,
    SimpleChanges,
    NgZone,
    TemplateRef,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterContentInit,
    OnInit,
    OnChanges,
    HostListener,
    Optional,
    Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { NgOption } from './ng-select.types';
import { DropdownPosition } from './ng-select.component';
import { WindowService } from './window.service';
import { VirtualScrollService } from './virtual-scroll.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, fromEvent, merge } from 'rxjs';

const TOP_CSS_CLASS = 'ng-select-top';
const BOTTOM_CSS_CLASS = 'ng-select-bottom';

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
    @Input() bufferAmount = 4;
    @Input() virtualScroll = false;
    @Input() headerTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;
    @Input() filterValue: string = null;

    @Output() update = new EventEmitter<any[]>();
    @Output() scroll = new EventEmitter<{ start: number; end: number }>();
    @Output() scrollToEnd = new EventEmitter<{ start: number; end: number }>();
    @Output() outsideClick = new EventEmitter<void>();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;
    @ViewChild('scroll', { read: ElementRef }) scrollElementRef: ElementRef;
    @ViewChild('padding', { read: ElementRef }) paddingElementRef: ElementRef;

    private readonly _destroy$ = new Subject<void>();
    private readonly _dropdown: HTMLElement;
    private _select: HTMLElement;
    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
    private _isScrolledToMarked = false;
    private _scrollToEndFired = false;
    private _currentPosition: DropdownPosition;
    private _disposeScrollListener = () => { };
    private _disposeDocumentResizeListener = () => { };

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

    @HostListener('mousedown', ['$event'])
    handleMousedown($event: MouseEvent) {
        const target = $event.target as HTMLElement;
        if (target.tagName === 'INPUT') {
            return;
        }
        $event.preventDefault();
        $event.stopPropagation();
    }

    ngOnInit() {
        this._select = this._dropdown.parentElement;
        this._handleScroll();
        if (this._document) {
            merge(
                fromEvent(this._document, 'touchstart', { capture: true }),
                fromEvent(this._document, 'mousedown', { capture: true })
            )
                .pipe(takeUntil(this._destroy$))
                .subscribe(($event) => this._handleOutsideClick($event));
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this._isScrolledToMarked = false;
            this._handleItemsChange(changes.items);
        }
    }

    ngOnDestroy() {
        this._disposeDocumentResizeListener();
        this._disposeScrollListener();
        this._destroy$.next();
        this._destroy$.complete();
        if (this.appendTo) {
            this._renderer.removeChild(this._dropdown.parentNode, this._dropdown);
        }
    }

    ngAfterContentInit() {
        this._whenContentReady().then(() => {
            if (this.appendTo) {
                this._appendDropdown();
                this._handleDocumentResize();
            }
            this.updateDropdownPosition();
        });
    }

    refresh(): Promise<void> {
        return new Promise(resolve => {
            this._zone.runOutsideAngular(() => {
                this._window.requestAnimationFrame(() => {
                    this._updateItems().then(resolve);
                });
            });
        })
    }

    scrollInto(item: NgOption) {
        if (!item) {
            return;
        }
        const index = this.items.indexOf(item);
        if (index < 0 || index >= this.items.length) {
            return;
        }

        const d = this._calculateDimensions(this.virtualScroll ? 0 : index);
        const scrollEl: Element = this.scrollElementRef.nativeElement;
        const buffer = Math.floor(d.viewHeight / d.childHeight) - 1;
        if (this.virtualScroll) {
            scrollEl.scrollTop = (index * d.childHeight) - (d.childHeight * Math.min(index, buffer));
        } else {
            const contentEl: HTMLElement = this.contentElementRef.nativeElement;
            const childrenHeight = Array.from(contentEl.children).slice(0, index).reduce((c, n) => c + n.clientHeight, 0);
            scrollEl.scrollTop = childrenHeight - (d.childHeight * Math.min(index, buffer));
        }
    }

    scrollIntoTag() {
        const el: Element = this.scrollElementRef.nativeElement;
        const d = this._calculateDimensions();
        el.scrollTop = d.childHeight * (d.itemsLength + 1);
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

    private _handleOutsideClick($event: any) {
        if (this._select.contains($event.target)) {
            return;
        }

        if (this._dropdown.contains($event.target)) {
            return;
        }

        const path = $event.path || ($event.composedPath && $event.composedPath());
        if ($event.target && $event.target.shadowRoot && path && path[0] && this._select.contains(path[0])) {
            return;
        }

        this.outsideClick.emit();
    }

    private _handleScroll() {
        this._disposeScrollListener = this._renderer.listen(this.scrollElementRef.nativeElement, 'scroll', () => {
            this.refresh();
            this._fireScrollToEnd();
        });
    }

    private _handleItemsChange(items: { previousValue: NgOption[], currentValue: NgOption[] }) {
        this._scrollToEndFired = false;
        this._previousStart = undefined;
        this._previousEnd = undefined;
        if (items !== undefined && items.previousValue === undefined ||
            (items.previousValue !== undefined && items.previousValue.length === 0)) {
            this._startupLoop = true;
        }
        this.items = items.currentValue || [];
        this.refresh().then(() => {
            if (this.appendTo && this._currentPosition === 'top') {
                this._updateAppendedDropdownPosition();
            }
        });
    }

    private _updateItems(): Promise<void> {
        NgZone.assertNotInAngularZone();

        if (!this.virtualScroll) {
            this._zone.run(() => {
                this.update.emit(this.items.slice());
                this._scrollToMarked();
            });
            return Promise.resolve();
        }

        const loop = (resolve) => {
            const d = this._calculateDimensions();
            const res = this._virtualScrollService.calculateItems(d, this.scrollElementRef.nativeElement, this.bufferAmount || 0);

            (<HTMLElement>this.paddingElementRef.nativeElement).style.height = `${res.scrollHeight}px`;
            (<HTMLElement>this.contentElementRef.nativeElement).style.transform = 'translateY(' + res.topPadding + 'px)';

            if (res.start !== this._previousStart || res.end !== this._previousEnd) {
                this._zone.run(() => {
                    this.update.emit(this.items.slice(res.start, res.end));
                    this.scroll.emit({ start: res.start, end: res.end });
                });
                this._previousStart = res.start;
                this._previousEnd = res.end;

                if (this._startupLoop === true) {
                    loop(resolve)
                }

            } else if (this._startupLoop === true) {
                this._startupLoop = false;
                this._scrollToMarked();
                resolve();
            }
        };
        return new Promise((resolve) => loop(resolve))
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

    private _calculateDimensions(index = 0) {
        return this._virtualScrollService.calculateDimensions(
            this.items.length,
            index,
            this.scrollElementRef.nativeElement,
            this.contentElementRef.nativeElement
        )
    }

    private _handleDocumentResize() {
        if (!this.appendTo) {
            return;
        }
        this._disposeDocumentResizeListener = this._renderer.listen('window', 'resize', () => {
            this._updateAppendedDropdownPosition();
        });
    }

    private _scrollToMarked() {
        if (this._isScrolledToMarked || !this.markedItem) {
            return;
        }
        this._isScrolledToMarked = true;
        this.scrollInto(this.markedItem);
    }

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
