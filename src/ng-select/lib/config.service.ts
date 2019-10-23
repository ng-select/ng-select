import { Injectable } from '@angular/core';

import {
    AddTagFn,
    CompareWithFn,
    DropdownPosition,
    GroupValueFn,
    KeyDownFn,
    SearchFn,
    TrackByFn
} from './ng-select.types';

@Injectable({ providedIn: 'root' })
export class NgSelectConfig {
    addTag: boolean | AddTagFn = false;
    addTagText = 'Add item';
    appendTo?: string;
    bindLabel?: string;
    bindValue?: string;
    bufferAmount = 4;
    clearAllText = 'Clear all';
    clearOnBackspace = true;
    clearSearchOnAdd?: boolean;
    clearable = true;
    closeOnSelect = true;
    compareWith?: CompareWithFn;
    dropdownPosition: DropdownPosition = 'auto';
    groupBy?: string | Function;
    groupValue?: GroupValueFn;
    hideSelected = false;
    inputAttrs: Record<string, string> = {};
    isOpen = false;
    keyDownFn: KeyDownFn = (_: KeyboardEvent) => true;
    loadingText = 'Loading...';
    markFirst = true;
    maxSelectedItems?: number;
    multiple = false;
    notFoundText = 'No items found';
    openOnEnter = true;
    placeholder?: string;
    readonly = false;
    searchFn?: SearchFn;
    searchable = true;
    selectOnTab = false;
    selectableGroup = false;
    selectableGroupAsModel = true;
    tabIndex?: number;
    trackByFn?: TrackByFn;
    typeToSearchText = 'Type to search';
    virtualScroll = false;
}
