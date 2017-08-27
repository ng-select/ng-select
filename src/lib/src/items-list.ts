import { FilterFunc, NgOption } from './ng-select.types';

export class ItemsList {

    items: NgOption[] = [];
    filteredItems: NgOption[] = [];
    markedItem: NgOption = null;

    private _markedItemIndex = -1;
    private _selected: NgOption[] = [];
    private _multiple: boolean;

    constructor(items: NgOption[], multiple: boolean) {
        this.items = items;
        this.filteredItems = [...items];
        this._multiple = multiple;
    }

    get value(): NgOption | NgOption[] {
        if (this._multiple) {
            return this._selected;
        }
        return this._selected[0];
    }

    select(item: NgOption) {
        if (!this._multiple) {
            this.clearSelected();
        }

        if (item.selected) {
            this._selected = this._selected.filter(x => x !== item);
        } else {
            this._selected.push(item);
        }
        item.selected = !item.selected;
    }

    clearSelected() {
        this._selected.forEach((item) => {
            item.selected = false;
        });
        this._selected = [];
    }

    filter(term: string, filterFunc: FilterFunc) {
        this._markedItemIndex = -1;
        const filterFuncVal = filterFunc(term);
        this.filteredItems = term ? this.items.filter(filterFuncVal) : this.items;
    }

    clearFilter() {
        this.filteredItems = [...this.items];
    }

    markNextItem() {
        this.stepToItem(+1);
    }

    markPreviousItem() {
        this.stepToItem(-1);
    }

    markLastSelection() {
        const lastSelected = this._selected[this._selected.length - 1];
        this._markedItemIndex = this.filteredItems.indexOf(lastSelected);
    }

    unmarkCurrentItem() {
        if (this.markedItem) {
            this.markedItem.marked = false;
        }
    }

    private getNextItemIndex(delta: number) {
        if (delta > 0) {
            return (this._markedItemIndex === this.filteredItems.length - 1) ? 0 : (this._markedItemIndex + 1);
        } else {
            return (this._markedItemIndex === 0) ? (this.filteredItems.length - 1) : (this._markedItemIndex - 1);
        }
    }

    private stepToItem(steps: number) {
        if (this.filteredItems.length === 0) {
            return;
        }

        this._markedItemIndex = this.getNextItemIndex(steps);
        this.unmarkCurrentItem();
        this.markedItem = this.filteredItems[this._markedItemIndex];
        while (this.markedItem.disabled) {
            this.stepToItem(steps);
        }
        this.markedItem.marked = true; // TODO: do we need marked property on model?
    }
}
