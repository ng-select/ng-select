import { NgOption, FilterFunc } from './ng-select.types';

export class ItemsList {

    items: NgOption[] = [];
    filteredItems: NgOption[] = [];

    markedItem: NgOption = null;
    private _markedItemIndex = -1;

    private _value: NgOption = null;
    private _valueIndex = -1;

    constructor(items: NgOption[]) {
        this.items = items;
        this.filteredItems = [...items];
    }

    update(items: NgOption[]) {
        this.items = items || [];
        this.filteredItems = [...this.items];
    }

    select(item: NgOption) {
        if (!item) {
            return;
        }

        if (this.markedItem) {
            this.markedItem.selected = false;
            this.markedItem.marked = false;
        }
        if (this._value) {
            this._value.selected = false;
        }

        this._value = item;
        this._valueIndex = this.filteredItems.indexOf(this._value);
        this._value.selected = true;
        this.markedItem = this._value;
    }

    clearSelected() {
        if (this._value) {
            this._value.selected = false;
        }
        this._valueIndex = -1;
        this._markedItemIndex = -1;
        this._value = null;
    }

    get value(): NgOption {
        return this._value;
    }

    set value(value: NgOption) {
        this._value = value;
    }

    filter(term: string, filterFunc: FilterFunc) {
        this._markedItemIndex = -1;
        const filterFuncVal = filterFunc(term);
        this.filteredItems = term ? this.items.filter(val => filterFuncVal(val)) : this.items;
    }

    clearFilter() {
        this.filteredItems = [...this.items];
    }

    markNextItem() {
        this._markedItemIndex = this.getNextItemIndex(+1);
        this.unmarkCurrentItem();
        this.markedItem = this.filteredItems[this._markedItemIndex];
        while (this.markedItem.disabled) {
            this.markNextItem();
        }
        this.markedItem.marked = true;
    }

    markPreviousItem() {
        this._markedItemIndex = this.getNextItemIndex(-1);
        this.unmarkCurrentItem();
        this.markedItem = this.filteredItems[this._markedItemIndex];
        while (this.markedItem.disabled) {
            this.markPreviousItem();
        }
        this.markedItem.marked = true;
    }

    markCurrentValue() {
        this._markedItemIndex = this._valueIndex;
    }

    private getNextItemIndex(delta: number) {
        if (delta > 0) {
            return (this._markedItemIndex === this.filteredItems.length - 1) ? 0 : (this._markedItemIndex + 1);
        } else {
            return (this._markedItemIndex === 0) ? (this.filteredItems.length - 1) : (this._markedItemIndex - 1);
        }
    }

    unmarkCurrentItem() {
        if (this.markedItem) {
            this.markedItem.marked = false;
        }
    }
}
