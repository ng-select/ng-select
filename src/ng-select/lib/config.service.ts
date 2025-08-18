import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NgSelectConfig {
	placeholder: string;
	fixedPlaceholder = false;
	notFoundText = 'No items found';
	typeToSearchText = 'Type to search';
	addTagText = 'Add item';
	loadingText = 'Loading...';
	clearAllText = 'Clear all';
	disableVirtualScroll = true;
	openOnEnter = true;
	appendTo: string;
	bindValue: string;
	bindLabel: string;
	appearance = 'underline';
	clearSearchOnAdd: boolean;
	deselectOnClick: boolean;
	tabFocusOnClear = true;
}
