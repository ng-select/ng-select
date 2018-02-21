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
    Inject
} from '@angular/core';

import { VirtualScrollService } from './virtual-scroll.service';
import { NgOption } from './ng-select.types';
import { NgSelectComponent, DropdownPosition } from './ng-select.component';


@Component({
    providers: [VirtualScrollService],
    selector: 'ng-dropdown-panel',
    template: `
        <div *ngIf="headerTemplate" class="ng-dropdown-header" ngProjectAs="header" header>
            <ng-container [ngTemplateOutlet]="headerTemplate"></ng-container>
        </div>
        <div #scroll class="ng-select-dropdown scroll-host">
            <div [hidden]="!vsEnabled" #padding class="total-padding"></div>
            <div #content [class.scrollable-content]="vsEnabled">
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
export class DropdownPanelComponent implements OnDestroy {

    @Input() items: NgOption[] = [];
    @Input() position: DropdownPosition;
    @Input() appendTo: string;
    @Input() bufferAmount = 4;
    @Input() vsDisabled = false;
    @Input() headerTemplate: TemplateRef<any>;
    @Input() footerTemplate: TemplateRef<any>;

    @Output() update = new EventEmitter<any[]>();
    @Output() positionChange = new EventEmitter();
    @Output() init = new EventEmitter<any>();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;
    @ViewChild('scroll', { read: ElementRef }) scrollElementRef: ElementRef;
    @ViewChild('padding', { read: ElementRef }) paddingElementRef: ElementRef;

    currentPosition: DropdownPosition;

    // min number of items for virtual scroll to be enabled
    private _minVsItemsLength = 40;
    private _inputElementRef: ElementRef;
    private _scrollHeight: number;
    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
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
     }

    get vsEnabled() {
        return !this.vsDisabled && this.items && this.items.length > this._minVsItemsLength;
    }

    ngOnInit() {
        this.handleScroll();
        if (this.appendTo) {
            this._handleAppendTo();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.position) {
            this.currentPosition = changes.position.currentValue;
            if (this.currentPosition === 'auto') {
                this._autoPositionDropdown();
            }
            if (this.appendTo) {
                this._updateAppendedDropdownPosition();
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

    handleScroll() {
        const handler = () => {
            this.refresh();
        };
        this._disposeScrollListener = this._renderer.listen(this.scrollElementRef.nativeElement, 'scroll', handler);
    }

    ngAfterContentInit() {
        this.init.emit();
    }

    refresh() {
        if (!this.vsEnabled) {
            this.update.emit(this.items);
            return;
        }

        this._zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this._calculateItems());
        });
    }

    scrollInto(item: any) {
        const el: Element = this.scrollElementRef.nativeElement;
        const index: number = (this.items || []).indexOf(item);
        if (index < 0 || index >= (this.items || []).length) {
            return;
        }

        const d = this._calculateDimensions();
        const buffer = Math.floor(d.viewHeight / d.childHeight) - 1;
        el.scrollTop = (Math.floor(index / d.itemsPerRow) * d.childHeight)
            - (d.childHeight * Math.min(index, buffer));
        this.refresh();
    }

    scrollIntoTag() {
        const el: Element = this.scrollElementRef.nativeElement;
        const d = this._calculateDimensions();
        el.scrollTop = d.childHeight * (d.itemCount + 1);
        this.refresh();
    }

    private _handleItemsChange(items: { previousValue: NgOption[], currentValue: NgOption[]}) {
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
        NgZone.assertNotInAngularZone();
        const d = this._calculateDimensions();
        const range = this._virtualScrollService.calculateItemsRange(d, this.scrollElementRef, this.bufferAmount);
        this._scrollHeight = range.scrollHeight;
        this._updatePaddingHeight(range.scrollHeight);
        this._updateContentTransform(range.topPadding);
        
        console.log('--------------')
        console.log('_calculateDimensions', d);
        console.log('_calculateItems', range);
        console.log('this._previousStart', this._previousStart);
        console.log('this._previousEnd', this._previousEnd);
        if (range.start !== this._previousStart || range.end !== this._previousEnd) {

            // update the scroll list
            this._zone.run(() => {
                this.update.emit(this.items.slice(range.start, range.end));
            });

            this._previousStart = range.start;
            this._previousEnd = range.end;

            if (this._startupLoop === true) {
                this.refresh();
            }

        } else if (this._startupLoop === true) {
            this._startupLoop = false;
            console.log('_startupLoop = false')
            this.refresh();
        }
    }

    private _updatePaddingHeight(height: number) {
        const el: HTMLElement = this.paddingElementRef.nativeElement;
        el.style.height = `${height}px`;
    }

    private _updateContentTransform(topPadding: number) {
        const transform = this.vsEnabled ? 'translateY(' + topPadding + 'px)' : 'none';
        const el: HTMLElement = this.contentElementRef.nativeElement;
        el.style.transform = transform;
    }

    private _calculateDimensions() {
        return this._virtualScrollService.calculateDimensions(
            this.items.length,
            this._scrollHeight,
            this.scrollElementRef,
            this.contentElementRef
        )
    }

    private _handleDocumentResize() {
        const handler = () => {
            if (this.appendTo) {
                this._updateAppendedDropdownPosition();
            }
        };

        this._disposeDocumentResizeListener = this._renderer.listen('window', 'resize', handler);
    }

    private _handleAppendTo() {
        if (this.appendTo === 'body') {
            document.body.appendChild(this._elementRef.nativeElement);
        } else {
            const parent = document.querySelector(this.appendTo);
            if (!parent) {
                throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`)
            }
            parent.appendChild(this._elementRef.nativeElement);
        }
        this._handleDocumentResize();
        this._updateAppendedDropdownPosition();
    }

    private _updateAppendedDropdownPosition() {
        const selectRect: ClientRect = this._inputElementRef.nativeElement.getBoundingClientRect();
        const dropdownPanel: HTMLElement = this._elementRef.nativeElement;
        const bodyRect = document.body.getBoundingClientRect();
        const offsetTop = selectRect.top - bodyRect.top;
        const offsetLeft = selectRect.left - bodyRect.left;
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
