/**
 * The MIT License (MIT)
 * Copyright (c) 2016 Rinto Jose (rintoj)
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgModule,
    OnChanges,
    OnInit,
    Output,
    Renderer,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import {CommonModule} from '@angular/common';

export interface ChangeEvent {
    start?: number;
    end?: number;
}

@Component({
    selector: 'virtual-scroll,[virtualScroll]',
    exportAs: 'virtualScroll',
    template: `
        <div class="total-padding" [style.height]="scrollHeight + 'px'"></div>
        <div class="scrollable-content" #content [style.transform]="'translateY(' + topPadding + 'px)'">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        :host {
            overflow: hidden;
            overflow-y: auto;
            position: relative;
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
export class VirtualScrollComponent implements OnInit, OnChanges {

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

    @Output()
    update: EventEmitter<any[]> = new EventEmitter<any[]>();

    @Output()
    change: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

    @Output()
    start: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

    @Output()
    end: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

    @ViewChild('content', {read: ElementRef})
    contentElementRef: ElementRef;

    topPadding: number;
    scrollHeight: number;
    previousStart: number;
    previousEnd: number;
    startupLoop = true;

    constructor(private element: ElementRef, private renderer: Renderer) {
    }

    @HostListener('scroll')
    onScroll(e: Event) {
        this.refresh();
    }

    ngOnInit() {
        this.scrollbarWidth = 0; // this.element.nativeElement.offsetWidth - this.element.nativeElement.clientWidth;
        this.scrollbarHeight = 0; // this.element.nativeElement.offsetHeight - this.element.nativeElement.clientHeight;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.previousStart = undefined;
        this.previousEnd = undefined;
        const items = (changes as any).items || {};
        if ((changes as any).items !== undefined && items.previousValue === undefined ||
            (items.previousValue !== undefined && items.previousValue.length === 0)) {
            this.startupLoop = true;
        }
        this.refresh();
    }

    refresh() {
        requestAnimationFrame(() => this.calculateItems());
    }

    scrollInto(item: any) {
        let index: number = (this.items || []).indexOf(item);
        if (index < 0 || index >= (this.items || []).length) {
            return;
        }

        let d = this.calculateDimensions();
        this.element.nativeElement.scrollTop = Math.floor(index / d.itemsPerRow) * d.childHeight;
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

    private calculateDimensions() {
        let el = this.element.nativeElement;
        let content = this.contentElementRef.nativeElement;

        let items = this.items || [];
        let itemCount = items.length;
        let viewWidth = el.clientWidth - this.scrollbarWidth;
        let viewHeight = el.clientHeight - this.scrollbarHeight;

        let contentDimensions;
        if (this.childWidth === undefined || this.childHeight === undefined) {
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
        let el = this.element.nativeElement;

        let d = this.calculateDimensions();
        let items = this.items || [];
        this.scrollHeight = d.childHeight * d.itemCount / d.itemsPerRow;
        if (this.element.nativeElement.scrollTop > this.scrollHeight) {
            this.element.nativeElement.scrollTop = this.scrollHeight;
        }

        let scrollTop = Math.max(0, el.scrollTop);
        let indexByScrollTop = scrollTop / this.scrollHeight * d.itemCount / d.itemsPerRow;
        let end = Math.min(d.itemCount, Math.ceil(indexByScrollTop) * d.itemsPerRow + d.itemsPerRow * (d.itemsPerCol + 1));

        let maxStartEnd = end;
        const modEnd = end % d.itemsPerRow;
        if (modEnd) {
            maxStartEnd = end + d.itemsPerRow - modEnd;
        }
        let maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow);
        let start = Math.min(maxStart, Math.floor(indexByScrollTop) * d.itemsPerRow);

        this.topPadding = d.childHeight * Math.ceil(start / d.itemsPerRow);

        start = !isNaN(start) ? start : -1;
        end = !isNaN(end) ? end : -1;
        start -= this.bufferAmount;
        start = Math.max(0, start);
        end += this.bufferAmount;
        end = Math.min(items.length, end);
        if (start !== this.previousStart || end !== this.previousEnd) {

            // update the scroll list
            this.update.emit(items.slice(start, end));

            // emit 'start' event
            if (start !== this.previousStart && this.startupLoop === false) {
                this.start.emit({start, end});
            }

            // emit 'end' event
            if (end !== this.previousEnd && this.startupLoop === false) {
                this.end.emit({start, end});
            }

            this.previousStart = start;
            this.previousEnd = end;

            if (this.startupLoop === true) {
                this.refresh();
            } else {
                this.change.emit({start, end});
            }

        } else if (this.startupLoop === true) {
            this.startupLoop = false;
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
