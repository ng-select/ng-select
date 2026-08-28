import { ConnectionPositionPair, FlexibleConnectedPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	ElementRef,
	inject,
	input,
	NgZone,
	OnChanges,
	OnInit,
	output,
	Renderer2,
	SimpleChanges,
	TemplateRef,
	viewChild,
	ViewEncapsulation,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { animationFrameScheduler, asapScheduler, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { NgDropdownPanelService, PanelDimensions } from './ng-dropdown-panel.service';

import { DropdownPosition, NgOption } from './ng-select.types';
import { isDefined } from './value-utils';

const CSS_POSITIONS: readonly string[] = ['top', 'right', 'bottom', 'left'];
const SCROLL_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	selector: 'ng-dropdown-panel',
	template: `
		@if (headerTemplate()) {
			<div class="ng-dropdown-header">
				<ng-container [ngTemplateOutlet]="headerTemplate()" [ngTemplateOutletContext]="{ searchTerm: filterValue() }" />
			</div>
		}
		<div #scroll role="listbox" class="ng-dropdown-panel-items scroll-host" [attr.id]="listboxId()" [attr.aria-label]="ariaLabelDropdown()">
			<div #padding [class.total-padding]="virtualScroll()"></div>
			<div #content [class.scrollable-content]="virtualScroll() && items().length">
				<ng-content />
			</div>
		</div>
		@if (footerTemplate()) {
			<div class="ng-dropdown-footer">
				<ng-container [ngTemplateOutlet]="footerTemplate()" [ngTemplateOutletContext]="{ searchTerm: filterValue() }" />
			</div>
		}
	`,
	imports: [NgTemplateOutlet],
})
export class NgDropdownPanelComponent implements OnInit, OnChanges {
	readonly items = input<NgOption[]>([]);
	readonly showAddTag = input(false, { transform: booleanAttribute });
	readonly markedItem = input<NgOption>(undefined);
	readonly position = input<DropdownPosition>('auto');
	readonly bufferAmount = input<number>(undefined);
	readonly virtualScroll = input(false, { transform: booleanAttribute });
	readonly headerTemplate = input<TemplateRef<any> | undefined>(undefined);
	readonly footerTemplate = input<TemplateRef<any> | undefined>(undefined);
	readonly filterValue = input<string>(null);
	readonly ariaLabelDropdown = input<string | null>(null);
	readonly listboxId = input<string | null>(null);
	/**
	 * Which DOM event to listen to for outside click detection
	 */
	readonly outsideClickEvent = input<'click' | 'mousedown'>('click');
	/** @deprecated Has no effect: the CDK overlay renders in the native Popover API top layer automatically in supporting browsers. Will be removed in a future major version. */
	readonly popover = input(false, { transform: booleanAttribute });
	/** Overlay hosting this panel. Used to request repositioning when the rendered content changes. */
	readonly overlayRef = input<OverlayRef | null>(null);
	/** Host `ng-select` element. The panel's DOM lives in the overlay, so the host cannot be derived from the DOM tree. */
	readonly selectElement = input<HTMLElement>(undefined);
	readonly update = output<any[]>();
	readonly scroll = output<{
		start: number;
		end: number;
	}>();
	readonly scrollToEnd = output<void>();
	readonly outsideClick = output<void>();
	private _renderer = inject(Renderer2);
	private _zone = inject(NgZone);
	private _panelService = inject(NgDropdownPanelService);
	private _document = inject(DOCUMENT, { optional: true })!;
	private _destroyRef = inject(DestroyRef);
	private _dropdown = inject(ElementRef<HTMLElement>).nativeElement;
	private readonly contentElementRef = viewChild('content', { read: ElementRef });
	private readonly scrollElementRef = viewChild('scroll', { read: ElementRef });
	private readonly paddingElementRef = viewChild('padding', { read: ElementRef });

	private readonly _virtualPadding = computed(() => this.paddingElementRef()?.nativeElement);
	private readonly _scrollablePanel = computed(() => this.scrollElementRef()?.nativeElement);
	private readonly _contentPanel = computed(() => this.contentElementRef()?.nativeElement);

	private _select: HTMLElement | undefined;
	private _scrollToEndFired = false;
	private _updateScrollHeight = false;
	private _lastScrollPosition = 0;
	private _lastMousedownInside = false;

