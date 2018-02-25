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
    ViewEncapsulation
} from '@angular/core';

import { VirtualScrollService } from './virtual-scroll.service';
import { NgOption } from './ng-select.types';
import { NgSelectComponent, DropdownPosition } from './ng-select.component';
import { ItemsList } from './items-list';

declare var process: any;
const IS_TEST = process.env.NODE_ENV === 'TEST';

@Component({
    providers: [VirtualScrollService],
    encapsulation: ViewEncapsulation.None,
    selector: 'ng-dropdown-panel',
    template: `
        <div *ngIf="headerTemplate" class="ng-dropdown-header" ngProjectAs="header" header>
            <ng-container [ngTemplateOutlet]="headerTemplate"></ng-container>
        </div>
        <div #scroll class="ng-select-dropdown scroll-host">
            <div #padding class="total-padding"></div>
            <div #content [class.scrollable-content]="items.length > 0">
                <ng-content></ng-content>
            </div>
        </div>
        <div *ngIf="footerTemplate" class="ng-dropdown-footer" ngProjectAs="footer" footer>
            <ng-container [ngTemplateOutlet]="footerTemplate"></ng-container>
        </div>
    `,
    styles: [`
        .scroll-host {
            overflow: hidden;
            overflow-y: auto;
            position: relative;
            display: block;
            -webkit-overflow-scrolling: touch;
        }
        .scrollable-content {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
        }
        .total-padding {
            width: 1px;
            opacity: 0;
        }
    `],
    host: {
        '[class.top]': 'currentPosition === "top"',
        '[class.bottom]': 'currentPosition === "bottom"',
    }
})
export class NgDropdownPanelComponent implements OnDestroy {

    @Input() items: NgOption[] = [];
    @Input() position: DropdownPosition;
    @Input() appendTo: string;
    @Input() bufferAmount = 4;
    @Input() headerTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;

    @Output() update = new EventEmitter<any[]>();
    @Output() scrollToEnd = new EventEmitter<{ start: number; end: number }>();
    @Output() positionChange = new EventEmitter();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;
    @ViewChild('scroll', { read: ElementRef }) scrollElementRef: ElementRef;
    @ViewChild('padding', { read: ElementRef }) paddingElementRef: ElementRef;

    currentPosition: DropdownPosition = 'bottom';

    private _inputElementRef: ElementRef;
    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
    private _scrolledToMarked = false;
    private _scrollToEndFired = false;
    private _itemsList: ItemsList;
    private _disposeScrollListener = () => { };

    private _disposeDocumentResizeListener = () => { };

    constructor(
        @Inject(forwardRef(() => NgSelectComponent)) _ngSelect: NgSelectComponent,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _zone: NgZone,
        private _virtualScrollService: VirtualScrollService
    ) {
        this._inputElementRef = _ngSelect.elementRef;
        this._itemsList = _ngSelect.itemsList;
    }

    ngOnInit() {
        this._handleScroll();
        if (this.appendTo) {
            this._handleAppendTo();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.position && changes.position.currentValue) {
            this.currentPosition = changes.position.currentValue;
            if (this.currentPosition === 'auto') {
                this._autoPositionDropdown();
            }
            if (this.appendTo) {
                this._updateDropdownPosition();
            }
        }

        if (changes.items) {
            this._handleItemsChange(changes.items);
        }
    }

    ngOnDestroy() {
        this._disposeDocumentResizeListener();
        this._disposeScrollListener();
        this._elementRef.nativeElement.remove();
    }

