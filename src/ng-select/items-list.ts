import { NgOption } from './ng-select.types';
import * as searchHelper from './search-helper';
import { NgSelectComponent } from './ng-select.component';
import { isObject, isDefined, isFunction } from './value-utils';
import { newId } from './id';
import { SelectionModel } from './selection-model';

type OptionGroups = Map<string, NgOption[]>;

export class ItemsList {

    private _items: NgOption[] = [];
    private _filteredItems: NgOption[] = [];
    private _groups: OptionGroups;
    private _markedIndex = -1;
    private _selectionModel = new SelectionModel();

    constructor(private _ngSelect: NgSelectComponent) { }

    get items(): NgOption[] {
        return this._items;
    }

    get filteredItems(): NgOption[] {
        return this._filteredItems;
    }

    get selectedItems() {
        return this._selectionModel.value;
    }

    get markedItem(): NgOption {
        return this._filteredItems[this._markedIndex];
    }

    get markedIndex(): number {
        return this._markedIndex;
    }

    get noItemsToSelect(): boolean {
        return this._ngSelect.hideSelected && this._items.length === this.selectedItems.length;
    }

    get maxItemsSelected(): boolean {
        return this._ngSelect.multiple && this._ngSelect.maxSelectedItems <= this.selectedItems.length;
    }

    get lastSelectedItem() {
        return this.selectedItems[this.selectedItems.length - 1];
    }

