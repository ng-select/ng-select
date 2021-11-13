import { Injectable } from '@angular/core';

/**This service is used for defining the default value for fields in all ng-select*/
@Injectable({ providedIn: 'root' })
export class NgSelectConfig {
    placeholder: string;
    notFoundText = 'No items found';
    typeToSearchText = 'Type to search';
    addTagText = 'Add item';
    loadingText = 'Loading...';
    clearAllText = 'Clear all';
    disableVirtualScroll = true;
    openOnEnter = true;
    appendTo: string;

    /**Gets and set the property name that should be used for select item value */
    bindValue: string;

    /**Gets and set the property name that should be used for select item label */
    bindLabel: string;
    appearance = 'underline';

    /**Gets and set a value that indicates if text should be remove after item be added*/
    clearSearchOnAdd: boolean;

    /**Gets and set a value that indicates whether the selected items should appear as an option. */
    hideSelected = false;
}
