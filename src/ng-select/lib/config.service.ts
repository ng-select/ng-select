import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NgSelectConfig {
	placeholder: string;
	fixedPlaceholder = true;
	notFoundText = 'No items found';
	typeToSearchText = 'Type to search';
	addTagText = 'Add item';
	loadingText = 'Loading...';
	clearAllText = 'Clear all';
	ariaLabelDropdown = 'Options List';
	disableVirtualScroll = true;
	openOnEnter = true;
	appendTo: string;
	bindValue: string;
	bindLabel: string;
	appearance = 'underline';
	clearSearchOnAdd: boolean;
	deselectOnClick: boolean;
	tabFocusOnClear = true;
	/**
	 * Controls which DOM event is used to detect outside clicks for closing the dropdown.
	 * Defaults to 'click'. Set to 'mousedown' to handle early outside interactions
	 * (useful when backdrops load on click and would otherwise close the dropdown).
	 */
	outsideClickEvent: 'click' | 'mousedown' = 'click';
}
