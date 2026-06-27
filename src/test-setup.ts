// Zone.js and the Vitest patch are loaded via `polyfills` on each project's `test-build`
// target in `angular.json`. TestBed is initialized by the Angular unit-test builder.

// Keep layout-dependent specs deterministic under Vitest browser mode.
function createRect(left: number, top: number, width: number, height: number): DOMRect {
	return {
		left,
		top,
		width,
		height,
		bottom: top + height,
		right: left + width,
		x: left,
		y: top,
		toJSON: () => ({}),
	} as DOMRect;
}

const originalShowPopover = HTMLElement.prototype.showPopover;
HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
	this.setAttribute('data-ng-popover-open', '');
	originalShowPopover?.call(this);
};

const originalHidePopover = HTMLElement.prototype.hidePopover;
HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
	this.removeAttribute('data-ng-popover-open');
	originalHidePopover?.call(this);
};

const originalMatches = Element.prototype.matches;
Element.prototype.matches = function matches(this: Element, selectors: string): boolean {
	if (selectors === ':popover-open') {
		return this.hasAttribute('data-ng-popover-open') || originalMatches.call(this, selectors);
	}

	return originalMatches.call(this, selectors);
} as typeof Element.prototype.matches;

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element): DOMRect {
	const element = this as HTMLElement;

	if (element.classList.contains('container')) {
		return createRect(0, 0, 200, 200);
	}

	if (element.tagName === 'NG-SELECT') {
		if (element.style.width === '50%') {
			return createRect(100, 100, 100, 30);
		}

		return createRect(0, 100, 200, 30);
	}

	if (element.classList.contains('ng-select-container')) {
		const host = element.closest('ng-select') as HTMLElement | null;
		const hostRect = host?.getBoundingClientRect() ?? createRect(0, 100, 200, 30);
		return createRect(hostRect.left, hostRect.top, hostRect.width, 30);
	}

	return originalGetBoundingClientRect.call(this);
};

const clientHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
	get(this: HTMLElement) {
		if (this.classList.contains('ng-option')) {
			return 24;
		}

		if (this.classList.contains('ng-dropdown-panel-items')) {
			return 240;
		}

		return clientHeightDescriptor?.get?.call(this) ?? 0;
	},
	configurable: true,
});

const offsetHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
	get(this: HTMLElement) {
		if (this.classList.contains('ng-option')) {
			return 24;
		}

		const styleHeight = this.style?.height;
		if (styleHeight?.endsWith('px')) {
			const value = Number.parseInt(styleHeight, 10);
			if (!Number.isNaN(value)) {
				return value;
			}
		}

		return offsetHeightDescriptor?.get?.call(this) ?? 0;
	},
	configurable: true,
});

const offsetTopDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop');
Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
	get(this: HTMLElement) {
		if (this.classList.contains('ng-option')) {
			const posinset = this.getAttribute('aria-posinset');
			if (posinset) {
				return (Number.parseInt(posinset, 10) - 1) * 24;
			}

			const panel = this.closest('.ng-dropdown-panel-items');
			const options = panel ? Array.from(panel.querySelectorAll('.ng-option')) : [];
			const index = options.indexOf(this);
			return index >= 0 ? index * 24 : 0;
		}

		return offsetTopDescriptor?.get?.call(this) ?? 0;
	},
	configurable: true,
});
