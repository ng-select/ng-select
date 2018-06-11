import { NgOption } from './ng-select.types';
import { isDefined } from './value-utils';

export class SelectionModel {
    private _selected: NgOption[] = [];

    get value(): NgOption[] {
        return this._selected;
    }

    select(items: NgOption[], item: NgOption, multiple: boolean) {
        item.selected = true;
        if (multiple) {
            if (isDefined(item.parent) && item.parent.selected) {
                this._selected = this._selected.filter(x => x !== parent);
                item.parent.selected = false;
            } else if (item.hasChildren) {
                const children = items.filter(x => x.parent === item);
                this._setChildrenSelectedState(children, true);
                this._removeSelectedChildren(children);
            }
        }
        this._selected.push(item);
    }

    unselect(items: NgOption[], item: NgOption, multiple: boolean) {
        this._selected = this._selected.filter(x => x !== item);
        item.selected = false;
        if (multiple) {
            if (isDefined(item.parent) && item.parent.selected) {
                this._selected = items.filter(x => x.parent === item.parent && x !== item);
                item.parent.selected = false;
            } else if (item.hasChildren) {
                const children = items.filter(x => x.parent === item);
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
