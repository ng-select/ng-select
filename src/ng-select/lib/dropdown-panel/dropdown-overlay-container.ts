import { OverlayContainer } from '@angular/cdk/overlay';

/**
 * Provides an overlay container that preserves DOM containment when `appendTo` is configured.
 *
 * @since 24.0.5
 */
export class NgSelectAppendToOverlayContainer extends OverlayContainer {
	/**
	 * Creates an instance of NgSelectAppendToOverlayContainer.
	 *
	 * @param appendToHost - The append to host.
	 *
	 * @since 24.0.5
	 */
	constructor(private readonly appendToHost: HTMLElement) {
		super();
	}

	/**
	 * Creates the CDK overlay container inside the configured append target.
	 *
	 * @since 24.0.5
	 */
	protected override _createContainer(): void {
		super._createContainer();
		this.appendToHost.appendChild(this._containerElement);
	}
}
