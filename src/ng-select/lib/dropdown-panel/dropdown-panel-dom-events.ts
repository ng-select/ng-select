import { OverlayRef } from '@angular/cdk/overlay';
import { DestroyRef, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animationFrameScheduler, asapScheduler, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

const EVENT_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;

/**
 * Configures DOM event handling for a rendered dropdown panel.
 *
 * @since 24.0.5
 */
export interface DropdownPanelDomEventOptions {
	closeOnScroll: boolean;
	destroyRef: DestroyRef;
	document: Document | null;
	dropdown: HTMLElement;
	onOutsideClick: () => void;
	onOutsideScroll: () => void;
	outsideClickEvent: 'click' | 'mousedown';
	overlayRef: OverlayRef | null;
	select: HTMLElement;
	zone: NgZone;
}

/**
 * Determines whether an event originated inside the select host or dropdown panel.
 *
 * @param event - The DOM event to inspect.
 * @param select - The ng-select host element.
 * @param dropdown - The rendered dropdown panel element.
 * @returns Whether the event originated inside either element.
 *
 * @since 24.0.5
 */
export function isEventInside(event: Event & { path?: EventTarget[] }, select: HTMLElement, dropdown: HTMLElement): boolean {
	// composedPath preserves the real origin across shadow DOM boundaries.
	const path = event.path || event.composedPath?.();
	if (path?.length) {
		return path.includes(select) || path.includes(dropdown);
	}
	return select.contains(event.target as Node) || dropdown.contains(event.target as Node);
}

/**
 * Coordinates document- and host-level DOM events for one rendered dropdown panel.
 *
 * @since 24.0.5
 */
export class DropdownPanelDomEvents {
	private lastMousedownInside = false;

	/**
	 * Creates an instance of DropdownPanelDomEvents.
	 *
	 * @param options - The options.
	 *
	 * @since 24.0.5
	 */
	constructor(private readonly options: DropdownPanelDomEventOptions) {}

	/**
	 * Starts dropdown DOM event monitoring.
	 *
	 * @since 24.0.5
	 */
	start(): void {
		this.handleOutsideClick();
		this.preventPanelMousedownFocus();
		this.handleDocumentScroll();
		this.handleSelectResize();
	}

	/**
	 * Subscribes to the configured outside-click event and closes when appropriate.
	 *
	 * @since 24.0.5
	 */
	private handleOutsideClick(): void {
		const { destroyRef, document, outsideClickEvent, zone } = this.options;
		if (!document) {
			return;
		}

		zone.runOutsideAngular(() => {
			// Track where a click started because opening/focusing can move layout before click.
			if (outsideClickEvent === 'click') {
				fromEvent(document, 'mousedown', { capture: true })
					.pipe(takeUntilDestroyed(destroyRef))
					.subscribe((event) => (this.lastMousedownInside = isEventInside(event, this.options.select, this.options.dropdown)));
			}

			fromEvent(document, outsideClickEvent, { capture: true })
				.pipe(takeUntilDestroyed(destroyRef))
				.subscribe((event) => this.checkToClose(event));
		});
	}

	/**
	 * Closes the dropdown when an event originated outside the select and panel.
	 *
	 * @param event - The DOM event to process.
	 *
	 * @since 24.0.5
	 */
	private checkToClose(event: Event): void {
		const pressStartedInside = this.lastMousedownInside;
		this.lastMousedownInside = false;
		if (pressStartedInside || isEventInside(event, this.options.select, this.options.dropdown)) {
			return;
		}
		this.options.zone.run(this.options.onOutsideClick);
	}

	/**
	 * Prevents panel mouse interactions from stealing input focus.
	 *
	 * @since 24.0.5
	 */
	private preventPanelMousedownFocus(): void {
		const { destroyRef, dropdown, zone } = this.options;
		zone.runOutsideAngular(() => {
			fromEvent<MouseEvent>(dropdown, 'mousedown')
				.pipe(takeUntilDestroyed(destroyRef))
				.subscribe((event) => {
					if ((event.target as HTMLElement).tagName !== 'INPUT') {
						event.preventDefault();
					}
				});
		});
	}

	/**
	 * Repositions the overlay, or closes it when `closeOnScroll` is set, when the document or an ancestor scrolls.
	 *
	 * @since 24.0.5
	 */
	private handleDocumentScroll(): void {
		const { closeOnScroll, destroyRef, document, dropdown, onOutsideScroll, overlayRef, zone } = this.options;
		if (!document || (!overlayRef && !closeOnScroll)) {
			return;
		}

		zone.runOutsideAngular(() => {
			const subscribe = () =>
				// Capture sees window and arbitrary ancestor scroll containers, even without cdkScrollable.
				fromEvent(document, 'scroll', { capture: true, passive: true })
					.pipe(takeUntilDestroyed(destroyRef), auditTime(0, EVENT_SCHEDULER))
					.subscribe((event) => {
						const target = event.target as Node | null;
						if (target && dropdown.contains(target)) {
							return;
						}
						if (closeOnScroll) {
							zone.run(onOutsideScroll);
						} else {
							overlayRef.updatePosition();
						}
					});

			if (!closeOnScroll || typeof requestAnimationFrame === 'undefined') {
				subscribe();
				return;
			}
			// Scrolls queued before the panel opened (e.g. focus-scroll) dispatch before this frame's rAF callbacks, so they are skipped.
			const frame = requestAnimationFrame(subscribe);
			destroyRef.onDestroy(() => cancelAnimationFrame(frame));
		});
	}

	/**
	 * Keeps the overlay width and position synchronized with the select host.
	 *
	 * @since 24.0.5
	 */
	private handleSelectResize(): void {
		const { destroyRef, overlayRef, select, zone } = this.options;
		if (!overlayRef || typeof ResizeObserver === 'undefined') {
			return;
		}

		zone.runOutsideAngular(() => {
			const observer = new ResizeObserver(() => {
				overlayRef.updateSize({ width: select.getBoundingClientRect().width });
				overlayRef.updatePosition();
			});
			observer.observe(select);
			destroyRef.onDestroy(() => observer.disconnect());
		});
	}
}
