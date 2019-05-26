export interface ItemsDimensions {
    itemsLength: number;
    viewHeight: number;
    childHeight: number;
    itemsPerCol: number;
}

export interface ItemsRangeResult {
    scrollHeight: number;
    topPadding: number;
    start: number;
    end: number;
}

export interface PanelDimensions {
    itemHeight: number;
    panelHeight: number;
}

// @Injectable({ providedIn: 'root' })
export class VirtualScrollService {

    private _dimensions: PanelDimensions;

    get dimensions() {
        return this._dimensions;
    }

    calculateItems(d: ItemsDimensions, dropdown: HTMLElement, bufferAmount: number): ItemsRangeResult {
        const scrollHeight = d.childHeight * d.itemsLength;
        if (dropdown.scrollTop > scrollHeight) {
            dropdown.scrollTop = scrollHeight;
        }

        const scrollTop = Math.max(0, dropdown.scrollTop);
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

    setInitialDimensions(itemHeight: number, panelHeight: number) {
        this._dimensions = {
            itemHeight,
            panelHeight
        };
    }

    calculateDimensions(itemsLength: number): ItemsDimensions {
        const itemsPerCol = Math.max(1, Math.floor(this.dimensions.panelHeight / this.dimensions.itemHeight));

        return {
            itemsLength: itemsLength,
            viewHeight: this.dimensions.panelHeight,
            childHeight: this.dimensions.itemHeight,
            itemsPerCol: itemsPerCol,
        };
    }
}
