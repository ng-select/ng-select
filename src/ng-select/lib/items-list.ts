import { NgSelectComponent } from './ng-select/ng-select.component';
import { SelectionModel } from './selection-model';
import { newId } from './types/id';
import { NgOption } from './types/ng-select.types';
import * as searchHelper from './utils/search-helper';
import { isDefined, isFunction, isObject } from './utils/value-utils';

type OptionGroups = Map<string | NgOption, NgOption[]>;

/**
 * Manages source, filtered, grouped, marked, and selected options for an ng-select instance.
 *
 * @since 3.0.0
 */
export class ItemsList {
	private _groups: OptionGroups;

	/**
	 * Creates an instance of ItemsList.
	 *
	 * @param _ngSelect - The ng select.
	 * @param _selectionModel - The selection model.
	 *
	 * @since 3.0.0
	 */
	constructor(
		private _ngSelect: NgSelectComponent,
		private _selectionModel: SelectionModel,
	) {}

	private _items: NgOption[] = [];

	/**
	 * Gets the items.
	 *
	 * @returns The items.
	 *
	 * @since 3.0.0
	 */
	get items(): NgOption[] {
		return this._items;
	}

	private _filteredItems: NgOption[] = [];

	/**
	 * Gets the filtered items.
	 *
	 * @returns The filtered items.
	 *
	 * @since 3.0.0
	 */
	get filteredItems(): NgOption[] {
		return this._filteredItems;
	}

	private _markedIndex = -1;

	/**
	 * Gets the marked index.
	 *
	 * @returns The marked index.
	 *
	 * @since 3.0.0
	 */
	get markedIndex(): number {
		return this._markedIndex;
	}

	/**
	 * Gets the selected items.
	 *
	 * @returns The selected items.
	 *
	 * @since 3.0.0
	 */
	get selectedItems() {
		return this._selectionModel.value;
	}

	/**
	 * Gets the marked item.
	 *
	 * @returns The marked item.
	 *
	 * @since 3.0.0
	 */
	get markedItem(): NgOption {
		return this._filteredItems[this._markedIndex];
	}

	/**
	 * Determines whether every available option is already selected.
	 *
	 * @returns Whether no items to select.
	 *
	 * @since 3.0.0
	 */
	get noItemsToSelect(): boolean {
		return this._ngSelect.hideSelected() && this._items.length === this.selectedItems.length;
	}

	/**
	 * Determines whether the configured selection limit has been reached.
	 *
	 * @returns Whether max items selected.
	 *
	 * @since 3.0.0
	 */
	get maxItemsSelected(): boolean {
		return this._ngSelect.multiple() && this._ngSelect.maxSelectedItems() <= this.selectedItems.length;
	}

	/**
	 * Gets the last selected item.
	 *
	 * @returns The last selected item.
	 *
	 * @since 3.0.0
	 */
	get lastSelectedItem() {
		let i = this.selectedItems.length - 1;
		for (; i >= 0; i--) {
			const item = this.selectedItems[i];
			if (!item.disabled) {
				return item;
			}
		}
		return null;
	}

	/**
	 * Maps and groups a new immutable collection of source items.
	 *
	 * @param items - The options to process.
	 *
	 * @since 3.0.0
	 */
	setItems(items: readonly any[]) {
		this._items = items.map((item, index) => this.mapItem(item, index));
		const groupBy = this._ngSelect.groupBy();
		if (groupBy) {
			this._groups = this._groupBy(this._items, groupBy);
			this._items = this._flatten(this._groups);
		} else {
			this._groups = new Map();
			this._groups.set(undefined, this._items);
		}
		this._filteredItems = [...this._items];
	}

	/**
	 * Selects an option according to the active selection mode.
	 *
	 * @param item - The option to process.
	 *
	 * @since 3.0.0
	 */
	select(item: NgOption) {
		if (item.selected || this.maxItemsSelected) {
			return;
		}
		const multiple = this._ngSelect.multiple();
		if (!multiple) {
			this.clearSelected(false);
		}

		this._selectionModel.select(item, multiple, this._ngSelect.selectableGroupAsModel());
		if (this._ngSelect.hideSelected()) {
			this._hideSelected(item);
		}
	}

	/**
	 * Removes an option from the current selection.
	 *
	 * @param item - The option to process.
	 *
	 * @since 3.0.0
	 */
	unselect(item: NgOption) {
		if (!item.selected) {
			return;
		}
		const multiple = this._ngSelect.multiple();
		this._selectionModel.unselect(item, multiple);
		if (this._ngSelect.hideSelected() && isDefined(item.index) && multiple) {
			this._showSelected(item);
		}
	}

