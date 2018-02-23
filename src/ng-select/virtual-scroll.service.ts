import { Injectable } from '@angular/core';

export interface ItemsDimensions {
    itemsLength: number;
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

    calculateItems(d: ItemsDimensions, dropdownEl: HTMLElement, bufferAmount: number): ItemsRangeResult {
        const scrollHeight = d.childHeight * d.itemsLength;
        if (dropdownEl.scrollTop > scrollHeight) {
            dropdownEl.scrollTop = scrollHeight;
        }

        const scrollTop = Math.max(0, dropdownEl.scrollTop);
        const indexByScrollTop = scrollTop / scrollHeight * d.itemsLength;
        let end = Math.min(d.itemsLength, Math.ceil(indexByScrollTop) + (d.itemsPerCol + 1));

        const maxStartEnd = end;
        const maxStart = Math.max(0, maxStartEnd - d.itemsPerCol - 1);
        let start = Math.min(maxStart, Math.floor(indexByScrollTop));

        let topPadding = d.childHeight * Math.ceil(start) - (d.childHeight * Math.min(start, bufferAmount));
        topPadding = !isNaN(topPadding) ? topPadding : 0;
        start = !isNaN(start) ? start : -1;
        end = !isNaN(end) ? end : -1;
        start -= bufferAmount;
        start = Math.max(0, start);
        end += bufferAmount;
        end = Math.min(d.itemsLength, end);

        return {
            topPadding: topPadding,
            scrollHeight: scrollHeight,
            start: start,
            end: end
        }
    }

    calculateDimensions(itemsLength: number, dropdownEl: HTMLElement, contentEl: HTMLElement): ItemsDimensions {
        const viewWidth = dropdownEl.clientWidth;
        const viewHeight = dropdownEl.clientHeight;

        let contentDimensions;

        contentDimensions = contentEl.children[0] ? contentEl.children[0].getBoundingClientRect() : {
            width: viewWidth,
            height: viewHeight
        };
        const childWidth = contentDimensions.width;
        const childHeight = contentDimensions.height;
        const itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight));

        return {
            itemsLength: itemsLength,
            viewWidth: viewWidth,
            viewHeight: viewHeight,
            childWidth: childWidth,
            childHeight: childHeight,
            itemsPerCol: itemsPerCol
        };
    }
}
