import { NgOption } from './ng-select.types';
export declare type SelectionModelFactory = () => SelectionModel;
export declare function DefaultSelectionModelFactory(): DefaultSelectionModel;
export interface SelectionModel {
    value: NgOption[];
    select(item: NgOption, multiple: boolean, selectableGroupAsModel: boolean): any;
    unselect(item: NgOption, multiple: boolean): any;
    clear(keepDisabled: boolean): any;
}
export declare class DefaultSelectionModel implements SelectionModel {
    private _selected;
    get value(): NgOption[];
    select(item: NgOption, multiple: boolean, groupAsModel: boolean): void;
    unselect(item: NgOption, multiple: boolean): void;
    clear(keepDisabled: boolean): void;
    private _setChildrenSelectedState;
    private _removeChildren;
    private _removeParent;
    private _activeChildren;
}
