import {
    Component,
    Inject,
    forwardRef,
    OnDestroy,
    Renderer2,
    ElementRef,
    Input,
    EventEmitter,
    Output,
    ViewChild,
    SimpleChanges,
    NgZone
} from '@angular/core';

import { NgSelectComponent } from './ng-select.component';
import { VirtualScrollService } from './virtual-scroll.service';
import { NgOption } from './ng-select.types';


@Component({
    providers: [VirtualScrollService],
    selector: 'ng-dropdown-panel',
    template: `
        <div>
            <ng-content selector="[header]"></ng-content>
            <div #scroll class="ng-select-dropdown scroll-host">
                <div *ngIf="enabled" class="total-padding" [style.height]="scrollHeight + 'px'"></div>
                <div #content [class.scrollable-content]="enabled" [style.transform]="transformStyle">
                    <ng-content selector="[items]"></ng-content>
                </div>
            </div>
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
    `]
})
export class DropdownPanelComponent implements OnDestroy {

    @Input() items: NgOption[] = [];
    @Input() bufferAmount = 4;
    @Input() disabled = false;

    @Output() update = new EventEmitter<any[]>();
    @Output() init = new EventEmitter<any>();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;
    @ViewChild('scroll', { read: ElementRef }) scrollElementRef: ElementRef;

    scrollHeight: number;

    private _topPadding: number;
    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
    // min number of items for virtual scroll to be enabled
    private _minItems = 40;
    private _disposeScrollListener = () => { };

    private _disposeDocumentResizeListener = () => { };

    constructor(
        @Inject(forwardRef(() => NgSelectComponent)) private _ngSelect: NgSelectComponent,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private _zone: NgZone,
        private _virtualScrollService: VirtualScrollService
    ) { }

    get enabled() {
        return !this.disabled && this.items && this.items.length > this._minItems;
    }

    get transformStyle() {
        return this.enabled ? 'translateY(' + this._topPadding + 'px)' : 'none'
    }

    ngOnInit() {
        this.handleScroll();

        if (this._ngSelect.dropdownPosition === 'auto') {
            this._autoPositionDropdown();
        }
        if (this._ngSelect.appendTo) {
            this._handleAppendTo();
            this._updateAppendedDropdownPosition();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this._previousStart = undefined;
        this._previousEnd = undefined;
        const items = (changes as any).items || {};
        if ((changes as any).items !== undefined && items.previousValue === undefined ||
            (items.previousValue !== undefined && items.previousValue.length === 0)) {
            this._startupLoop = true;
        }
        this.items = items.currentValue;
        this.refresh();
    }


    ngOnDestroy() {
        this._disposeDocumentResizeListener();
        this._disposeScrollListener();
    }

    handleScroll() {
        const handler = () => {
            if (!this.enabled) {
                this.update.emit(this.items);
                return;
            }
            this.refresh();
        };
        this._disposeScrollListener = this._renderer.listen(this.scrollElementRef.nativeElement, 'scroll', handler);
    }

    ngAfterContentInit() {
        this.init.emit();
    }


    refresh() {
        if (!this.enabled) {
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

    private _calculateItems() {
        NgZone.assertNotInAngularZone();
        let items = this.items || [];
        const d = this._calculateDimensions();
        const range = this._virtualScrollService.calculateItemsRange(d, this.scrollElementRef, this.bufferAmount);
        this.scrollHeight = range.scrollHeight;
        this._topPadding = range.topPadding;

        if (range.start !== this._previousStart || range.end !== this._previousEnd) {

            // update the scroll list
            this._zone.run(() => {
                this.update.emit(items.slice(range.start, range.end));
            });

            this._previousStart = range.start;
            this._previousEnd = range.end;

            if (this._startupLoop === true) {
                this.refresh();
            }

        } else if (this._startupLoop === true) {
            this._startupLoop = false;
            this.refresh();
        }
    }

    private _calculateDimensions() {
        return this._virtualScrollService.calculateDimensions(this.items, this.scrollHeight, this.scrollElementRef, this.contentElementRef)
    }

    private _handleDocumentResize() {
        const handler = () => {
            if (this._ngSelect.appendTo) {
                this._updateAppendedDropdownPosition();
            }
        };

        this._disposeDocumentResizeListener = this._renderer.listen('window', 'resize', handler);
    }

    private _handleAppendTo() {
        if (this._ngSelect.appendTo === 'body') {
            document.body.appendChild(this._elementRef.nativeElement);
        } else {
            const parent = document.querySelector(this._ngSelect.appendTo);
            if (!parent) {
                throw new Error(`appendTo selector ${this._ngSelect.appendTo} did not found any parent element`)
            }
            parent.appendChild(this._elementRef.nativeElement);
        }
        this._handleDocumentResize();
        this._updateAppendedDropdownPosition();
    }

    private _updateAppendedDropdownPosition() {
        const selectRect: ClientRect = this._ngSelect.elementRef.nativeElement.getBoundingClientRect();
        const dropdownPanel: HTMLElement = this._elementRef.nativeElement;
        const bodyRect = document.body.getBoundingClientRect();
        const offsetTop = selectRect.top - bodyRect.top;
        const offsetLeft = selectRect.left - bodyRect.left;
        const topDelta = this._ngSelect.currentDropdownPosition === 'bottom' ? selectRect.height : -dropdownPanel.clientHeight;
        dropdownPanel.style.top = offsetTop + topDelta + 'px';
        dropdownPanel.style.bottom = 'auto';
        dropdownPanel.style.left = offsetLeft + 'px';
        dropdownPanel.style.width = selectRect.width + 'px';
    }

    private _autoPositionDropdown() {
        const ngOption = this._elementRef.nativeElement.querySelector('.ng-option');
        if (!ngOption) {
            setTimeout(() => { this._autoPositionDropdown(); }, 50);
            return;
        }

        const selectRect: ClientRect = this._ngSelect.elementRef.nativeElement.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectRect.top + window.pageYOffset;
        const height = selectRect.height;
        const dropdownHeight = this._elementRef.nativeElement.getBoundingClientRect().height;
        if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
            this._ngSelect.currentDropdownPosition = 'top';
        } else {
            this._ngSelect.currentDropdownPosition = 'bottom';
        }
    }
}