    refresh() {
        if (IS_TEST) {
            this._calculateItems();
            return;
        }
        this._zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this._calculateItems());
        });
    }

    scrollInto(item: any) {
        const index: number = (this.items || []).indexOf(item);
        if (index < 0 || index >= (this.items || []).length) {
            return;
        }
        const scrollEl: Element = this.scrollElementRef.nativeElement;
        const d = this._calculateDimensions();
        const buffer = Math.floor(d.viewHeight / d.childHeight) - 1;
        scrollEl.scrollTop = (Math.floor(index) * d.childHeight) - (d.childHeight * Math.min(index, buffer));
    }

    scrollIntoTag() {
        const el: Element = this.scrollElementRef.nativeElement;
        const d = this._calculateDimensions();
        el.scrollTop = d.childHeight * (d.itemsLength + 1);
    }

    private _handleScroll() {
        this._disposeScrollListener = this._renderer.listen(this.scrollElementRef.nativeElement, 'scroll', () => {
            this.refresh()
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
        this.refresh();
    }

    private _calculateItems() {
        if (!IS_TEST) {
            NgZone.assertNotInAngularZone();
        }

        const d = this._calculateDimensions();
        const res = this._virtualScrollService.calculateItems(d, this.scrollElementRef.nativeElement, this.bufferAmount);

        (<HTMLElement>this.paddingElementRef.nativeElement).style.height = `${res.scrollHeight}px`;
        const transform = 'translateY(' + res.topPadding + 'px)';
        (<HTMLElement>this.contentElementRef.nativeElement).style.transform = transform;

        if (res.start !== this._previousStart || res.end !== this._previousEnd) {
            this._zone.run(() => {
                this.update.emit(this.items.slice(res.start, res.end));

                if (res.end === this.items.length && !this._scrollToEndFired) {
                    this._scrollToEndFired = true;
                    this.scrollToEnd.emit({ start: res.start, end: res.end });
                }

                this._previousStart = res.start;
                this._previousEnd = res.end;
            });

            if (this._startupLoop === true) {
                this.refresh();
            }

        } else if (this._startupLoop === true) {
            this._startupLoop = false;
            this._scrollToMarked();
        }
    }

    private _calculateDimensions() {
        return this._virtualScrollService.calculateDimensions(
            this.items.length,
            this.scrollElementRef.nativeElement,
            this.contentElementRef.nativeElement
        )
    }

    private _handleDocumentResize() {
        if (!this.appendTo) {
            return;
        }
        this._disposeDocumentResizeListener = this._renderer.listen('window', 'resize', () => {
            this._updateDropdownPosition();
        });
    }

    private _scrollToMarked() {
        if (this._scrolledToMarked) {
            return;
        }
        this._scrolledToMarked = true;
        this.scrollInto(this._itemsList.markedItem)
    }

    private _handleAppendTo() {
        const parent = document.querySelector(this.appendTo);
        if (!parent) {
            throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`)
        }
        this._updateDropdownPosition();
        parent.appendChild(this._elementRef.nativeElement);
        this._handleDocumentResize();
    }

    private _updateDropdownPosition() {
        const parent = document.querySelector(this.appendTo) || document.body;
        const selectRect: ClientRect = this._inputElementRef.nativeElement.getBoundingClientRect();
        const dropdownPanel: HTMLElement = this._elementRef.nativeElement;
        const boundingRect = parent.getBoundingClientRect();
        const offsetTop = selectRect.top - boundingRect.top;
        const offsetLeft = selectRect.left - boundingRect.left;
        const topDelta = this.currentPosition === 'bottom' ? selectRect.height : -dropdownPanel.clientHeight;
        dropdownPanel.style.top = offsetTop + topDelta + 'px';
        dropdownPanel.style.bottom = 'auto';
        dropdownPanel.style.left = offsetLeft + 'px';
        dropdownPanel.style.width = selectRect.width + 'px';
    }

    private _autoPositionDropdown() {
        const ngOption = this._elementRef.nativeElement.querySelector('.ng-option');
        if (this.items.length > 0 && !ngOption) {
            setTimeout(() => { this._autoPositionDropdown(); }, 50);
            return;
        }

        const selectRect: ClientRect = this._inputElementRef.nativeElement.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectRect.top + window.pageYOffset;
        const height = selectRect.height;
        const dropdownHeight = this._elementRef.nativeElement.getBoundingClientRect().height;
        if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
            this.currentPosition = 'top';
        } else {
            this.currentPosition = 'bottom';
        }
        this.positionChange.emit(this.currentPosition);
    }
}
