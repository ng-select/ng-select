/**
 * The MIT License (MIT)
 * Copyright (c) 2016 Rinto Jose (rintoj)
 * Source code https://github.com/rintoj/angular2-virtual-scroll
 */

import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    NgModule, NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output, Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'virtual-scroll,[virtualScroll]',
    exportAs: 'virtualScroll',
    template: `
        <div *ngIf="enabled" class="total-padding" [style.height]="scrollHeight + 'px'"></div>
        <div #content
             [class.scrollable-content]="enabled"
             [style.transform]="transformStyle">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        :host {
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
export class VirtualScrollComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    items: any[] = [];

    @Input()
    scrollbarWidth: number;

    @Input()
    scrollbarHeight: number;

    @Input()
    childWidth: number;

    @Input()
    childHeight: number;

    @Input()
    bufferAmount = 0;

    @Input()
    disabled = false;

    @Output()
    update: EventEmitter<any[]> = new EventEmitter<any[]>();

    @ViewChild('content', { read: ElementRef })
    contentElementRef: ElementRef;

    @ContentChild('container')
    containerElementRef: ElementRef;

    topPadding: number;
    scrollHeight: number;

    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
    private _disposeScrollListener = () => { };

    constructor(private element: ElementRef, private zone: NgZone, private renderer: Renderer2) {
    }

    get enabled() {
        return !this.disabled && this.items && this.items.length > 20;
    }

    get transformStyle() {
        return this.enabled ? 'translateY(' + this.topPadding + 'px)' : 'none'
    }

    handleScroll() {
        const handler = () => {
            if (!this.enabled) {
                this.update.emit(this.items);
                return;
            }
            this.refresh();
        };
        this._disposeScrollListener = this.renderer.listen(this.element.nativeElement, 'scroll', handler);
    }

    ngOnInit() {
        this.handleScroll();
        this.scrollbarWidth = 0; // this.element.nativeElement.offsetWidth - this.element.nativeElement.clientWidth;
        this.scrollbarHeight = 0; // this.element.nativeElement.offsetHeight - this.element.nativeElement.clientHeight;
    }

    ngOnDestroy() {
        this._disposeScrollListener();
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

    refresh() {
        if (!this.enabled) {
            this.update.emit(this.items);
            return;
        }
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this.calculateItems());
        });
    }

    scrollInto(item: any) {
        let el: Element = this.element.nativeElement;
        let index: number = (this.items || []).indexOf(item);
        if (index < 0 || index >= (this.items || []).length) {
            return;
        }

        const d = this.calculateDimensions();
        const buffer = Math.floor(d.viewHeight / d.childHeight) - 1;
        el.scrollTop = (Math.floor(index / d.itemsPerRow) * d.childHeight)
            - (d.childHeight * Math.min(index, buffer));
        this.refresh();
    }

    scrollIntoTag() {
        let el: Element = this.element.nativeElement;
        const d = this.calculateDimensions();
        el.scrollTop = el.scrollTop + d.childHeight;
        this.refresh();
    }

    private countItemsPerRow() {
        let offsetTop;
        let itemsPerRow;
        let children = this.contentElementRef.nativeElement.children;
        for (itemsPerRow = 0; itemsPerRow < children.length; itemsPerRow++) {
            if (offsetTop !== undefined && offsetTop !== children[itemsPerRow].offsetTop) {
                break;
            }
            offsetTop = children[itemsPerRow].offsetTop;
        }
        return itemsPerRow;
    }

    private getElementsOffset(): number {
        let offsetTop = 0;
        if (this.containerElementRef && this.containerElementRef.nativeElement) {
            offsetTop += this.containerElementRef.nativeElement.offsetTop;
        }
        return offsetTop;
    }

    private calculateDimensions() {
        let el: Element = this.element.nativeElement;
        let items = this.items || [];
        let itemCount = items.length;
        let viewWidth = el.clientWidth - this.scrollbarWidth;
        let viewHeight = el.clientHeight - this.scrollbarHeight;

        let contentDimensions;
        if (this.childWidth === undefined || this.childHeight === undefined) {
            let content = this.contentElementRef.nativeElement;
            if (this.containerElementRef && this.containerElementRef.nativeElement) {
                content = this.containerElementRef.nativeElement;
            }
            contentDimensions = content.children[0] ? content.children[0].getBoundingClientRect() : {
                width: viewWidth,
                height: viewHeight
            };
        }
        let childWidth = this.childWidth || contentDimensions.width;
        let childHeight = this.childHeight || contentDimensions.height;

        let itemsPerRow = Math.max(1, this.countItemsPerRow());
        let itemsPerRowByCalc = Math.max(1, Math.floor(viewWidth / childWidth));
        let itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));
        let scrollTop = Math.max(0, el.scrollTop);
        if (itemsPerCol === 1 && Math.floor(scrollTop / this.scrollHeight * itemCount) + itemsPerRowByCalc >= itemCount) {
            itemsPerRow = itemsPerRowByCalc;
        }

        return {
            itemCount: itemCount,
            viewWidth: viewWidth,
            viewHeight: viewHeight,
            childWidth: childWidth,
            childHeight: childHeight,
            itemsPerRow: itemsPerRow,
            itemsPerCol: itemsPerCol,
            itemsPerRowByCalc: itemsPerRowByCalc
        };
    }

    private calculateItems() {
        NgZone.assertNotInAngularZone();
        let el = this.element.nativeElement;

        let d = this.calculateDimensions();
        let items = this.items || [];
        let offsetTop = this.getElementsOffset();
        this.scrollHeight = d.childHeight * d.itemCount / d.itemsPerRow;
        if (el.scrollTop > this.scrollHeight) {
            el.scrollTop = this.scrollHeight + offsetTop;
        }

        let scrollTop = Math.max(0, el.scrollTop - offsetTop);
        let indexByScrollTop = scrollTop / this.scrollHeight * d.itemCount / d.itemsPerRow;
        let end = Math.min(d.itemCount, Math.ceil(indexByScrollTop) * d.itemsPerRow + d.itemsPerRow * (d.itemsPerCol + 1));

        let maxStartEnd = end;
        const modEnd = end % d.itemsPerRow;
        if (modEnd) {
            maxStartEnd = end + d.itemsPerRow - modEnd;
        }
        let maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow);
        let start = Math.min(maxStart, Math.floor(indexByScrollTop) * d.itemsPerRow);

        this.topPadding = d.childHeight * Math.ceil(start / d.itemsPerRow) - (d.childHeight * Math.min(start, this.bufferAmount));

        start = !isNaN(start) ? start : -1;
        end = !isNaN(end) ? end : -1;
        start -= this.bufferAmount;
        start = Math.max(0, start);
        end += this.bufferAmount;
        end = Math.min(items.length, end);
        if (start !== this._previousStart || end !== this._previousEnd) {

            // update the scroll list
            this.zone.run(() => {
                this.update.emit(items.slice(start, end));
            });

            this._previousStart = start;
            this._previousEnd = end;

            if (this._startupLoop === true) {
                this.refresh();
            }

        } else if (this._startupLoop === true) {
            this._startupLoop = false;
            this.refresh();
        }
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [VirtualScrollComponent],
    declarations: [VirtualScrollComponent]
})
export class VirtualScrollModule {
}
