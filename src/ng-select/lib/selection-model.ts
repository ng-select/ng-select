import { NgOption } from './ng-select.types';

export type SelectionModelFactory = () => SelectionModel;

export function DefaultSelectionModelFactory() {
    return new DefaultSelectionModel();
}

export interface SelectionModel {
    value: NgOption[];
    select(item: NgOption, multiple: boolean, selectableGroupAsModel: boolean);
    unselect(item: NgOption, multiple: boolean);
    clear(keepDisabled: boolean);
}

export class DefaultSelectionModel implements SelectionModel {
    private _selected: NgOption[] = [];

    get value(): NgOption[] {
        return this._selected;
    }

    select(item: NgOption, multiple: boolean, groupAsModel: boolean) {
        item.selected = true;
        if (!item.children || (!multiple && groupAsModel)) {
            this._selected.push(item);
        }
        if (multiple) {
            if (item.parent) {
                const childrenCount = item.parent.children.length;
                const selectedCount = item.parent.children.filter(x => x.selected).length;
                item.parent.selected = childrenCount === selectedCount;
            } else if (item.children) {
                this._setChildrenSelectedState(item.children, true);
                this._removeChildren(item);
                if (groupAsModel && this._activeChildren(item)) {
                    this._selected = [...this._selected.filter(x => x.parent !== item), item]
                } else {
                    this._selected = [...this._selected, ...item.children.filter(x => !x.disabled)];
                }
            }
        }
    }

    unselect(item: NgOption, multiple: boolean) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;
        if (multiple) {
            if (item.parent && item.parent.selected) {
                const children = item.parent.children;
                this._removeParent(item.parent);
                this._removeChildren(item.parent);
                this._selected.push(...children.filter(x => x !== item && !x.disabled));
                item.parent.selected = false;
            } else if (item.children) {
                this._setChildrenSelectedState(item.children, false);
                this._removeChildren(item);
            }
        }
    }

    clear(keepDisabled: boolean) {
        this._selected = keepDisabled ? this._selected.filter(x => x.disabled) : [];
    }

    private _setChildrenSelectedState(children: NgOption[], selected: boolean) {
        for (const child of children) {
            if (child.disabled) {
                continue;
            }
            child.selected = selected;
        }
    }

    private _removeChildren(parent: NgOption) {
        this._selected = [
            ...this._selected.filter(x => x.parent !== parent),
            ...parent.children.filter(x => x.parent === parent && x.disabled && x.selected)
        ];
    }

    private _removeParent(parent: NgOption) {
        this._selected = this._selected.filter(x => x !== parent)
    }

    private _activeChildren(item: NgOption): boolean {
        return item.children.every(x => !x.disabled || x.selected);
    }
}
