import { Injectable, ElementRef } from '@angular/core';
import { NgOption } from './ng-select.types';

export interface VirtualItemsDimensions {
    itemCount: number;
    viewWidth: number;
    viewHeight: number;
    childWidth: number;
    childHeight: number;
    itemsPerRow: number;
    itemsPerCol: number;
    itemsPerRowByCalc: number;
}

export interface VirtualItemsRange {
    scrollHeight: number;
    topPadding: number;
    start: number;
    end: number;
}

@Injectable()
export class VirtualScrollService {

    constructor() { }

    calculateItemsRange(dimensions: VirtualItemsDimensions, dropdownRef: ElementRef, bufferAmount: number) {
        let el = dropdownRef.nativeElement;
        let d = dimensions;
        const scrollHeight = d.childHeight * d.itemCount / d.itemsPerRow;
        if (el.scrollTop > scrollHeight) {
            el.scrollTop = scrollHeight;
        }

        let scrollTop = Math.max(0, el.scrollTop);
        let indexByScrollTop = scrollTop / scrollHeight * d.itemCount / d.itemsPerRow;
        let end = Math.min(d.itemCount, Math.ceil(indexByScrollTop) * d.itemsPerRow + d.itemsPerRow * (d.itemsPerCol + 1));

        let maxStartEnd = end;
        const modEnd = end % d.itemsPerRow;
        if (modEnd) {
            maxStartEnd = end + d.itemsPerRow - modEnd;
        }
        let maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow);
        let start = Math.min(maxStart, Math.floor(indexByScrollTop) * d.itemsPerRow);

        const topPadding = d.childHeight * Math.ceil(start / d.itemsPerRow) - (d.childHeight * Math.min(start, bufferAmount));

        start = !isNaN(start) ? start : -1;
        end = !isNaN(end) ? end : -1;
        start -= bufferAmount;
        start = Math.max(0, start);
        end += bufferAmount;
        end = Math.min(d.itemCount, end);

        return {
            topPadding: topPadding,
            scrollHeight: scrollHeight,
            start: start,
            end: end
        }
    }

    calculateDimensions(items: NgOption[], scrollHeight: number, dropdownRef: ElementRef, contentRef: ElementRef): VirtualItemsDimensions {
        let el: Element = dropdownRef.nativeElement;
        items = items || [];
        let itemCount = items.length;
        let viewWidth = el.clientWidth;
        let viewHeight = el.clientHeight;

        let contentDimensions;
        let content = contentRef.nativeElement;

        contentDimensions = content.children[0] ? content.children[0].getBoundingClientRect() : {
            width: viewWidth,
            height: viewHeight
        };
        let childWidth = contentDimensions.width;
        let childHeight = contentDimensions.height;

        let itemsPerRow = Math.max(1, this._countItemsPerRow(contentRef));
        let itemsPerRowByCalc = Math.max(1, Math.floor(viewWidth / childWidth));
        let itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));
        let scrollTop = Math.max(0, el.scrollTop);
        if (itemsPerCol === 1 && Math.floor(scrollTop / scrollHeight * itemCount) + itemsPerRowByCalc >= itemCount) {
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

    private _countItemsPerRow(contentRef: ElementRef) {
        let offsetTop;
        let itemsPerRow;
        let children = contentRef.nativeElement.children;
        for (itemsPerRow = 0; itemsPerRow < children.length; itemsPerRow++) {
            if (offsetTop !== undefined && offsetTop !== children[itemsPerRow].offsetTop) {
                break;
            }
            offsetTop = children[itemsPerRow].offsetTop;
        }
        return itemsPerRow;
    }
}
