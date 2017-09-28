import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';

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
        return this._selected[0] || null;
    }

    select(item: NgOption) {
        if (!this._multiple) {
            this.clearSelected();
        }
        this._selected.push(item);
        item.selected = true;
    }

    unSelect(item: NgOption) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;
    }

    clearSelected() {
        this._selected.forEach((item) => {
            item.selected = false;
            item.marked = false;
        });
        this._selected = [];
    }

    filter(term: string, bindLabel: string) {
        this.unmarkCurrentItem();
        const filterFuncVal = this.getDefaultFilterFunc(term, bindLabel);
        this.filteredItems = term ? this.items.filter(val => filterFuncVal(val)) : this.items;
        this.markItem(0);
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

    markSelection() {
        if (this.filteredItems.length === 0) {
            return;
        }

        const lastSelected = this._selected[this._selected.length - 1];
        const index = lastSelected ? this.filteredItems.indexOf(lastSelected) : 0;
        this.markItem(index);
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

    private getDefaultFilterFunc(term, bindLabel: string) {
        return (val: NgOption) => {
            return searchHelper.stripSpecialChars(val[bindLabel])
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) > -1;
        };
    }

    private markItem(index: number) {
        this._markedItemIndex = index;
        this.markedItem = this.filteredItems[this._markedItemIndex];
        if (this.markedItem) {
            this.markedItem.marked = true;
        }
    }
}