	/**
	 * Finds the option matching a model value.
	 *
	 * @param value - The value to process.
	 * @returns The matching option, when one exists.
	 *
	 * @since 3.0.0
	 */
	findItem(value: any): NgOption {
		let findBy: (item: NgOption) => boolean;
		if (this._ngSelect.compareWith()) {
			findBy = (item) => this._ngSelect.compareWith()(item.value, value);
		} else if (this._ngSelect.bindValue()) {
			findBy = (item) => !item.children && this.resolveNested(item.value, this._ngSelect.bindValue()) === value;
		} else {
			findBy = (item) => item.value === value || (!item.children && item.label && item.label === this.resolveNested(value, this._ngSelect.bindLabel()));
		}
		return this._items.find((item) => findBy(item));
	}

	/**
	 * Maps and appends a new option to the list.
	 *
	 * @param item - The option to process.
	 *
	 * @since 3.0.0
	 */
	addItem(item: any) {
		const option = this.mapItem(item, this._items.length);
		this._items.push(option);
		this._filteredItems.push(option);
		return option;
	}

	/**
	 * Clears selected options while optionally retaining disabled selections.
	 *
	 * @param keepDisabled - The keep disabled.
	 *
	 * @since 3.0.0
	 */
	clearSelected(keepDisabled: boolean) {
		this._selectionModel.clear(keepDisabled);
		this._items.forEach((item) => {
			item.selected = keepDisabled && item.selected && item.disabled;
			item.marked = false;
		});
		if (this._ngSelect.hideSelected()) {
			this.resetFilteredItems();
		}
	}

	/**
	 * Finds an option using a case-insensitive label comparison.
	 *
	 * @param term - The term.
	 *
	 * @since 3.0.0
	 */
	findByLabel(term: string) {
		term = searchHelper.stripSpecialChars(term).toLocaleLowerCase();
		return this.filteredItems.find((item) => {
			const label = searchHelper.stripSpecialChars(item.label).toLocaleLowerCase();
			return label.substr(0, term.length) === term;
		});
	}

	/**
	 * Filters the available options using the current search configuration.
	 *
	 * @param term - The term.
	 *
	 * @since 3.0.0
	 */
	filter(term: string): void {
		if (!term) {
			this.resetFilteredItems();
			return;
		}

		this._filteredItems = [];
		term = this._ngSelect.searchFn() ? term : searchHelper.stripSpecialChars(term).toLocaleLowerCase();
		const match = this._ngSelect.searchFn() || this._defaultSearchFn;
		const hideSelected = this._ngSelect.hideSelected();

		for (const key of Array.from(this._groups.keys())) {
			const matchedItems = [];
			for (const item of this._groups.get(key)) {
				if (hideSelected && ((item.parent && item.parent.selected) || item.selected)) {
					continue;
				}
				const searchItem = this._ngSelect.searchFn() ? item.value : item;
				if (match(term, searchItem)) {
					matchedItems.push(item);
				}
			}
			if (matchedItems.length > 0) {
				const [last] = matchedItems.slice(-1);
				if (last.parent) {
					const head = this._items.find((x) => x === last.parent);
					this._filteredItems.push(head);
				}
				this._filteredItems.push(...matchedItems);
			}
		}
	}

	/**
	 * Restores the unfiltered option collection.
	 *
	 * @since 3.0.0
	 */
	resetFilteredItems() {
		if (this._filteredItems.length === this._items.length) {
			return;
		}

		if (this._ngSelect.hideSelected() && this.selectedItems.length > 0) {
			this._filteredItems = this._items.filter((x) => !x.selected);
		} else {
			this._filteredItems = this._items;
		}
	}

	/**
	 * Clears the currently marked option.
	 *
	 * @since 3.0.0
	 */
	unmarkItem() {
		this._markedIndex = -1;
	}

	/**
	 * Marks the next enabled option.
	 *
	 * @since 3.0.0
	 */
	markNextItem() {
		this._stepToItem(+1);
	}

	/**
	 * Marks the previous enabled option.
	 *
	 * @since 3.0.0
	 */
	markPreviousItem() {
		this._stepToItem(-1);
	}

	/**
	 * Marks a specific option for keyboard interaction.
	 *
	 * @param item - The option to process.
	 *
	 * @since 3.0.0
	 */
	markItem(item: NgOption) {
		this._markedIndex = this._filteredItems.indexOf(item);
	}

	/**
	 * Marks the selected option or the configured default option.
	 *
	 * @param markDefault - The mark default.
	 *
	 * @since 3.0.0
	 */
	markSelectedOrDefault(markDefault?: boolean) {
		if (this._filteredItems.length === 0) {
			return;
		}

		const lastMarkedIndex = this._getLastMarkedIndex();
		if (lastMarkedIndex > -1) {
			this._markedIndex = lastMarkedIndex;
		} else {
			this._markedIndex = markDefault ? this.filteredItems.findIndex((x) => !x.disabled) : -1;
		}
	}

