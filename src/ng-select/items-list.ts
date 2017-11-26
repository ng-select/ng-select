import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';

export class ItemsList {

    items: NgOption[] = [];
    filteredItems: NgOption[] = [];

    private _markedIndex = -1;
    private _selected: NgOption[] = [];
    private _multiple = false;
    private _simple = false;

    get value(): NgOption[] {
        return this._selected;
    }

    get markedItem(): NgOption {
        return this.filteredItems[this._markedIndex];
    }

    setItems(items: NgOption[], simple: boolean = false) {
        this._simple = simple;
        this.items = this.mapItems(items);
        this.filteredItems = [...this.items];
    }

    setMultiple(multiple: boolean) {
        this._multiple = multiple;
        this.clearSelected();
    }

    select(item: NgOption) {
        if (item.selected) {
            return;
        }
        if (!this._multiple) {
            this.clearSelected();
        }
        this._selected.push(item);
        item.selected = true;
    }

    findItem(value, bindValue: string, bindLabel: string): NgOption {
        if (!value) {
            return null;
        }
        if (bindValue) {
            return this.items.find(x => x[bindValue] === value);
        }
        const index = this.items.indexOf(value);
        return index > -1 ? this.items[index] :
            this.items.find(x => x[bindLabel] === value[bindLabel])
    }

    unselect(item: NgOption) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;
    }

    unselectLast() {
        if (this._selected.length === 0) {
            return;
        }

        this._selected[this._selected.length - 1].selected = false;
        this._selected.splice(this._selected.length - 1, 1);
    }

    addItem(item: NgOption) {
        item.index = this.items.length;
        this.items.push(item);
        this.filteredItems.push(item);
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

    markItem(item: NgOption) {
        this._markedIndex = this.filteredItems.indexOf(item);
    }

    markSelectedOrDefault(markDefault) {
        if (this.filteredItems.length === 0) {
            return;
        }

        if (this.lastSelectedItem) {
            this._markedIndex = this.filteredItems.indexOf(this.lastSelectedItem);
        } else {
            this._markedIndex = markDefault ? 0 : -1;
        }
    }

    private getNextItemIndex(steps: number) {
        if (steps > 0) {
            return (this._markedIndex === this.filteredItems.length - 1) ? 0 : (this._markedIndex + 1);
        }
        return (this._markedIndex === 0) ? (this.filteredItems.length - 1) : (this._markedIndex - 1);
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
            let option = item;
            if (this._simple) {
                option = {
                    label: item as any
                };
            }

            return {
                index: index,
                ...option
            };
        })
    }
}
