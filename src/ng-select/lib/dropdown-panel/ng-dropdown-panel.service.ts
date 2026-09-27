import { Injectable } from '@angular/core';

/**
 * Describes the rendered range and spacer sizes for virtual scrolling.
 *
 * @since 3.0.0
 */
export interface ItemsRangeResult {
	scrollHeight: number;
	topPadding: number;
	start: number;
	end: number;
}

/**
 * Describes measured option, group, and viewport dimensions.
 *
 * @since 3.0.0
 */
export interface PanelDimensions {
	/** Height of a regular option row (non-group). */
	itemHeight: number;
	/** Height of a group header row. Falls back to itemHeight when unset/equal. */
	groupHeight: number;
	panelHeight: number;
	itemsPerViewport: number;
}

/**
 * Minimal shape needed to distinguish group headers from options.
 *
 * @since 23.9.0
 */
export interface VirtualScrollItem {
	children?: unknown;
}

/**
 * Calculates dropdown panel dimensions, virtual-scroll ranges, and scroll offsets.
 *
 * @since 3.0.0
 */
@Injectable()
export class NgDropdownPanelService {
	private _dimensions: PanelDimensions = {
		itemHeight: 0,
		groupHeight: 0,
		panelHeight: 0,
		itemsPerViewport: 0,
	};

	/**
	 * Gets the currently measured panel dimensions.
	 *
	 * @returns The dimensions.
	 *
	 * @since 3.0.0
	 */
	get dimensions() {
		return this._dimensions;
	}

	/**
	 * Calculates the virtual-scroll item range and spacer sizes.
	 *
	 * @param scrollPos - The scroll pos.
	 * @param itemsLength - The items length.
	 * @param buffer - The buffer.
	 * @param items - The options to process.
	 * @returns The rendered range and spacer sizes.
	 *
	 * @since 3.0.0
	 */
	calculateItems(scrollPos: number, itemsLength: number, buffer: number, items?: readonly VirtualScrollItem[]): ItemsRangeResult {
		const d = this._dimensions;
		const useVariableHeights = !!items && d.groupHeight > 0 && d.groupHeight !== d.itemHeight;

		if (useVariableHeights) {
			return this._calculateItemsVariable(scrollPos, items, buffer);
		}

		const scrollHeight = d.itemHeight * itemsLength;

		const scrollTop = Math.max(0, scrollPos);
		const indexByScrollTop = (scrollTop / scrollHeight) * itemsLength;
		let end = Math.min(itemsLength, Math.ceil(indexByScrollTop) + (d.itemsPerViewport + 1));

		const maxStartEnd = end;
		const maxStart = Math.max(0, maxStartEnd - d.itemsPerViewport);
		let start = Math.min(maxStart, Math.floor(indexByScrollTop));

		let topPadding = d.itemHeight * Math.ceil(start) - d.itemHeight * Math.min(start, buffer);
		topPadding = !isNaN(topPadding) ? topPadding : 0;
		start = !isNaN(start) ? start : -1;
		end = !isNaN(end) ? end : -1;
		start -= buffer;
		start = Math.max(0, start);
		end += buffer;
		end = Math.min(itemsLength, end);

		return {
			topPadding,
			scrollHeight,
			start,
			end,
		};
	}

	/**
	 * Stores the measured item, group, and panel dimensions.
	 *
	 * @param itemHeight - The item height.
	 * @param panelHeight - The panel height.
	 * @param groupHeight - The group height.
	 *
	 * @since 3.0.0
	 */
	setDimensions(itemHeight: number, panelHeight: number, groupHeight: number = itemHeight) {
		const effectiveItemHeight = itemHeight > 0 ? itemHeight : groupHeight;
		const itemsPerViewport = effectiveItemHeight > 0 ? Math.max(1, Math.floor(panelHeight / effectiveItemHeight)) : 0;
		this._dimensions = {
			itemHeight,
			groupHeight: groupHeight > 0 ? groupHeight : itemHeight,
			panelHeight,
			itemsPerViewport,
		};
	}

	/**
	 * Returns the measured height for an option or group.
	 *
	 * @param item - The option to process.
	 * @returns The row height in pixels.
	 *
	 * @since 23.9.0
	 */
	getItemHeight(item: VirtualScrollItem | null | undefined): number {
		const d = this._dimensions;
		if (item?.children) {
			return d.groupHeight || d.itemHeight;
		}
		return d.itemHeight || d.groupHeight;
	}

	/**
	 * Calculates an item’s vertical offset within the full option list.
	 *
	 * @param items - The options to process.
	 * @param index - The index.
	 * @returns The vertical offset in pixels.
	 *
	 * @since 23.9.0
	 */
	getItemOffset(items: readonly VirtualScrollItem[], index: number): number {
		let offset = 0;
		const end = Math.max(0, Math.min(index, items.length));
		for (let i = 0; i < end; i++) {
			offset += this.getItemHeight(items[i]);
		}
		return offset;
	}

	/**
	 * Calculates the total virtual-scroll content height.
	 *
	 * @param items - The options to process.
	 * @returns The total scroll height in pixels.
	 *
	 * @since 23.9.0
	 */
	getScrollHeight(items: readonly VirtualScrollItem[]): number {
		return this.getItemOffset(items, items.length);
	}

	/**
	 * Calculates the scroll position needed to reveal an item.
	 *
	 * @param itemTop - The item top.
	 * @param itemHeight - The item height.
	 * @param lastScroll - The last scroll.
	 *
	 * @since 3.0.0
	 */
	getScrollTo(itemTop: number, itemHeight: number, lastScroll: number) {
		const { panelHeight } = this.dimensions;
		const itemBottom = itemTop + itemHeight;
		const top = lastScroll;
		const bottom = top + panelHeight;

		if (panelHeight >= itemBottom && lastScroll === itemTop) {
			return null;
		}

		if (itemBottom > bottom) {
			return top + itemBottom - bottom;
		} else if (itemTop <= top) {
			return itemTop;
		}

		return null;
	}

	/**
	 * Calculates a virtual-scroll range for variable-height rows.
	 *
	 * @param scrollPos - The scroll pos.
	 * @param items - The options to process.
	 * @param buffer - The buffer.
	 * @returns The calculate items variable result.
	 *
	 * @since 23.9.0
	 */
	private _calculateItemsVariable(scrollPos: number, items: readonly VirtualScrollItem[], buffer: number): ItemsRangeResult {
		const { panelHeight } = this._dimensions;
		const itemsLength = items.length;
		const scrollHeight = this.getScrollHeight(items);
		const scrollTop = Math.max(0, scrollPos);

		let accumulated = 0;
		let start = 0;
		for (let i = 0; i < itemsLength; i++) {
			const height = this.getItemHeight(items[i]);
			if (accumulated + height > scrollTop) {
				start = i;
				break;
			}
			accumulated += height;
			start = i + 1;
		}

		let end = start;
		let visibleHeight = 0;
		while (end < itemsLength && visibleHeight < panelHeight) {
			visibleHeight += this.getItemHeight(items[end]);
			end++;
		}
		// Match the uniform path's +1 viewport slack so the last partially-visible row is included.
		end = Math.min(itemsLength, end + 1);

		const bufferedStart = Math.max(0, start - buffer);
		const bufferedEnd = Math.min(itemsLength, end + buffer);
		const topPadding = this.getItemOffset(items, bufferedStart);

		return {
			topPadding,
			scrollHeight,
			start: bufferedStart,
			end: bufferedEnd,
		};
	}
}