	/**
	 * Resolves a dot-separated property path from an option value.
	 *
	 * @param option - The option to process.
	 * @param key - The key.
	 * @returns The resolved nested value.
	 *
	 * @since 3.0.0
	 */
	resolveNested(option: any, key: string): any {
		if (!isObject(option)) {
			return option;
		}
		if (!key) {
			return undefined;
		}
		if (key.indexOf('.') === -1) {
			return option[key];
		} else {
			const keys: string[] = key.split('.');
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

	/**
	 * Maps a source value to the internal option representation.
	 *
	 * @param item - The option to process.
	 * @param index - The index.
	 * @returns The mapped internal option.
	 *
	 * @since 3.0.0
	 */
	mapItem(item: any, index: number): NgOption {
		const hasNgOptionLabel = isObject(item) && '$ngOptionLabel' in item;
		const hasNgOptionValue = isObject(item) && '$ngOptionValue' in item;
		const hasNgOptionClasses = isObject(item) && '$ngOptionClasses' in item;
		const label = hasNgOptionLabel ? item.$ngOptionLabel : this.resolveNested(item, this._ngSelect.bindLabel());
		const value = hasNgOptionValue ? item.$ngOptionValue : item;
		return {
			index,
			label: isDefined(label) ? label.toString() : '',
			value,
			disabled: item && item.disabled ? item.disabled : false,
			classes: hasNgOptionClasses ? item.$ngOptionClasses : '',
			htmlId: `${this._ngSelect.dropdownId}-${index}`,
		};
	}

	/**
	 * Remaps selected values after the source collection changes.
	 *
	 * @since 3.0.0
	 */
	mapSelectedItems() {
		const multiple = this._ngSelect.multiple();
		for (const selected of this.selectedItems) {
			const bindValue = this._ngSelect.bindValue();
			const value = bindValue ? this.resolveNested(selected.value, bindValue) : selected.value;
			const valueFound = isDefined(value);
			let item = valueFound ? this.findItem(value) : null;

			if (!item && !valueFound && this._ngSelect.compareWith()) {
				item = this._items.find((item) => this._ngSelect.compareWith()(item.value, selected.value));
			}

			this._selectionModel.unselect(selected, multiple);
			if (item?.selected) {
				// Already re-selected by an earlier iteration (duplicate value); drop the placeholder only
				continue;
			}
			this._selectionModel.select(item || selected, multiple, this._ngSelect.selectableGroupAsModel());
		}

		if (this._ngSelect.hideSelected()) {
			this._filteredItems = this.filteredItems.filter((x) => this.selectedItems.indexOf(x) === -1);
		}
	}

	/**
	 * Restores a selected option to the visible filtered collection.
	 *
	 * @param item - The option to process.
	 *
	 * @since 3.0.0
	 */
	private _showSelected(item: NgOption) {
		this._filteredItems.push(item);
		if (item.parent) {
			const parent = item.parent;
			const parentExists = this._filteredItems.find((x) => x === parent);
			if (!parentExists) {
				this._filteredItems.push(parent);
			}
		} else if (item.children) {
			for (const child of item.children) {
				child.selected = false;
				this._filteredItems.push(child);
			}
		}
		this._filteredItems = [...this._filteredItems.sort((a, b) => a.index - b.index)];
	}

	/**
	 * Removes a selected option from the visible filtered collection.
	 *
	 * @param item - The option to process.
	 *
	 * @since 3.0.0
	 */
	private _hideSelected(item: NgOption) {
		this._filteredItems = this._filteredItems.filter((x) => x !== item);
		if (item.parent) {
			const children = item.parent.children;
			if (children.every((x) => x.selected)) {
				this._filteredItems = this._filteredItems.filter((x) => x !== item.parent);
			}
		} else if (item.children) {
			this._filteredItems = this.filteredItems.filter((x) => x.parent !== item);
		}
	}

	/**
	 * Matches an option using the default normalized-label search.
	 *
	 * @param search - The search.
	 * @param opt - The opt.
	 *
	 * @since 3.0.0
	 */
	private _defaultSearchFn(search: string, opt: NgOption) {
		const label = searchHelper.stripSpecialChars(opt.label).toLocaleLowerCase();
		return label.indexOf(search) > -1;
	}

	/**
	 * Calculates the next enabled option index.
	 *
	 * @param steps - The steps.
	 *
	 * @since 3.0.0
	 */
	private _getNextItemIndex(steps: number) {
		if (steps > 0) {
			return this._markedIndex >= this._filteredItems.length - 1 ? 0 : this._markedIndex + 1;
		}
		return this._markedIndex <= 0 ? this._filteredItems.length - 1 : this._markedIndex - 1;
	}

	/**
	 * Moves the marked index by the requested number of enabled options.
	 *
	 * @param steps - The steps.
	 *
	 * @since 3.0.0
	 */
	private _stepToItem(steps: number) {
		if (this._filteredItems.length === 0 || this._filteredItems.every((x) => x.disabled)) {
			return;
		}

		this._markedIndex = this._getNextItemIndex(steps);
		if (this.markedItem.disabled) {
			this._stepToItem(steps);
		}
	}

	/**
	 * Returns the index that should remain marked after filtering changes.
	 *
	 * @since 3.0.0
	 */
	private _getLastMarkedIndex() {
		if (this._ngSelect.hideSelected()) {
			return -1;
		}

		if (this._markedIndex > -1 && this.markedItem === undefined) {
			return -1;
		}

		const selectedIndex = this._getFirstSelectedIndex();
		if (this.lastSelectedItem && selectedIndex < 0) {
			return -1;
		}

		return selectedIndex > -1 ? selectedIndex : this.markedIndex;
	}

	/**
	 * Index of the first selected, non-disabled option in filtered list order.
	 * Per the WAI-ARIA listbox pattern, focus lands on the first selected option when the list opens.
	 *
	 * @since 23.3.0
	 */
	private _getFirstSelectedIndex() {
		let index = -1;
		for (const selected of this.selectedItems) {
			if (selected.disabled) {
				continue;
			}
			const i = this._filteredItems.indexOf(selected);
			if (i > -1 && (index === -1 || i < index)) {
				index = i;
			}
		}
		return index;
	}

	/**
	 * Groups mapped options using a property name or grouping function.
	 *
	 * @param items - The options to process.
	 * @param prop - The prop.
	 * @returns The group by result.
	 *
	 * @since 3.0.0
	 */
	private _groupBy(items: NgOption[], prop: string | ((value: any) => any)): OptionGroups {
		const groups = new Map<string | NgOption, NgOption[]>();
		if (items.length === 0) {
			return groups;
		}

		// Check if items are already grouped by given key.
		const firstValue = items[0].value;
		if (firstValue != null && Array.isArray(firstValue[<string>prop])) {
			for (const item of items) {
				const children = (item.value?.[<string>prop] || []).map((x, index) => this.mapItem(x, index));
				groups.set(item, children);
			}
			return groups;
		}

		const isFnKey = isFunction(this._ngSelect.groupBy());
		const keyFn = (item: NgOption) => {
			const key = isFnKey ? (<(value: any) => any>prop)(item.value) : item.value?.[<string>prop];
			return isDefined(key) ? key : undefined;
		};

		// Group items by key.
		for (const item of items) {
			const key = keyFn(item);
			const group = groups.get(key);
			if (group) {
				group.push(item);
			} else {
				groups.set(key, [item]);
			}
		}
		return groups;
	}

	/**
	 * Flattens option groups into the render order used by the dropdown.
	 *
	 * @param groups - The groups.
	 *
	 * @since 3.0.0
	 */
	private _flatten(groups: OptionGroups) {
		const isGroupByFn = isFunction(this._ngSelect.groupBy());
		const items = [];
		for (const key of Array.from(groups.keys())) {
			let i = items.length;
			if (key === undefined) {
				const withoutGroup = groups.get(undefined) || [];
				items.push(
					...withoutGroup.map((x) => {
						x.index = i++;
						x.htmlId = `${this._ngSelect.dropdownId}-${x.index}`;
						return x;
					}),
				);
				continue;
			}

			const isObjectKey = isObject(key);
			const parent: NgOption = {
				label: isObjectKey ? '' : String(key),
				children: undefined,
				parent: null,
				index: i++,
				disabled: !this._ngSelect.selectableGroup(),
				htmlId: newId(),
			};
			const groupKey = isGroupByFn ? this._ngSelect.bindLabel() : <string>this._ngSelect.groupBy();
			const groupValue =
				this._ngSelect.groupValue() ||
				(() => {
					if (isObjectKey) {
						return (<NgOption>key).value;
					}
					return { [groupKey]: key };
				});
			const children = groups.get(key).map((x) => {
				x.parent = parent;
				x.children = undefined;
				x.index = i++;
				x.htmlId = `${this._ngSelect.dropdownId}-${x.index}`;
				return x;
			});
			parent.children = children;
			parent.value = groupValue(
				key,
				children.map((x) => x.value),
			);
			items.push(parent);
			items.push(...children);
		}
		return items;
	}
}
