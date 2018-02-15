import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';
import { NgSelectComponent } from './ng-select.component';

export class ItemsList {

    private _items: NgOption[] = [];
    private _filteredItems: NgOption[] = [];
    private _markedIndex = -1;
    private _selected: NgOption[] = [];

    constructor(private _ngSelect: NgSelectComponent) { }

    get items(): NgOption[] {
        return this._items;
    }

    get filteredItems(): NgOption[] {
        return this._filteredItems;
    }

    get value(): NgOption[] {
        return this._selected;
    }

    get markedItem(): NgOption {
        return this._filteredItems[this._markedIndex];
    }

    get markedIndex(): number {
        return this._markedIndex;
    }

    setItems(items: any[], simple = false) {
        if (this._ngSelect.groupBy) {
            const groups = this._groupBy(items, this._ngSelect.groupBy);
            this._items = this._flatten(groups);
        } else {
            this._items = items.map((item, index) => this.mapItem(item, simple, index));
        }
        this._filteredItems = [...this._items];
    }

    private _groupBy(items: any, prop: string | Function): { [index: string]: NgOption[] } {
        const groups = items.reduce((grouped, item) => {
            const key = prop instanceof Function ? prop.apply(this, [item]) : item[prop];
            grouped[key] = grouped[key] || [];
            grouped[key].push(item);
            return grouped;
        }, {});
        return groups;
    }

    private _flatten(groups: { [index: string]: NgOption[] }) {
        let i = 0;
        return Object.keys(groups).reduce((items: NgOption[], key: string) => {
            const parent: NgOption = { label: key, head: true, index: i };
            items.push(parent);
            i++
            const children = groups[key].map(x => {
                x = this.mapItem(x, false, i);
                x.parent = parent;
                x.head = false;
                i++;
                return x;
            });
            items.push(...children)
            return items;
        }, []);
    }

    select(item: NgOption) {
        if (item.selected || this.maxItemsSelected()) {
            return;
        }
        if (!this._ngSelect.multiple) {
            this.clearSelected();
        }
        this._selected.push(item);
        item.selected = true;
    }

    maxItemsSelected(): boolean {
        return this._ngSelect.multiple && this._ngSelect.maxSelectedItems <= this._selected.length;
    }

    findItem(value: any): NgOption {
        if (this._ngSelect.bindValue) {
            return this._items.find(item => this.resolveNested(item.value, this._ngSelect.bindValue) === value);
        }
        const index = this._items.findIndex(x => x.value === value);
        return index > -1 ? this._items[index] :
            this._items.find(item => item.label && item.label === this.resolveNested(value, this._ngSelect.bindLabel));
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
            index: this._items.length,
            label: this.resolveNested(item, this._ngSelect.bindLabel),
            value: item
        };
        this._items.push(option);
        this._filteredItems.push(option);
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
        this._filteredItems = term ? this._items.filter(val => filterFuncVal(val)) : this._items;
    }

    clearFilter() {
        this._filteredItems = [...this._items];
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
        this._markedIndex = this._filteredItems.indexOf(item);
    }

    markSelectedOrDefault(markDefault: boolean) {
        if (this._filteredItems.length === 0) {
            return;
        }

        if (this._lastSelectedItem) {
            this._markedIndex = this._filteredItems.indexOf(this._lastSelectedItem);
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
            label = this.resolveNested(option, this._ngSelect.bindLabel);
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
            return (this._markedIndex === this._filteredItems.length - 1) ? 0 : (this._markedIndex + 1);
        }
        return (this._markedIndex <= 0) ? (this._filteredItems.length - 1) : (this._markedIndex - 1);
    }

    private _stepToItem(steps: number) {
        if (this._filteredItems.length === 0) {
            return;
        }

        this._markedIndex = this._getNextItemIndex(steps);
        while (this.markedItem.disabled) {
            this._stepToItem(steps);
        }
    }

    private _getDefaultFilterFunc(term: string) {
        return (option: NgOption) => {
            return searchHelper.stripSpecialChars(option.label ? option.label.toString() : '')
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) > -1;
        };
    }

    private get _lastSelectedItem() {
        return this._selected[this._selected.length - 1];
    }
}
