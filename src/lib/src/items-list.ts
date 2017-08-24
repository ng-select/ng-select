import { NgOption, FilterFunc } from './ng-select.types';

export class ItemsList {

    items: NgOption[] = [];
    filteredItems: NgOption[] = [];

    markedItem: NgOption = null;
    private _markedItemIndex = -1;

    private _selected: NgOption[] = [];

    private _valueIndex = -1;
    private _multiple: boolean;

    constructor(items: NgOption[]) {
        this.items = items;
        this.filteredItems = [...items];
    }

    select(item: NgOption) {
        if (!this._multiple) {
            this.clearSelected();
        }

        if (item.selected) {
            this._selected = this._selected.filter(x => x !== item)
        } else {
            this._selected.push(item);
        }
        item.selected = !item.selected;

        //TODO: move mark logic to onOpen event?
        this.markItem();
    }

    markItem() {
        this.markedItem = this._selected[this._selected.length - 1]; //start from last selected
        this._valueIndex = this.filteredItems.indexOf(this.markedItem);
    }

    clearSelected() {
        this._selected.forEach((item) => {
            item.selected = false;
        })
        this._selected = [];

        this._valueIndex = -1;
        this._markedItemIndex = -1;
    }

    get value(): NgOption | NgOption[] {
        if (this._multiple) {
            return this._selected;
        }
        return this._selected[0];
    }

    setMultiple(multiple: boolean) {
        this._multiple = multiple;
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
