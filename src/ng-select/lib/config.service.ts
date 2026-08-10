import { Injectable } from '@angular/core';

/** Configuration provider for the NgSelect component. You can inject this service and provide application wide configuration. */
@Injectable({ providedIn: 'root' })
export class NgSelectConfig {
	/** Placeholder text. */
	placeholder: string;
	/** Set placeholder visible even when an item is selected. */
	fixedPlaceholder = true;
	/** Set custom text when filter returns empty result. */
	notFoundText = 'No items found';
	/** Set custom text when using Typeahead. */
	typeToSearchText = 'Type to search';
	/** Set custom text when using tagging. */
	addTagText = 'Add item';
	/** Set custom text when loading items. */
	loadingText = 'Loading...';
	/** Set custom text for clear all icon title. */
	clearAllText = 'Clear all';
	/** Set custom text prefixed to the option label in the aria-label of the remove icon on selected values (multiple mode). */
	removeText = 'Remove';
	/** Set custom aria-label for the dropdown options list. */
	ariaLabelDropdown = 'Options List';
	/** Disable virtual scroll for the dropdown panel. */
	disableVirtualScroll = true;
	/** Open dropdown using enter. */
	openOnEnter = true;
	/** Append dropdown to body or any other element using css selector. */
	appendTo: string;
	/** Object property to use for selected model. By default binds to whole object. */
	bindValue: string;
	/** Object property to use for label. */
	bindLabel: string;
	/** Allows to select dropdown appearance. Set to `outline` or `fill` for Material form-field styles (applies only to Material theme). */
	appearance = 'underline';
	/** Clears search input when item is selected. */
	clearSearchOnAdd: boolean;
	/** Deselects a selected item when it is clicked in the dropdown. */
	deselectOnClick: boolean;
	/** Control tab navigation behavior for the clear button. */
	tabFocusOnClear = true;
	/**
	 * Controls which DOM event is used to detect outside clicks for closing the dropdown.
	 * Defaults to 'click'. Set to 'mousedown' to handle early outside interactions
	 * (useful when backdrops load on click and would otherwise close the dropdown).
	 */
	outsideClickEvent: 'click' | 'mousedown' = 'click';
}
