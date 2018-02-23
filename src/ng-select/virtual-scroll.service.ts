import { Injectable, ElementRef } from '@angular/core';

export interface ItemsDimensions {
    itemCount: number;
    viewWidth: number;
    viewHeight: number;
    childWidth: number;
    childHeight: number;
    itemsPerCol: number;
}

export interface ItemsRangeResult {
    scrollHeight: number;
    topPadding: number;
    start: number;
    end: number;
}

@Injectable()
export class VirtualScrollService {

    calculateItems(d: ItemsDimensions, dropdownRef: ElementRef, bufferAmount: number): ItemsRangeResult {
        let el = dropdownRef.nativeElement;
        const scrollHeight = d.childHeight * d.itemCount;
        if (el.scrollTop > scrollHeight) {
            el.scrollTop = scrollHeight;
        }

        let scrollTop = Math.max(0, el.scrollTop);
        let indexByScrollTop = scrollTop / scrollHeight * d.itemCount;
        let end = Math.min(d.itemCount, Math.ceil(indexByScrollTop) + (d.itemsPerCol + 1));

        let maxStartEnd = end;

        let maxStart = Math.max(0, maxStartEnd - d.itemsPerCol - 1);
        let start = Math.min(maxStart, Math.floor(indexByScrollTop));

        let topPadding = d.childHeight * Math.ceil(start) - (d.childHeight * Math.min(start, bufferAmount));
        topPadding = !isNaN(topPadding) ? topPadding : 0;
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

    calculateDimensions(itemCount: number, dropdownRef: ElementRef, contentRef: ElementRef): ItemsDimensions {
        let el: Element = dropdownRef.nativeElement;
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
        let itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));

        return {
            itemCount: itemCount,
            viewWidth: viewWidth,
            viewHeight: viewHeight,
            childWidth: childWidth,
            childHeight: childHeight,
            itemsPerCol: itemsPerCol
        };
    }
}
