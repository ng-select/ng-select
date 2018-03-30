import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';
import { NgSelectComponent } from './ng-select.component';
import { isObject, isDefined } from './value-utils';

export class ItemsList {

    private _items: NgOption[] = [];
    private _filteredItems: NgOption[] = [];
    private _groups: { [index: string]: NgOption[] };
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

    get noItemsToSelect(): boolean {
        return this._ngSelect.hideSelected && this._items.length === this._selected.length;
    }

    get maxItemsSelected(): boolean {
        return this._ngSelect.multiple && this._ngSelect.maxSelectedItems <= this._selected.length;
    }

    setItems(items: any[]) {
        this._items = items.map((item, index) => this.mapItem(item, index));
        if (this._ngSelect.groupBy) {
            this._groups = this._groupBy(this._items, this._ngSelect.groupBy);
            this._items = this._flatten(this._groups);
        } else {
            this._groups = { undefined: this._items };
        }
        this._filteredItems = [...this._items];
    }

    select(item: NgOption) {
        if (item.selected || this.maxItemsSelected) {
            return;
        }
        if (!this._ngSelect.multiple) {
            this.clearSelected();
        }
        this._selected.push(item);
        item.selected = true;

        if (this._ngSelect.hideSelected) {
            this._filteredItems = this._filteredItems.filter(x => x !== item);
        }
    }

    findItem(value: any): NgOption {
        if (this._ngSelect.bindValue) {
            return this._items.find(item => !item.hasChildren && this.resolveNested(item.value, this._ngSelect.bindValue) === value);
        }
        const option = this._items.find(x => x.value === value);
        const findBy = this._ngSelect.compareWith ?
            (item: NgOption) => this._ngSelect.compareWith(item.value, value) :
            (item: NgOption) => !item.hasChildren && item.label && item.label === this.resolveNested(value, this._ngSelect.bindLabel);

        return option || this._items.find(item => findBy(item));
    }

    unselect(item: NgOption) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;

        if (this._ngSelect.hideSelected) {
            this._filteredItems.splice(item.index, 0, item);
            this._filteredItems = [...this._filteredItems.sort((a, b) => (a.index - b.index))];
        }
    }

    unselectLast() {
        if (this._selected.length === 0) {
            return;
        }
        this.unselect(this._lastSelectedItem);
    }

    addItem(item: any) {
        const option = this.mapItem(item, this._items.length);
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

        if (this._ngSelect.hideSelected) {
            this.resetItems();
        }
    }

    filter(term: string) {
        if (!term) {
            this.resetItems();
            return;
        }

        this._filteredItems = [];
        term = searchHelper.stripSpecialChars(term).toLocaleLowerCase();

        for (const key of Object.keys(this._groups)) {
            const matchedItems = [];
            for (const item of this._groups[key]) {
                const label = searchHelper.stripSpecialChars(item.label).toLocaleLowerCase();
                if (this._ngSelect.hideSelected && this._selected.indexOf(item) > -1) {
                    continue;
                }
                if (label.indexOf(term) > -1) {
                    matchedItems.push(item);
                }
            }
            if (matchedItems.length > 0) {
                const [last] = matchedItems.slice(-1);
                if (last.parent) {
                    const head = this._items.find(x => x === last.parent);
                    this._filteredItems.push(head);
                }
                this._filteredItems.push(...matchedItems);
            }
        }
    }

    resetItems() {
        if (this._filteredItems.length === this._items.length) {
            return;
        }
        this._filteredItems = this._ngSelect.hideSelected ?
            this._items.filter(x => this._selected.indexOf(x) === -1) :
            this._items;
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

    markSelectedOrDefault(markDefault?: boolean) {
        if (this._filteredItems.length === 0) {
            return;
        }
        const indexOfLastSelected = this._ngSelect.hideSelected ? -1 : this._filteredItems.indexOf(this._lastSelectedItem);
        if (this._lastSelectedItem && indexOfLastSelected > -1) {
            this._markedIndex = indexOfLastSelected;
        } else {
            this._markedIndex = markDefault ? this.filteredItems.findIndex(x => !x.disabled) : -1;
        }
    }

    resolveNested(option: any, key: string): any {
        if (!isObject(option)) {
            return option;
        }
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

    mapItem(item: any, index: number): NgOption {
        const label = this.resolveNested(item, this._ngSelect.bindLabel);
        return {
            index: index,
            label: isDefined(label) ? label.toString() : '',
            value: item,
            disabled: item.disabled,
        };
    }

    mapSelectedItems() {
        this._selected.forEach((selected, i) => {
            const value = this._ngSelect.bindValue ? selected.value[this._ngSelect.bindValue] : selected.value;
            const item = this.findItem(value);
            if (item && selected !== item) {
                item.selected = true;
                this._selected[i] = item;
            }
        });

        if (this._ngSelect.hideSelected) {
            this._filteredItems = this.filteredItems.filter(x => this._selected.indexOf(x) === -1);
        }
    }

    private _getNextItemIndex(steps: number) {
        if (steps > 0) {
            return (this._markedIndex === this._filteredItems.length - 1) ? 0 : (this._markedIndex + 1);
        }
        return (this._markedIndex <= 0) ? (this._filteredItems.length - 1) : (this._markedIndex - 1);
    }

    private _stepToItem(steps: number) {
        if (this._filteredItems.length === 0 || this._filteredItems.every(x => x.disabled)) {
            return;
        }

        this._markedIndex = this._getNextItemIndex(steps);
        if (this.markedItem.disabled) {
            this._stepToItem(steps);
        }
    }

    private get _lastSelectedItem() {
        return this._selected[this._selected.length - 1];
    }

    private _groupBy(items: NgOption[], prop: string | Function): { [index: string]: NgOption[] } {
        const isPropFn = prop instanceof Function;
        const groups = items.reduce((grouped, item) => {
            const key = isPropFn ? (<Function>prop).apply(this, [item.value]) : item.value[<string>prop];
            grouped[key] = grouped[key] || [];
            grouped[key].push(item);
            return grouped;
        }, {});
        return groups;
    }

    private _flatten(groups: { [index: string]: NgOption[] }) {
        let i = 0;
        return Object.keys(groups).reduce((items: NgOption[], key: string) => {
            const parent: NgOption = {
                label: key,
                hasChildren: true,
                index: i,
                disabled: !this._ngSelect.selectableGroup
            };
            parent.value = {};
            parent.value[this._ngSelect.groupBy] = key;
            items.push(parent);
            i++

            const children = groups[key].map(x => {
                x.parent = parent;
                x.hasChildren = false;
                i++;
                return x;
            });
            items.push(...children)
            return items;
        }, []);
    }
}
