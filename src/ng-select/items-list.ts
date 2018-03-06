import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';
import { NgSelectComponent } from './ng-select.component';

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
            return this._items.find(item => !item.hasChildren && this.resolveNested(item.value, this._ngSelect.bindValue) === value);
        }
        const index = this._items.findIndex(x => x.value === value);
        return index > -1 ? this._items[index] :
            this._items.find(item => !item.hasChildren && item.label && item.label === this.resolveNested(value, this._ngSelect.bindLabel));
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
    }

    filter(term: string) {
        if (!term) {
            this._filteredItems = this._items;
            return;
        }

        this._filteredItems = [];
        term = searchHelper.stripSpecialChars(term).toLocaleLowerCase();

        for (const key of Object.keys(this._groups)) {
            const matchedItems = [];
            for (const item of this._groups[key]) {
                const label = searchHelper.stripSpecialChars(item.label).toLocaleLowerCase();
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

    markSelectedOrDefault(markDefault?: boolean) {
        if (this._filteredItems.length === 0) {
            return;
        }
        const indexOfLastSelected = this._filteredItems.indexOf(this._lastSelectedItem);
        if (this._lastSelectedItem && indexOfLastSelected > -1) {
            this._markedIndex = indexOfLastSelected;
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

    mapItem(item: any, index: number): NgOption {
        const option = item;
        const label = this._ngSelect.simple ? item : this.resolveNested(option, this._ngSelect.bindLabel);
        return {
            index: index,
            label: label || '',
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

    private get _lastSelectedItem() {
        return this._selected[this._selected.length - 1];
    }

    private _groupBy(items: NgOption[], prop: string): { [index: string]: NgOption[] } {
        const groups = items.reduce((grouped, item) => {
            const key = item.value[prop];
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
                disabled: true
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
