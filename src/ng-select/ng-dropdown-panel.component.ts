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
    forwardRef,
    Inject,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    AfterContentInit,
    OnInit,
    OnChanges,
    HostListener
} from '@angular/core';

import { NgOption } from './ng-select.types';
import { NgSelectComponent, DropdownPosition } from './ng-select.component';
import { ItemsList } from './items-list';
import { WindowService } from './window.service';
import { VirtualScrollService } from './virtual-scroll.service';

const TOP_CSS_CLASS = 'ng-select-top';
const BOTTOM_CSS_CLASS = 'ng-select-bottom';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    selector: 'ng-dropdown-panel',
    template: `
        <div *ngIf="headerTemplate" class="ng-dropdown-header">
            <ng-container [ngTemplateOutlet]="headerTemplate"></ng-container>
        </div>
        <div *ngIf="inputTemplate">
            <ng-container [ngTemplateOutlet]="inputTemplate"></ng-container>
            <i class="ng-search-icon"></i>
        </div>
        <div #scroll class="ng-dropdown-panel-items scroll-host">
            <div #padding [class.total-padding]="virtualScroll"></div>
            <div #content [class.scrollable-content]="virtualScroll && items.length > 0">
                <ng-content></ng-content>
            </div>
        </div>
        <div *ngIf="footerTemplate" class="ng-dropdown-footer">
            <ng-container [ngTemplateOutlet]="footerTemplate"></ng-container>
        </div>
    `,
    styleUrls: ['./ng-dropdown-panel.component.scss']
})
export class NgDropdownPanelComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {

    @Input() items: NgOption[] = [];
    @Input() position: DropdownPosition = 'auto';
    @Input() appendTo: string;
    @Input() bufferAmount = 4;
    @Input() virtualScroll = false;
    @Input() headerTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;
    @Input() inputTemplate: TemplateRef<any>;

    @Output() update = new EventEmitter<any[]>();
    @Output() scrollToEnd = new EventEmitter<{ start: number; end: number }>();
    @Output() outsideClick = new EventEmitter<void>();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;
    @ViewChild('scroll', { read: ElementRef }) scrollElementRef: ElementRef;
    @ViewChild('padding', { read: ElementRef }) paddingElementRef: ElementRef;

    private _selectElement: HTMLElement;
    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
    private _isScrolledToMarked = false;
    private _scrollToEndFired = false;
    private _itemsList: ItemsList;
    private _currentPosition: 'bottom' | 'top';
    private _disposeScrollListener = () => { };
    private _disposeDocumentResizeListener = () => { };

    constructor(
        @Inject(forwardRef(() => NgSelectComponent)) _ngSelect: NgSelectComponent,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _zone: NgZone,
        private _virtualScrollService: VirtualScrollService,
        private _window: WindowService
    ) {
        this._selectElement = _ngSelect.elementRef.nativeElement;
        this._itemsList = _ngSelect.itemsList;
    }

    ngOnInit() {
        this._handleScroll();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items) {
            this._handleItemsChange(changes.items);
        }
    }

    ngOnDestroy() {
        this._disposeDocumentResizeListener();
        this._disposeScrollListener();
        if (this.appendTo) {
            this._renderer.removeChild(this._elementRef.nativeElement.parentNode, this._elementRef.nativeElement);
        }
    }

    ngAfterContentInit() {
        this._whenContentReady().then(() => {
            this._handleDropdownPosition();
        });
    }

    refresh(): Promise<void> {
        return new Promise((resolve) => {
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

    @HostListener('mousedown', ['$event'])
    handleMousedown($event: MouseEvent) {
        $event.preventDefault();
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
            const transform = 'translateY(' + res.topPadding + 'px)';
            (<HTMLElement>this.contentElementRef.nativeElement).style.transform = transform;

            if (res.start !== this._previousStart || res.end !== this._previousEnd) {
                this._zone.run(() => {
                    this.update.emit(this.items.slice(res.start, res.end));
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
        const panel: HTMLElement = this._elementRef.nativeElement;
        const padding: HTMLElement = this.virtualScroll ?
            this.paddingElementRef.nativeElement :
            this.contentElementRef.nativeElement;

        if (scroll.scrollTop + panel.clientHeight >= padding.clientHeight) {
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
        if (this._isScrolledToMarked) {
            return;
        }
        this._isScrolledToMarked = true;

        this.scrollInto(this._itemsList.markedItem)
    }

    private _handleDropdownPosition() {
        if (this.appendTo) {
            this._appendDropdown();
            this._handleDocumentResize();
        }

        const dropdownEl: HTMLElement = this._elementRef.nativeElement;
        this._currentPosition = this._calculateCurrentPosition(dropdownEl);
        const selectEl: HTMLElement = this._selectElement;
        if (this._currentPosition === 'top') {
            this._renderer.addClass(dropdownEl, TOP_CSS_CLASS)
            this._renderer.removeClass(dropdownEl, BOTTOM_CSS_CLASS)
            this._renderer.addClass(selectEl, TOP_CSS_CLASS)
            this._renderer.removeClass(selectEl, BOTTOM_CSS_CLASS)
        } else {
            this._renderer.addClass(dropdownEl, BOTTOM_CSS_CLASS)
            this._renderer.removeClass(dropdownEl, TOP_CSS_CLASS)
            this._renderer.addClass(selectEl, BOTTOM_CSS_CLASS)
            this._renderer.removeClass(selectEl, TOP_CSS_CLASS)
        }

        if (this.appendTo) {
            this._updateAppendedDropdownPosition();
        }

        dropdownEl.style.opacity = '1';
    }

    private _calculateCurrentPosition(dropdownEl: HTMLElement) {
        if (this.position !== 'auto') {
            return this.position;
        }
        const selectRect: ClientRect = this._selectElement.getBoundingClientRect();
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
        parent.appendChild(this._elementRef.nativeElement);
    }

    private _updateAppendedDropdownPosition() {
        const parent = document.querySelector(this.appendTo) || document.body;
        const selectRect: ClientRect = this._selectElement.getBoundingClientRect();
        const dropdownPanel: HTMLElement = this._elementRef.nativeElement;
        const boundingRect = parent.getBoundingClientRect();
        const offsetTop = selectRect.top - boundingRect.top;
        const offsetLeft = selectRect.left - boundingRect.left;
        const topDelta = this._currentPosition === 'bottom' ? selectRect.height : -dropdownPanel.clientHeight;
        dropdownPanel.style.top = offsetTop + topDelta + 'px';
        dropdownPanel.style.bottom = 'auto';
        dropdownPanel.style.left = offsetLeft + 'px';
        dropdownPanel.style.width = selectRect.width + 'px';
    }

    private _whenContentReady(): Promise<void> {
        if (this.items.length === 0) {
            return Promise.resolve();
        }
        const dropdownEl: HTMLElement = this._elementRef.nativeElement;
        const ready = (resolve) => {
            const ngOption = dropdownEl.querySelector('.ng-option');
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
