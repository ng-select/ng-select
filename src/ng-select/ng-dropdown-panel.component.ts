import { DOCUMENT } from '@angular/common';
import {
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
import { isDefined } from './value-utils';
import { PanelDimensions, VirtualScrollService } from './virtual-scroll.service';

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
            <div #content [class.scrollable-content]="virtualScroll && items.length">
                <ng-content></ng-content>
            </div>
        </div>
        <div *ngIf="footerTemplate" class="ng-dropdown-footer">
            <ng-container [ngTemplateOutlet]="footerTemplate" [ngTemplateOutletContext]="{ searchTerm: filterValue }"></ng-container>
        </div>
    `
})
export class NgDropdownPanelComponent implements OnInit, OnChanges, OnDestroy {

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
    private _scrollToEndFired = false;
    private _itemsChanged = false;
    private _lastScrollPosition: number;

    constructor(
        private _renderer: Renderer2,
        private _zone: NgZone,
        private _virtualScrollService: VirtualScrollService,
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
            const change = changes.items;
            this._onItemsChange(change.currentValue, change.firstChange);
        }
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        this._destroy$.unsubscribe();
        if (this.appendTo) {
            this._renderer.removeChild(this._dropdown.parentNode, this._dropdown);
        }
    }

    scrollTo(option: NgOption) {
        if (!option) {
            return;
        }

        const index = this.items.indexOf(option);
        if (index < 0 || index >= this.items.length) {
            return;
        }

        let scrollTo;
        if (this.virtualScroll) {
            const itemHeight = this._virtualScrollService.dimensions.itemHeight;
            scrollTo = this._virtualScrollService.getScrollTo(index * itemHeight, itemHeight, this._lastScrollPosition);
        } else {
            const item: HTMLElement = this._dropdown.querySelector(`#${option.htmlId}`);
            scrollTo = this._virtualScrollService.getScrollTo(item.offsetTop, item.clientHeight, this._lastScrollPosition);
        }

        if (isDefined(scrollTo)) {
            this._scrollablePanel.scrollTop = scrollTo;
        }
    }

    scrollToTag() {
        // TODO: needs fix ?
        const el: Element = this.scrollElementRef.nativeElement;
        const d = this._virtualScrollService.dimensions;
        el.scrollTop = d.itemHeight * (this.items.length + 1);
    }

    updateDropdownPosition() {
        // TODO: make private ?
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

    private _handleScroll() {
        this._zone.runOutsideAngular(() => {
            fromEvent(this.scrollElementRef.nativeElement, 'scroll')
                .pipe(takeUntil(this._destroy$), auditTime(0, SCROLL_SCHEDULER))
                .subscribe((e: Event) => this._onContentScrolled(e.srcElement.scrollTop));
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

    private _onItemsChange(items: NgOption[], firstChange: boolean) {
        this.items = items || [];
        this._scrollToEndFired = false;
        this._itemsChanged = true;

        if (this.virtualScroll) {
            this._updateItemsRange(firstChange);
        } else {
            this._updateItems();
        }
    }

    private _updateItems() {
        this.update.emit(this.items);

        this._zone.runOutsideAngular(() => {
            Promise.resolve().then(() => {
                const panelHeight = this._scrollablePanel.clientHeight;
                this._virtualScrollService.setDimensions(0, panelHeight);
                this._handleDropdownPosition();
                this.scrollTo(this.markedItem);
            });
        });
    }

    private _updateItemsRange(firstChange: boolean) {
        this._zone.runOutsideAngular(() => {
            if (firstChange) {
                this._measureDimensions().then((d: PanelDimensions) => {
                    this._handleDropdownPosition();
                    const index = this.markedItem ? this.markedItem.index : 0;
                    this._renderItemsRange(index * d.itemHeight);
                });
            } else {
                this._renderItemsRange();
            }
        });
    }

    private _onContentScrolled(scrollTop: number) {
        if (this.virtualScroll) {
            this._renderItemsRange(scrollTop);
        }
        this._lastScrollPosition = scrollTop;
        this._fireScrollToEnd(scrollTop);
    }

    private _updateVirtualHeight(height: number) {
        if (this._itemsChanged) {
            this._virtualPadding.style.height = `${height}px`;
            this._itemsChanged = false;
        }
    }

    private _renderItemsRange(scrollTop = null) {
        NgZone.assertNotInAngularZone();

        if (scrollTop && this._lastScrollPosition === scrollTop) {
            return;
        }

        scrollTop = scrollTop || this._scrollablePanel.scrollTop;
        const range = this._virtualScrollService.calculateItems(scrollTop, this.items.length, this.bufferAmount);
        this._updateVirtualHeight(range.scrollHeight);
        this._contentPanel.style.transform = 'translateY(' + range.topPadding + 'px)';

        this._zone.run(() => {
            this.update.emit(this.items.slice(range.start, range.end));
            this.scroll.emit({ start: range.start, end: range.end });
        });

        if (!isDefined(this._lastScrollPosition) && scrollTop) {
            this._scrollablePanel.scrollTop = scrollTop;
        }
    }

    private _measureDimensions(): Promise<PanelDimensions> {
        if (this._virtualScrollService.dimensions) {
            return Promise.resolve(this._virtualScrollService.dimensions);
        }

        return new Promise(resolve => {
            const [first] = this.items;
            this.update.emit([first]);
            Promise.resolve().then(() => {
                const option = this._dropdown.querySelector(`#${first.htmlId}`);
                const optionHeight = option.clientHeight;
                this._virtualPadding.style.height = `${optionHeight * this.items.length}px`;
                const panelHeight = this._scrollablePanel.clientHeight;
                this._virtualScrollService.setDimensions(optionHeight, panelHeight);

                resolve(this._virtualScrollService.dimensions);
            });
        });
    }

    private _fireScrollToEnd(scrollTop: number) {
        if (this._scrollToEndFired) {
            return;
        }

        const padding = this.virtualScroll ?
            this._virtualPadding :
            this._contentPanel;

        if (scrollTop + this._dropdown.clientHeight >= padding.clientHeight) {
            this._zone.run(() => this.scrollToEnd.emit());
            this._scrollToEndFired = true;
        }
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
            throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`);
        }
        parent.appendChild(this._dropdown);
    }

    private _updateAppendedDropdownPosition() {
        const parent = document.querySelector(this.appendTo) || document.body;
        const selectRect: ClientRect = this._select.getBoundingClientRect();
        const boundingRect = parent.getBoundingClientRect();
        const offsetTop = selectRect.top - boundingRect.top;
        const offsetLeft = selectRect.left - boundingRect.left;
        const topDelta = this._currentPosition === 'bottom' ? selectRect.height : -this._dropdown.clientHeight;
        this._dropdown.style.top = offsetTop + topDelta + 'px';
        this._dropdown.style.bottom = 'auto';
        this._dropdown.style.left = offsetLeft + 'px';
        this._dropdown.style.width = selectRect.width + 'px';
        this._dropdown.style.minWidth = selectRect.width + 'px';
    }

    private _handleDropdownPosition() {
        NgZone.assertNotInAngularZone();
        if (this.appendTo) {
            this._appendDropdown();
        }
        this.updateDropdownPosition();
    }
}
