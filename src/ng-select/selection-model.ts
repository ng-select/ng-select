import { NgOption } from './ng-select.types';

export class SelectionModel {
    private _selected: NgOption[] = [];

    get value(): NgOption[] {
        return this._selected;
    }

    select(item: NgOption, multiple: boolean) {
        item.selected = true;
        this._selected.push(item);
        if (multiple) {
            if (item.parent) {
                this._removeParent(item.parent);
                const childrenCount = item.parent.children.length;
                const selectedCount = item.parent.children.filter(x => x.selected).length;
                item.parent.selected = childrenCount === selectedCount;
            } else if (item.children) {
                this._setChildrenSelectedState(item.children, true);
                this._removeParentChildren(item);
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
                this._removeParentChildren(item.parent);
                this._selected.push(...children.filter(x => x !== item));
                item.parent.selected = false;
            } else if (item.children) {
                this._setChildrenSelectedState(item.children, false);
                this._removeParentChildren(item);
            }
        }
    }

    clear() {
        this._selected = [];
    }

    private _setChildrenSelectedState(children: NgOption[], selected: boolean) {
        children.forEach(x => x.selected = selected);
    }

    private _removeParentChildren(parent: NgOption) {
        this._selected = this._selected.filter(x => x.parent !== parent);
    }

    private _removeParent(parent: NgOption) {
        this._selected = this._selected.filter(x => x !== parent)
    }
}