    setItems(items: any[]) {
        this._items = items.map((item, index) => this.mapItem(item, index));
        if (this._ngSelect.groupBy) {
            this._groups = this._groupBy(this._items, this._ngSelect.groupBy);
            this._items = this._flatten(this._groups);
        } else {
            this._groups = new Map();
            this._groups.set(undefined, this._items)
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

        this._selectionModel.select(this._items, item, this._ngSelect.multiple);

        if (this._ngSelect.hideSelected) {
            this._filteredItems = this._filteredItems.filter(x => x !== item);
            if (isDefined(item.parent)) {
                const children = this._filteredItems.filter(x => x.parent === item.parent);
                if (children.length === 0) {
                    this._filteredItems = this._filteredItems.filter(x => x !== item.parent);
                }
            } else if (item.hasChildren) {
                this._filteredItems = this.filteredItems.filter(x => x.parent !== item);
            }
        }
    }

    unselect(item: NgOption) {
        this._selectionModel.unselect(this._items, item, this._ngSelect.multiple);

        if (this._ngSelect.hideSelected && isDefined(item.index)) {
            this._filteredItems.splice(item.index, 0, item);
            if (isDefined(item.parent)) {
                const isParentAddedBack = isDefined(this._filteredItems.find(x => x === item.parent));
                if (!isParentAddedBack) {
                    const parent = this._items.find(x => x === item.parent);
                    this._filteredItems.splice(parent.index, 0, parent);
                }
            } else if (item.hasChildren) {
                const children = this._items.filter(x => x.parent === item);
                for (const child of children) {
                    child.selected = false;
                    this._filteredItems.splice(child.index, 0, child);
                }
            }
            this._filteredItems = [...this._filteredItems.sort((a, b) => (a.index - b.index))];
        }
    }

    findItem(value: any): NgOption {
        let findBy: (item: NgOption) => boolean;
        if (this._ngSelect.compareWith) {
            findBy = item => this._ngSelect.compareWith(item.value, value)
        } else if (this._ngSelect.bindValue) {
            findBy = item => !item.hasChildren && this.resolveNested(item.value, this._ngSelect.bindValue) === value
        } else {
            findBy = item => item.value === value ||
                !item.hasChildren && item.label && item.label === this.resolveNested(value, this._ngSelect.bindLabel)
        }
        return this._items.find(item => findBy(item));
    }

    addItem(item: any) {
        const option = this.mapItem(item, this._items.length);
        this._items.push(option);
        this._filteredItems.push(option);
        return option;
    }

    clearSelected() {
        this._selectionModel.clear();
        this._items.forEach((item) => {
            item.selected = false;
            item.marked = false;
        });
        if (this._ngSelect.hideSelected) {
            this.resetFilteredItems();
        }
    }

    findByLabel(term: string) {
        term = searchHelper.stripSpecialChars(term).toLocaleLowerCase();
        return this.filteredItems.find(item => {
            const label = searchHelper.stripSpecialChars(item.label).toLocaleLowerCase();
            return label.substr(0, term.length) === term;
        });
    }

    filter(term: string): void {
        if (!term) {
            this.resetFilteredItems();
            return;
        }

        this._filteredItems = [];
        term = this._ngSelect.searchFn ? term : searchHelper.stripSpecialChars(term).toLocaleLowerCase();
        const match = this._ngSelect.searchFn || this._defaultSearchFn;
        const hideSelected = this._ngSelect.hideSelected;

        for (const key of Array.from(this._groups.keys())) {
            const matchedItems = [];
            for (const item of this._groups.get(key)) {
                if (hideSelected && (item.parent && item.parent.selected || item.selected)) {
                    continue;
                }
                const searchItem = this._ngSelect.searchFn ? item.value : item;
                if (match(term, searchItem)) {
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

    resetFilteredItems() {
        if (this._filteredItems.length === this._items.length) {
            return;
        }

        if (this._ngSelect.hideSelected && this.selectedItems.length > 0) {
            this._filteredItems = this._items.filter(x => !x.selected);
        } else {
            this._filteredItems = this._items;
        }
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
        const indexOfLastSelected = this._ngSelect.hideSelected ? -1 : this._filteredItems.indexOf(this.lastSelectedItem);
        if (this.lastSelectedItem && indexOfLastSelected > -1) {
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
        let label = '';
        if (isDefined(item.label)) {
            label = item.label;
        } else {
            label = this.resolveNested(item, this._ngSelect.bindLabel);
            label = isDefined(label) ? label.toString() : '';
        }
        const value = isDefined(item.$ngOptionValue) ? item.$ngOptionValue : item;
        return {
            index: index,
            label: label,
            value: value,
            disabled: item.disabled,
            htmlId: newId()
        };
    }

    mapSelectedItems() {
        this.selectedItems.forEach((selected, i) => {
            const value = this._ngSelect.bindValue ? selected.value[this._ngSelect.bindValue] : selected.value;
            const item = this.findItem(value);
            if (item && selected !== item) {
                item.selected = true;
                this.selectedItems[i] = item;
            }
        });

        if (this._ngSelect.hideSelected) {
            this._filteredItems = this.filteredItems.filter(x => this.selectedItems.indexOf(x) === -1);
        }
    }

    private _defaultSearchFn(search: string, opt: NgOption) {
        const label = searchHelper.stripSpecialChars(opt.label).toLocaleLowerCase();
        return label.indexOf(search) > -1
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

    private _groupBy(items: NgOption[], prop: string | Function): OptionGroups {
        const isFn = isFunction(this._ngSelect.groupBy);
        const groups = new Map<string, NgOption[]>();
        for (const item of items) {
            let key = isFn ? (<Function>prop).apply(this, [item.value]) : item.value[<string>prop];
            key = isDefined(key) ? key : undefined;
            const group = groups.get(key);
            if (group) {
                group.push(item);
            } else {
                groups.set(key, [item]);
            }
        }
        return groups;
    }

    private _flatten(groups: OptionGroups) {
        const isFn = isFunction(this._ngSelect.groupBy);
        const items = [];
        const withoutGroup = groups.get(undefined) || [];
        items.push(...withoutGroup);
        let i = withoutGroup.length;
        for (const key of Array.from(groups.keys())) {
            if (!isDefined(key)) {
                continue;
            }
            const parent: NgOption = {
                label: key,
                hasChildren: true,
                parent: null,
                index: i++,
                disabled: !this._ngSelect.selectableGroup,
                htmlId: newId()
            };
            const groupKey = isFn ? this._ngSelect.bindLabel : this._ngSelect.groupBy;
            parent.value = { [groupKey]: key };
            items.push(parent);

            const children = groups.get(key).map(x => {
                x.parent = parent;
                x.hasChildren = false;
                x.index = i++;
                return x;
            });
            items.push(...children);
        }
        return items;
    }
}
