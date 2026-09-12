import {
	createFlexibleConnectedPositionStrategy,
	createNoopScrollStrategy,
	createOverlayRef,
	FlexibleConnectedPositionStrategy,
	OverlayContainer,
	OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Injector, runInInjectionContext, TemplateRef, ViewContainerRef } from '@angular/core';

import { DropdownPosition } from '../types/ng-select.types';
import { NgSelectAppendToOverlayContainer } from './dropdown-overlay-container';
import { DROPDOWN_POSITIONS } from './dropdown-position';

/**
 * Describes the state required to open and position an ng-select dropdown overlay.
 *
 * @since 24.0.5
 */
export interface DropdownOverlayOpenRequest {
	appendTo: string | null;
	beforeAttach?: (overlayRef: OverlayRef) => void;
	origin: HTMLElement;
	position: DropdownPosition;
	template: TemplateRef<unknown>;
	viewContainer: ViewContainerRef;
}

/**
 * Owns the CDK overlay resources used by one ng-select instance.
 *
 * @since 24.0.5
 */
export class DropdownOverlayManager {
	overlayRef: OverlayRef | null = null;

	private positionStrategy: FlexibleConnectedPositionStrategy | null = null;
	private portal: TemplatePortal | null = null;
	private overlayAppendTo: string | null = null;
	private overlayAppendToHost: HTMLElement | null = null;
	private appendToContainer: NgSelectAppendToOverlayContainer | null = null;

	/**
	 * Creates an instance of DropdownOverlayManager.
	 *
	 * @param injector - The injector.
	 * @param document - The document.
	 * @param selectElement - The select element.
	 *
	 * @since 24.0.5
	 */
	constructor(
		private readonly injector: Injector,
		private readonly document: Document,
		private readonly selectElement: HTMLElement,
	) {}

	/**
	 * Opens the dropdown panel.
	 *
	 * @param request - The request.
	 * @returns The attached overlay reference.
	 *
	 * @since 24.0.5
	 */
	open(request: DropdownOverlayOpenRequest): OverlayRef {
		const overlayRef = this.ensureOverlay(request.origin, request.appendTo);
		this.positionStrategy.withPositions([...(DROPDOWN_POSITIONS[request.position] ?? DROPDOWN_POSITIONS.auto)]);
		// Direction is snapshotted per open, matching the previous appendTo behavior.
		overlayRef.setDirection(this.document.documentElement?.dir === 'rtl' ? 'rtl' : 'ltr');
		overlayRef.updateSize({ width: request.origin.getBoundingClientRect().width });
		// The parent binds this reference into the portal content, so publish it before attachment.
		request.beforeAttach?.(overlayRef);

		if (overlayRef.hasAttached()) {
			overlayRef.updatePosition();
			return overlayRef;
		}

		this.portal ??= new TemplatePortal(request.template, request.viewContainer);
		overlayRef.attach(this.portal);
		return overlayRef;
	}

	/**
	 * Closes the dropdown panel.
	 *
	 * @since 24.0.5
	 */
	close(): void {
		this.overlayRef?.detach();
	}

	/**
	 * Disposes the owned overlay resources.
	 *
	 * @since 24.0.5
	 */
	destroy(): void {
		this.overlayRef?.dispose();
		this.overlayRef = null;
		this.positionStrategy = null;
		this.overlayAppendToHost = null;
		this.appendToContainer?.ngOnDestroy();
		this.appendToContainer = null;
	}

	/**
	 * Returns the existing overlay or creates one for the requested host.
	 *
	 * @param origin - The origin.
	 * @param appendTo - The append to.
	 * @returns The reusable overlay reference.
	 *
	 * @since 24.0.5
	 */
	private ensureOverlay(origin: HTMLElement, appendTo: string | null): OverlayRef {
		// Resolve on each open so a selector keeps working when its matching element is replaced.
		const appendToHost = appendTo ? this.resolveAppendToHost(appendTo) : null;
		if (this.overlayRef && (appendTo !== this.overlayAppendTo || appendToHost !== this.overlayAppendToHost)) {
			this.destroy();
		}

		if (!this.overlayRef) {
			let injector = this.injector;
			if (appendToHost) {
				this.appendToContainer = runInInjectionContext(this.injector, () => new NgSelectAppendToOverlayContainer(appendToHost));
				injector = Injector.create({
					parent: this.injector,
					providers: [{ provide: OverlayContainer, useValue: this.appendToContainer }],
				});
			}

			this.positionStrategy = createFlexibleConnectedPositionStrategy(injector, origin).withFlexibleDimensions(false).withPush(false);
			if (appendToHost) {
				// Supporting browsers paint in the Popover API top layer. The host still controls
				// DOM containment for ancestor-scoped styles and focus enclosure.
				this.positionStrategy.withPopoverLocation({ type: 'parent', element: appendToHost });
			}

			this.overlayAppendTo = appendTo;
			this.overlayAppendToHost = appendToHost;
			this.overlayRef = createOverlayRef(injector, {
				positionStrategy: this.positionStrategy,
				// The panel handles ancestor scrolling, including containers without cdkScrollable.
				scrollStrategy: createNoopScrollStrategy(),
				// No panel animation needs to delay synchronous DOM removal.
				disableAnimations: true,
			});
		}

		return this.overlayRef;
	}

	/**
	 * Resolves the configured `appendTo` selector within the select root.
	 *
	 * @param selector - The CSS selector to resolve.
	 * @returns The element matching the selector.
	 *
	 * @since 24.0.5
	 */
	private resolveAppendToHost(selector: string): HTMLElement {
		const root = this.selectElement.getRootNode();
		const scope = typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot ? root : this.document;
		const host = scope.querySelector<HTMLElement>(selector);
		if (!host) {
			throw new Error(`appendTo selector ${selector} did not found any parent element`);
		}
		return host;
	}
}
