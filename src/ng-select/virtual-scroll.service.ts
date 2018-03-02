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

    calculateDimensions(itemsLength: number, index: number, panelEl: HTMLElement, contentEl: HTMLElement): ItemsDimensions {
        const panelRect = panelEl.getBoundingClientRect();
        const itemRect = contentEl.children[index] ? contentEl.children[index].getBoundingClientRect() : {
            width: panelRect.width,
            height: panelRect.height,
            top: 0,
        };
        const itemsPerCol = Math.max(1, Math.floor(panelRect.height / itemRect.height));

        return {
            itemsLength: itemsLength,
            viewWidth: panelRect.width,
            viewHeight: panelRect.height,
            childWidth: itemRect.width,
            childHeight: itemRect.height,
            itemsPerCol: itemsPerCol,
        };
    }
}
