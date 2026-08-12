import { Injectable } from '@angular/core';

export interface ItemsRangeResult {
	scrollHeight: number;
	topPadding: number;
	start: number;
	end: number;
}

export interface PanelDimensions {
	/** Height of a regular option row (non-group). */
	itemHeight: number;
	/** Height of a group header row. Falls back to itemHeight when unset/equal. */
	groupHeight: number;
	panelHeight: number;
	itemsPerViewport: number;
}

/** Minimal shape needed to distinguish group headers from options. */
export interface VirtualScrollItem {
	children?: unknown;
}

@Injectable()
export class NgDropdownPanelService {
	private _dimensions: PanelDimensions = {
		itemHeight: 0,
		groupHeight: 0,
		panelHeight: 0,
		itemsPerViewport: 0,
	};

	get dimensions() {
		return this._dimensions;
	}

	calculateItems(
		scrollPos: number,
		itemsLength: number,
		buffer: number,
		items?: readonly VirtualScrollItem[],
	): ItemsRangeResult {
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

	getItemHeight(item: VirtualScrollItem | null | undefined): number {
		const d = this._dimensions;
		if (item?.children) {
			return d.groupHeight || d.itemHeight;
		}
		return d.itemHeight || d.groupHeight;
	}

	getItemOffset(items: readonly VirtualScrollItem[], index: number): number {
		let offset = 0;
		const end = Math.max(0, Math.min(index, items.length));
		for (let i = 0; i < end; i++) {
			offset += this.getItemHeight(items[i]);
		}
		return offset;
	}

	getScrollHeight(items: readonly VirtualScrollItem[]): number {
		return this.getItemOffset(items, items.length);
	}

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

	private _calculateItemsVariable(
		scrollPos: number,
		items: readonly VirtualScrollItem[],
		buffer: number,
	): ItemsRangeResult {
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
