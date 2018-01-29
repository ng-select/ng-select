import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';

export class ItemsList {

    items: NgOption[] = [];
    filteredItems: NgOption[] = [];

    private _markedIndex = -1;
    private _selected: NgOption[] = [];
    private _multiple = false;
    private _bindLabel: string;

    get value(): NgOption[] {
        return this._selected;
    }

    get markedItem(): NgOption {
        return this.filteredItems[this._markedIndex];
    }

    get markedIndex(): number {
        return this._markedIndex;
    }

    setItems(items: any[], bindLabel: string, simple: boolean = false) {
        this._bindLabel = bindLabel;
        this.items = items.map((item, index) => this.mapItem(item, simple, index));
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

    findItem(value: any, bindValue: string): NgOption {
        if (bindValue) {
            return this.items.find(item => item.value[bindValue] === value);
        }
        const index = this.items.findIndex(x => x.value === value);
        return index > -1 ? this.items[index] :
            this.items.find(item => item.label && item.label === this.resolveNested(value, this._bindLabel));
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

    addItem(item: any) {
        const option = {
            index: this.items.length,
            label: this.resolveNested(item, this._bindLabel),
            value: item
        }
        this.items.push(option);
        this.filteredItems.push(option);
        return option;
    }

    clearSelected() {
        this._selected.forEach((item) => {
            item.selected = false;
            item.marked = false;
        });
        this._selected = [];
    }

    filter(term: string) {
        const filterFuncVal = this._getDefaultFilterFunc(term);
        this.filteredItems = term ? this.items.filter(val => filterFuncVal(val)) : this.items;
    }

    clearFilter() {
        this.filteredItems = [...this.items];
    }

    unmarkItem() {
        this._markedIndex = -1;
    }

    markNextItem() {
        this._stepToItem(+1);
    }

    markPreviousItem() {
        this._stepToItem(-1);
    }

    markItem(item: NgOption) {
        this._markedIndex = this.filteredItems.indexOf(item);
    }

    markSelectedOrDefault(markDefault: boolean) {
        if (this.filteredItems.length === 0) {
            return;
        }

        if (this._lastSelectedItem) {
            this._markedIndex = this.filteredItems.indexOf(this._lastSelectedItem);
        } else {
            this._markedIndex = markDefault ? 0 : -1;
        }
    }

    resolveNested(option: any, key: string): any {
        if (key.indexOf('.') === -1) {
            return option[key];
        } else {
            let keys: string[] = key.split('.');
            let value = option;
            for (let i = 0, len = keys.length; i < len; ++i) {
                if (value == null) {
                    return null;
                }
                value = value[keys[i]];
            }
            return value;
        }
    }

    mapItem(item: any, simple: boolean, index: number): NgOption {
        let option = item;
        let label = null;
        if (simple) {
            option = item;
            label = item;
        } else {
            label = this.resolveNested(option, this._bindLabel);
        }
        return {
            index: index,
            label: label,
            value: option,
            disabled: option.disabled,
        };
    }

    private _getNextItemIndex(steps: number) {
        if (steps > 0) {
            return (this._markedIndex === this.filteredItems.length - 1) ? 0 : (this._markedIndex + 1);
        }
        return (this._markedIndex <= 0) ? (this.filteredItems.length - 1) : (this._markedIndex - 1);
    }

    private _stepToItem(steps: number) {
        if (this.filteredItems.length === 0) {
            return;
        }

        this._markedIndex = this._getNextItemIndex(steps);
        while (this.markedItem.disabled) {
            this._stepToItem(steps);
        }
    }

    private _getDefaultFilterFunc(term: string) {
        return (option: NgOption) => {
            return searchHelper.stripSpecialChars(option.label || '')
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) > -1;
        };
    }

    private get _lastSelectedItem() {
        return this._selected[this._selected.length - 1];
    }
}