	private _currentPosition: DropdownPosition;

	get currentPosition(): DropdownPosition {
		return this._currentPosition;
	}

	private _itemsLength: number;

	private get itemsLength() {
		return this._itemsLength;
	}

	private set itemsLength(value: number) {
		if (value !== this._itemsLength) {
			this._itemsLength = value;
			this._onItemsLengthChanged();
		}
	}

	private get _startOffset() {
		if (this.markedItem()) {
			const { panelHeight } = this._panelService.dimensions;
			const offset = this._panelService.getItemOffset(this.items(), this.markedItem().index);
			return panelHeight > offset ? 0 : offset;
		}
		return 0;
	}

	ngOnInit() {
		this._select = this.selectElement() ?? this._dropdown.parentElement;
		this._handleScroll();
		this._handleOutsideClick();
		this._setupMousedownListener();
		this._subscribeOverlayPosition();
		this._handleDocumentScroll();
		this._handleSelectResize();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.items) {
			const change = changes.items;
			this._onItemsOrShowAddTagChange(change.currentValue, this.showAddTag(), change.firstChange);
		}
		if (changes.showAddTag) {
			const change = changes.showAddTag;
			this._onItemsOrShowAddTagChange(this.items(), change.currentValue, change.firstChange);
		}
	}

	scrollTo(option: NgOption, startFromOption = false) {
		if (!option) {
			return;
		}

		const index = this.items().indexOf(option);
		if (index < 0 || index >= this.itemsLength) {
			return;
		}

		let scrollTo;
		if (this.virtualScroll()) {
			const items = this.items();
			const itemHeight = this._panelService.getItemHeight(option);
			const itemTop = this._panelService.getItemOffset(items, index);
			scrollTo = this._panelService.getScrollTo(itemTop, itemHeight, this._lastScrollPosition);
		} else {
			const item: HTMLElement = this._dropdown.querySelector(`#${option.htmlId}`);
			if (!item) {
				return;
			}
			const lastScroll = startFromOption ? item.offsetTop : this._lastScrollPosition;
			scrollTo = this._panelService.getScrollTo(item.offsetTop, item.clientHeight, lastScroll);
		}

		if (isDefined(scrollTo)) {
			this._scrollablePanel().scrollTop = scrollTo;
			// Programmatic scrollTop does not always deliver a `scroll` event before the next
			// keyboard step (and animationFrame-audited listeners can lag). Keep the virtual
			// window in sync immediately so the marked row is rendered (#2744).
			if (this.virtualScroll()) {
				this._onContentScrolled(scrollTo);
			} else {
				this._lastScrollPosition = scrollTo;
			}
		}
	}

	scrollToTag() {
		const panel = this._scrollablePanel();
		panel.scrollTop = panel.scrollHeight - panel.clientHeight;
	}

	adjustPosition() {
		this.overlayRef()?.updatePosition();
	}

	/**
	 * Applies the position chosen by the overlay's position strategy to the panel and host
	 * as `ng-select-top` / `ng-select-bottom` (and `-left` / `-right`) classes, which the
	 * shipped themes use for borders, radius and spacing.
	 */
	private _setCurrentPosition(position: DropdownPosition) {
		this._currentPosition = position;
		if (CSS_POSITIONS.includes(position)) {
			this._updateDropdownClass(position);
		} else {
			this._updateDropdownClass('bottom');
		}
	}

	/**
	 * Positions the freshly rendered panel. The overlay measures the real DOM, so header and
	 * footer templates and the actual item count are part of the auto placement decision
	 * (#2575). Only then is the panel made visible to avoid a flash at a stale position.
	 */
	private _positionDropdown() {
		const overlayRef = this.overlayRef();
		if (overlayRef) {
			// Applies the best fitting position and synchronously emits positionChanges,
			// which updates the position classes before the panel becomes visible
			overlayRef.updatePosition();
		} else if (!isDefined(this._currentPosition)) {
			// Standalone usage without an overlay: reflect the configured side directly
			this._setCurrentPosition(this.position() === 'auto' ? 'bottom' : this.position());
		}

		this._dropdown.style.opacity = '1';
	}

	private _subscribeOverlayPosition() {
		const strategy = this.overlayRef()?.getConfig().positionStrategy;
		if (!(strategy instanceof FlexibleConnectedPositionStrategy)) {
			return;
		}

		strategy.positionChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((change) => {
			this._setCurrentPosition(this._connectionPairToPosition(change.connectionPair));
		});
	}

	private _connectionPairToPosition(pair: ConnectionPositionPair): DropdownPosition {
		if (pair.originY === 'bottom' && pair.overlayY === 'top') {
			return 'bottom';
		}
		if (pair.originY === 'top' && pair.overlayY === 'bottom') {
			return 'top';
		}
		if (pair.originX === 'end' && pair.overlayX === 'start') {
			return 'right';
		}
		if (pair.originX === 'start' && pair.overlayX === 'end') {
			return 'left';
		}
		return 'bottom';
	}

	private _updateDropdownClass(currentPosition: string) {
		CSS_POSITIONS.forEach((position) => {
			const REMOVE_CSS_CLASS = `ng-select-${position}`;
			this._renderer.removeClass(this._dropdown, REMOVE_CSS_CLASS);
			this._renderer.removeClass(this._select, REMOVE_CSS_CLASS);
		});

		const ADD_CSS_CLASS = `ng-select-${currentPosition}`;
		this._renderer.addClass(this._dropdown, ADD_CSS_CLASS);
		this._renderer.addClass(this._select, ADD_CSS_CLASS);
	}

	private _handleScroll() {
		this._zone.runOutsideAngular(() => {
			const scrollablePanel = this._scrollablePanel();
			if (!scrollablePanel) {
				return;
			}
			fromEvent(scrollablePanel, 'scroll')
				.pipe(takeUntilDestroyed(this._destroyRef), auditTime(0, SCROLL_SCHEDULER))
				.subscribe(() => {
					this._onContentScrolled(scrollablePanel.scrollTop);
				});
		});
	}

	private _handleOutsideClick() {
		if (!this._document) {
			return;
		}

		const outsideEvent = this.outsideClickEvent() ?? 'click';

		this._zone.runOutsideAngular(() => {
			// A click is judged by where the press began, not where it ended. Between
			// mousedown and click the layout can move under the cursor — focusing the
			// select auto-scrolls it into view (#2773), or the freshly opened panel
			// shifts the page (#2441) — leaving the click target on an unrelated
			// element. Irrelevant when closing on mousedown itself, so skip the
			// listener in that mode
			if (outsideEvent === 'click') {
				fromEvent(this._document, 'mousedown', { capture: true })
					.pipe(takeUntilDestroyed(this._destroyRef))
					.subscribe(($event) => (this._lastMousedownInside = this._isEventInside($event)));
			}

			fromEvent(this._document, outsideEvent, { capture: true })
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe(($event) => this._checkToClose($event));
		});
	}

	private _checkToClose($event: Event) {
		const pressStartedInside = this._lastMousedownInside;
		this._lastMousedownInside = false;
		if (pressStartedInside || this._isEventInside($event)) {
			return;
		}

		this._zone.run(() => this.outsideClick.emit());
	}

	private _isEventInside($event: any): boolean {
		// An event crossing a shadow boundary is retargeted to the shadow host, which
		// hides its real origin from contains(). composedPath() still lists every node
		// the event bubbled through, so matching the select or dropdown anywhere along
		// it works identically for light DOM, shadow DOM, and nested roots (#2726)
		const path: EventTarget[] = $event.path || ($event.composedPath && $event.composedPath());
		if (path?.length) {
			return path.includes(this._select) || path.includes(this._dropdown);
		}
		return this._select.contains($event.target) || this._dropdown.contains($event.target);
	}

	private _onItemsOrShowAddTagChange(items: NgOption[] = [], showAddTag: boolean, firstChange: boolean) {
		this._scrollToEndFired = false;
		this.itemsLength = items.length;
		if (showAddTag && items.length) {
			this.itemsLength++;
		}

		if (this.virtualScroll()) {
			this._updateItemsRange(firstChange);
		} else {
			this._setVirtualHeight();
			this._updateItems(firstChange);
		}
	}

	private _updateItems(firstChange: boolean) {
		this.update.emit(this.items());

		this._zone.runOutsideAngular(() => {
			Promise.resolve().then(() => {
				// Typeahead/filter can open empty (panelHeight ≈ type-to-search) then replace
				// items while open. Refresh the scrollport height so keyboard scrollTo math
				// matches the real max-height panel — without changing scroll position (#2744).
				this._syncPanelHeightFromDom();
				if (!firstChange) {
					// Re-anchor so a top-placed panel grows upward instead of covering the
					// select, and `auto` can flip once the content no longer fits (#2092)
					this.overlayRef()?.updatePosition();
					return;
				}
				this._positionDropdown();
				this.scrollTo(this.markedItem(), firstChange);
			});
		});
	}

	private _updateItemsRange(firstChange: boolean) {
		this._zone.runOutsideAngular(() => {
			this._measureDimensions().then(() => {
				const scrollTop = firstChange ? this._startOffset : (this._scrollablePanel()?.scrollTop ?? 0);
				this._renderItemsRange(scrollTop);

				// Measurement / a short prior list leaves the panel content-sized. After the
				// provisional range paints, sync max-height panelHeight for scrollTo (#2744).
				// If viewport capacity grows, re-render — otherwise DOM stays on the stale
				// (too-small) range while dimensions already reflect the larger panel.
				const itemsPerViewportBefore = this._panelService.dimensions.itemsPerViewport;
				this._syncPanelHeightFromDom();
				if (this._panelService.dimensions.itemsPerViewport !== itemsPerViewportBefore) {
					this._lastScrollPosition = -1;
					this._renderItemsRange(this._scrollablePanel()?.scrollTop ?? scrollTop);
				}

				if (firstChange) {
					this._positionDropdown();
				} else {
					this.overlayRef()?.updatePosition();
				}
			});
		});
	}

	/** Updates cached panelHeight from the live scrollport, preserving row-height measurements. */
	private _syncPanelHeightFromDom() {
		const panel = this._scrollablePanel();
		if (!panel) {
			return;
		}
		const panelHeight = panel.clientHeight;
		if (panelHeight <= 0) {
			return;
		}
		const { itemHeight, groupHeight } = this._panelService.dimensions;
		this._panelService.setDimensions(itemHeight, panelHeight, groupHeight);
	}

	private _onContentScrolled(scrollTop: number) {
		if (this.virtualScroll()) {
			this._renderItemsRange(scrollTop);
		}
		this._lastScrollPosition = scrollTop;
		this._fireScrollToEnd(scrollTop);
	}

	private _updateVirtualHeight(height: number) {
		if (this._updateScrollHeight) {
			this._virtualPadding().style.height = `${height}px`;
			this._updateScrollHeight = false;
		}
	}

	private _setVirtualHeight() {
		if (!this._virtualPadding()) {
			return;
		}

		this._virtualPadding().style.height = `0px`;
	}

	private _onItemsLengthChanged() {
		this._updateScrollHeight = true;
	}

	private _renderItemsRange(scrollTop = null) {
		if (scrollTop && this._lastScrollPosition === scrollTop) {
			return;
		}

		scrollTop = scrollTop || this._scrollablePanel().scrollTop;
		const range = this._panelService.calculateItems(scrollTop, this.itemsLength, this.bufferAmount(), this.items());
		this._updateVirtualHeight(range.scrollHeight);
		this._contentPanel().style.transform = `translateY(${range.topPadding}px)`;

		// These outputs must stay template-bound in ng-select.component.html: the
		// template listener wrapper is what schedules CD under zoneless (zone.run is a
		// no-op there). A programmatic subscribe would need an explicit markForCheck
		this._zone.run(() => {
			this.update.emit(this.items().slice(range.start, range.end));
			this.scroll.emit({ start: range.start, end: range.end });
		});

		if (isDefined(scrollTop) && this._lastScrollPosition === 0) {
			this._scrollablePanel().scrollTop = scrollTop;
			this._lastScrollPosition = scrollTop;
		}
	}

	private _measureDimensions(): Promise<PanelDimensions> {
		if (this._panelService.dimensions.itemHeight > 0 || this.itemsLength === 0) {
			return Promise.resolve(this._panelService.dimensions);
		}

		const items = this.items();
		const firstGroup = items.find((item) => !!item.children);
		const firstOption = items.find((item) => !item.children);
		const toMeasure = [firstGroup, firstOption].filter((item): item is NgOption => !!item);
		if (toMeasure.length === 0) {
			return Promise.resolve(this._panelService.dimensions);
		}

		// Relies on synchronous template execution: the emitted items render in the
		// same CD pass (the parent's template listener runs mid-pass and the @for sits
		// later in the template), so the microtask below measures real DOM with and
		// without zone.js alike. Measuring both a group header and an option avoids
		// under-sizing virtual scroll when their templates have different heights (#2762).
		this._zone.run(() => this.update.emit(toMeasure));

		return Promise.resolve()
			.then(() => this._readMeasuredDimensions(items, firstOption, firstGroup))
			.then((dims) => {
				if (dims.itemHeight > 0) {
					return dims;
				}
				// Empty→items (typeahead) can measure before the projected options paint.
				// Retry once on the next frame (#2744).
				return new Promise<PanelDimensions>((resolve) => {
					requestAnimationFrame(() => {
						this._zone.run(() => this.update.emit(toMeasure));
						Promise.resolve().then(() => resolve(this._readMeasuredDimensions(items, firstOption, firstGroup)));
					});
				});
			});
	}

	private _readMeasuredDimensions(items: NgOption[], firstOption: NgOption | undefined, firstGroup: NgOption | undefined): PanelDimensions {
		const optionEl = firstOption ? this._dropdown.querySelector(`#${firstOption.htmlId}`) : null;
		const groupEl = firstGroup ? this._dropdown.querySelector(`#${firstGroup.htmlId}`) : null;
		if (!optionEl && !groupEl) {
			return this._panelService.dimensions;
		}

		const measuredOptionHeight = optionEl?.offsetHeight ?? 0;
		const measuredGroupHeight = groupEl?.offsetHeight ?? 0;
		const optionHeight = measuredOptionHeight || measuredGroupHeight;
		const groupHeight = measuredGroupHeight || measuredOptionHeight;

		const panelHeight = this._scrollablePanel().clientHeight;
		this._panelService.setDimensions(optionHeight, panelHeight, groupHeight);
		this._virtualPadding().style.height = `${this._panelService.getScrollHeight(items)}px`;

		return this._panelService.dimensions;
	}

	private _fireScrollToEnd(scrollTop: number) {
		if (this._scrollToEndFired || scrollTop === 0) {
			return;
		}

		const padding = this.virtualScroll() ? this._virtualPadding() : this._contentPanel();

		if (scrollTop + this._dropdown.clientHeight >= padding.clientHeight - 1) {
			this._zone.run(() => this.scrollToEnd.emit());
			this._scrollToEndFired = true;
		}
	}

	private _setupMousedownListener(): void {
		this._zone.runOutsideAngular(() => {
			fromEvent(this._dropdown, 'mousedown')
				.pipe(takeUntilDestroyed(this._destroyRef))
				.subscribe((event: MouseEvent) => {
					const target = event.target as HTMLElement;
					if (target.tagName === 'INPUT') {
						return;
					}
					event.preventDefault();
				});
		});
	}

	private _handleDocumentScroll() {
		if (!this._document || !this.overlayRef()) {
			return;
		}
		this._zone.runOutsideAngular(() => {
			// The capture phase sees scrolls of the window and of every ancestor scroll
			// container — including plain overflow elements that CDK's ScrollDispatcher
			// cannot observe without a cdkScrollable marker — so the panel stays anchored
			// to the select wherever the page moves (#2788, #2829)
			fromEvent(this._document, 'scroll', { capture: true, passive: true })
				.pipe(takeUntilDestroyed(this._destroyRef), auditTime(0, SCROLL_SCHEDULER))
				.subscribe(($event) => {
					const target = $event.target as Node | null;
					// Scrolling the option list itself does not move the anchor
					if (target && this._dropdown.contains(target)) {
						return;
					}
					this.overlayRef().updatePosition();
				});
		});
	}

	private _handleSelectResize() {
		const overlayRef = this.overlayRef();
		if (!overlayRef || !this._select || typeof ResizeObserver === 'undefined') {
			return;
		}

		this._zone.runOutsideAngular(() => {
			const observer = new ResizeObserver(() => {
				overlayRef.updateSize({ minWidth: this._select.getBoundingClientRect().width });
				overlayRef.updatePosition();
			});

			observer.observe(this._select);
			this._destroyRef.onDestroy(() => observer.disconnect());
		});
	}
}
