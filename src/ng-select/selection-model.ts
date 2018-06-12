import { NgOption } from './ng-select.types';
import { isDefined } from './value-utils';

export class SelectionModel {
    private _selected: NgOption[] = [];

    get value(): NgOption[] {
        return this._selected;
    }

    select(item: NgOption, multiple: boolean) {
        item.selected = true;
        this._selected.push(item);
        if (multiple) {
            if (isDefined(item.parent)) {
                this._selected = this._selected.filter(x => x !== parent);
                const childrenCount = item.parent.children ? item.parent.children.length : 0;
                const selectedCount = this._selected.filter(x => x.parent === item.parent).length;
                item.parent.selected = childrenCount === selectedCount;
            } else if (item.children) {
                const children = item.children;
                this._setChildrenSelectedState(children, true);
                this._removeSelectedChildren(children);
            }
        }
    }

    unselect(item: NgOption, multiple: boolean) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;
        if (multiple) {
            if (isDefined(item.parent) && item.parent.selected) {
                // const children = item.parent.children;
                // this._removeSelectedChildren(children);
                // this._selected.push(...children.filter(x => x === item));
                item.parent.selected = false;
            } else if (item.children) {
                const children = item.children
                this._setChildrenSelectedState(children, false);
                this._removeSelectedChildren(children);
            }
        }
    }

    clear() {
        this._selected = [];
    }

    private _setChildrenSelectedState(children: NgOption[], selected: boolean) {
        children.forEach(c => c.selected = selected);
    }

    private _removeSelectedChildren(children: NgOption[]) {
        this._selected = this._selected.filter(x => children.indexOf(x) === -1);
    }
}
