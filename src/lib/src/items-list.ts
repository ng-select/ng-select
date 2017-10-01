import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';

export class ItemsList {

    items: NgOption[] = [];
    filteredItems: NgOption[] = [];

    private _markedIndex = -1;
    private _selected: NgOption[] = [];
    private _multiple = false;
    private _pendingValue = null;

    get value(): NgOption | NgOption[] {
        if (this._multiple) {
            return this._selected;
        }
        return this._selected[0] || null;
    }

    get markedItem(): NgOption {
        return this.filteredItems[this._markedIndex];
    }

    get pendingValue() {
        return this._pendingValue;
    }

    set pendingValue(value) {
        this._pendingValue = value;
    }

    setItems(items: NgOption[]) {
        this.items = this.mapItems(items);
        this.filteredItems = [...this.items];
    }

    setMultiple(multiple: boolean) {
        this._multiple = multiple;
        this._selected = [];
    }

    select(item: NgOption) {
        if (!this._multiple) {
            this.clearSelected();
        }
        this._selected.push(item);
        item.selected = true;
    }

    findItemIndex(value, bindLabel: string, bindValue: string) {
        let index = -1;
        if (bindValue) {
            index = this.items.findIndex(x => x[bindValue] === value);
        } else {
            index = this.items.indexOf(value);
            index = index > -1 ? index :
                this.items.findIndex(x => x[bindLabel] === value[bindLabel])
        }
        return index;
    }

    unselect(item: NgOption) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;
    }

    unselectLastItem() {
        if (this._selected.length === 0) {
            return;
        }

        this._selected[this._selected.length - 1].selected = false;
        this._selected.splice(this._selected.length - 1, 1);
    }

    clearSelected() {
        this._selected.forEach((item) => {
            item.selected = false;
            item.marked = false;
        });
        this._selected = [];
    }

    filter(term: string, bindLabel: string) {
        const filterFuncVal = this.getDefaultFilterFunc(term, bindLabel);
        this.filteredItems = term ? this.items.filter(val => filterFuncVal(val)) : this.items;
        this._markedIndex = 0;
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

    markItem(item: NgOption = null) {
        if (this.filteredItems.length === 0) {
            return;
        }

        item = item || this.lastSelectedItem;
        if (item) {
            this._markedIndex = this.filteredItems.indexOf(item);
        } else {
            this._markedIndex = 0;
        }
    }

    private getNextItemIndex(steps: number) {
        if (steps > 0) {
            return (this._markedIndex === this.filteredItems.length - 1) ? 0 : (this._markedIndex + 1);
        } else {
            return (this._markedIndex === 0) ? (this.filteredItems.length - 1) : (this._markedIndex - 1);
        }
    }

    private stepToItem(steps: number) {
        if (this.filteredItems.length === 0) {
            return;
        }

        this._markedIndex = this.getNextItemIndex(steps);
        while (this.markedItem.disabled) {
            this.stepToItem(steps);
        }
    }

    private getDefaultFilterFunc(term, bindLabel: string) {
        return (val: NgOption) => {
            return searchHelper.stripSpecialChars(val[bindLabel])
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) > -1;
        };
    }

    private get lastSelectedItem() {
        return this._selected[this._selected.length - 1];
    }

    private mapItems(items: NgOption[]) {
        return items.map((item, index) => {
            return {
                index: index,
                ...item
            };
        })
    }
}
