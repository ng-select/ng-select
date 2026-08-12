import { FlexibleConnectedPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushAsync } from '../testing/helpers';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgDropdownPanelService } from './ng-dropdown-panel.service';
import { DropdownPosition, NgOption } from './ng-select.types';

const ITEM_HEIGHT = 25;
const PANEL_HEIGHT = 100;

function createItems(count: number): NgOption[] {
	return Array.from({ length: count }, (_, index) => ({
		index,
		htmlId: `test-option-${index}`,
		label: `item ${index}`,
		value: index,
	}));
}

interface FakeOverlayRef {
	updatePosition: ReturnType<typeof vi.fn>;
	updateSize: ReturnType<typeof vi.fn>;
	getConfig: () => { positionStrategy: unknown };
}

function createFakeOverlayRef(positionStrategy: unknown = null): FakeOverlayRef {
	return {
		updatePosition: vi.fn(),
		updateSize: vi.fn(),
		getConfig: () => ({ positionStrategy }),
	};
}

/** Creates an object passing `instanceof FlexibleConnectedPositionStrategy` with a controllable positionChanges stream. */
function createFakePositionStrategy() {
	const positionChanges$ = new Subject<{ connectionPair: any }>();
	const strategy = Object.create(FlexibleConnectedPositionStrategy.prototype);
	strategy.positionChanges = positionChanges$.asObservable();
	return { strategy, positionChanges$ };
}

async function waitForFrames(count = 2): Promise<void> {
	for (let i = 0; i < count; i++) {
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
	}
	await flushAsync();
}

@Component({
	selector: 'ng-dropdown-panel-test-cmp',
	imports: [NgDropdownPanelComponent],
	providers: [NgDropdownPanelService],
	encapsulation: ViewEncapsulation.None,
	styles: [
		`
			.fake-select {
				width: 200px;
			}
			ng-dropdown-panel {
				display: block;
				opacity: 0;
				width: 200px;
			}
			.ng-dropdown-panel-items {
				display: block;
				position: relative;
				max-height: 100px;
				overflow-y: auto;
			}
			.total-padding {
				width: 1px;
				opacity: 0;
			}
			.scrollable-content {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
			}
			.test-option {
				height: 25px;
				box-sizing: border-box;
			}
			.test-option.with-border {
				border-bottom: 2px solid #c62828;
			}
		`,
	],
	template: `
		<div class="fake-select">
			<ng-dropdown-panel
				[items]="items()"
				[markedItem]="markedItem()"
				[position]="position()"
				[virtualScroll]="virtualScroll()"
				[bufferAmount]="bufferAmount()"
				[showAddTag]="showAddTag()"
				[outsideClickEvent]="outsideClickEvent()"
				[overlayRef]="overlayRef()"
				[selectElement]="selectElement()"
				(update)="onUpdate($event)"
				(scroll)="scrollEvents.push($event)"
				(scrollToEnd)="scrollToEndCount = scrollToEndCount + 1"
				(outsideClick)="outsideClickCount = outsideClickCount + 1">
				@for (item of viewPortItems(); track item.htmlId) {
					<div class="test-option" [class.with-border]="borderedOptions()" [id]="item.htmlId">{{ item.label }}</div>
				}
				<input class="inner-input" />
			</ng-dropdown-panel>
		</div>
		<button type="button" class="outside-button">outside</button>
	`,
})
class NgDropdownPanelTestComponent {
	readonly items = signal<NgOption[]>(createItems(30));
	readonly markedItem = signal<NgOption | undefined>(undefined);
	readonly position = signal<DropdownPosition>('auto');
	readonly virtualScroll = signal(false);
	readonly borderedOptions = signal(false);
	readonly bufferAmount = signal(4);
	readonly showAddTag = signal(false);
	readonly outsideClickEvent = signal<'click' | 'mousedown' | null>('click');
	readonly overlayRef = signal<OverlayRef | null>(null);
	readonly selectElement = signal<HTMLElement | undefined>(undefined);
	readonly viewPortItems = signal<NgOption[]>([]);
	renderItems = true;
	updateEvents: NgOption[][] = [];
	scrollEvents: { start: number; end: number }[] = [];
	scrollToEndCount = 0;
	outsideClickCount = 0;

	onUpdate(items: NgOption[]) {
		this.updateEvents.push(items);
		if (this.renderItems) {
			this.viewPortItems.set(items);
		}
	}
}

describe('NgDropdownPanelComponent', () => {
	let fixture: ComponentFixture<NgDropdownPanelTestComponent>;
	let host: NgDropdownPanelTestComponent;

	function createFixture(setup?: (host: NgDropdownPanelTestComponent) => void): NgDropdownPanelComponent {
		fixture = TestBed.createComponent(NgDropdownPanelTestComponent);
		host = fixture.componentInstance;
		setup?.(host);
		fixture.detectChanges();
		return panel();
	}

	function panel(): NgDropdownPanelComponent {
		return fixture.debugElement.query(By.directive(NgDropdownPanelComponent)).componentInstance;
	}

	function panelElement(): HTMLElement {
		return fixture.debugElement.query(By.directive(NgDropdownPanelComponent)).nativeElement;
	}

	function selectHostElement(): HTMLElement {
		return fixture.nativeElement.querySelector('.fake-select');
	}

	function scrollHostElement(): HTMLElement {
		return fixture.nativeElement.querySelector('.ng-dropdown-panel-items');
	}

	function panelService(): NgDropdownPanelService {
		return fixture.debugElement.query(By.directive(NgDropdownPanelComponent)).injector.get(NgDropdownPanelService);
	}

	async function dispatchScroll(element: HTMLElement, scrollTop: number): Promise<void> {
		element.scrollTop = scrollTop;
		element.dispatchEvent(new Event('scroll'));
		await waitForFrames();
	}

	afterEach(async () => {
		// Let pending outside-zone microtasks from item changes settle while the fixture is still alive
		await flushAsync();
		vi.unstubAllGlobals();
	});

	describe('standalone usage without an overlay', () => {
		it('should fall back to the parent element as select host and position to bottom for auto', async () => {
			const cmp = createFixture();
			await flushAsync();

			expect(cmp.currentPosition).toBe('bottom');
			expect(panelElement().classList.contains('ng-select-bottom')).toBe(true);
			expect(selectHostElement().classList.contains('ng-select-bottom')).toBe(true);
			expect(panelElement().style.opacity).toBe('1');
		});

		it('should reflect the configured side directly when position is not auto', async () => {
			const cmp = createFixture((host) => host.position.set('top'));
			await flushAsync();

			expect(cmp.currentPosition).toBe('top');
			expect(panelElement().classList.contains('ng-select-top')).toBe(true);
			expect(selectHostElement().classList.contains('ng-select-top')).toBe(true);
		});

		it('should use the provided select element instead of the parent element', async () => {
			const external = document.createElement('div');
			const cmp = createFixture((host) => host.selectElement.set(external));
			await flushAsync();

			expect(cmp.currentPosition).toBe('bottom');
			expect(external.classList.contains('ng-select-bottom')).toBe(true);
			expect(selectHostElement().classList.contains('ng-select-bottom')).toBe(false);
		});

		it('should reposition through adjustPosition only when an overlay exists', async () => {
			const cmp = createFixture();
			await flushAsync();

			expect(() => cmp.adjustPosition()).not.toThrow();

			const overlayRef = createFakeOverlayRef();
			host.overlayRef.set(overlayRef as unknown as OverlayRef);
			fixture.detectChanges();
			cmp.adjustPosition();
			expect(overlayRef.updatePosition).toHaveBeenCalled();
		});
	});

	describe('overlay position changes', () => {
		let cmp: NgDropdownPanelComponent;
		let positionChanges$: Subject<{ connectionPair: any }>;
		let overlayRef: FakeOverlayRef;

		beforeEach(async () => {
			const fake = createFakePositionStrategy();
			positionChanges$ = fake.positionChanges$;
			overlayRef = createFakeOverlayRef(fake.strategy);
			cmp = createFixture((host) => host.overlayRef.set(overlayRef as unknown as OverlayRef));
			await flushAsync();
		});

		function emitPair(pair: { originX: string; originY: string; overlayX: string; overlayY: string }) {
			positionChanges$.next({ connectionPair: pair });
		}

		it('should request overlay positioning instead of the standalone fallback', () => {
			expect(overlayRef.updatePosition).toHaveBeenCalled();
			expect(panelElement().style.opacity).toBe('1');
		});

		it('should map a below pair to bottom', () => {
			emitPair({ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' });
			expect(cmp.currentPosition).toBe('bottom');
			expect(panelElement().classList.contains('ng-select-bottom')).toBe(true);
		});

		it('should map an above pair to top', () => {
			emitPair({ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' });
			expect(cmp.currentPosition).toBe('top');
			expect(panelElement().classList.contains('ng-select-top')).toBe(true);
			expect(selectHostElement().classList.contains('ng-select-top')).toBe(true);
		});

		it('should map a horizontal end/start pair to right', () => {
			emitPair({ originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' });
			expect(cmp.currentPosition).toBe('right');
			expect(panelElement().classList.contains('ng-select-right')).toBe(true);
		});

		it('should map a horizontal start/end pair to left', () => {
			emitPair({ originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' });
			expect(cmp.currentPosition).toBe('left');
			expect(panelElement().classList.contains('ng-select-left')).toBe(true);
		});

		it('should fall back to bottom for unknown horizontal pairs', () => {
			emitPair({ originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'top' });
			expect(cmp.currentPosition).toBe('bottom');

			emitPair({ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' });
			expect(cmp.currentPosition).toBe('bottom');
		});
	});

	describe('scrollTo', () => {
		it('should do nothing without an option', async () => {
			const cmp = createFixture();
			await flushAsync();
			expect(() => cmp.scrollTo(null)).not.toThrow();
		});

		it('should ignore options which are not part of the items list', async () => {
			const cmp = createFixture();
			await flushAsync();

			cmp.scrollTo({ htmlId: 'unknown', label: 'x' });
			expect(scrollHostElement().scrollTop).toBe(0);
		});

		it('should ignore options which are not rendered in the panel', async () => {
			const cmp = createFixture();
			await flushAsync();

			host.renderItems = false;
			host.viewPortItems.set(host.items().slice(0, 29));
			fixture.detectChanges();

			cmp.scrollTo(host.items()[29]);
			expect(scrollHostElement().scrollTop).toBe(0);
		});

		it('should scroll a rendered option into view', async () => {
			const cmp = createFixture();
			await flushAsync();
			fixture.detectChanges();

			cmp.scrollTo(host.items()[10]);
			expect(scrollHostElement().scrollTop).toBe(11 * ITEM_HEIGHT - PANEL_HEIGHT);

			cmp.scrollTo(host.items()[10], true);
			expect(scrollHostElement().scrollTop).toBe(10 * ITEM_HEIGHT);
		});

		it('should scroll using panel service dimensions when virtual scroll is enabled', async () => {
			const cmp = createFixture((host) => host.virtualScroll.set(true));
			await flushAsync();
			fixture.detectChanges();

			cmp.scrollTo(host.items()[20]);
			expect(scrollHostElement().scrollTop).toBe(21 * ITEM_HEIGHT - PANEL_HEIGHT);
		});

		it('should scroll to the end of the panel through scrollToTag', async () => {
			createFixture();
			await flushAsync();
			fixture.detectChanges();

			panel().scrollToTag();
			const scrollHost = scrollHostElement();
			expect(scrollHost.scrollTop).toBe(scrollHost.scrollHeight - scrollHost.clientHeight);
		});
	});

	describe('items changes', () => {
		it('should emit rendered items when the input changes', async () => {
			createFixture();
			await flushAsync();

			expect(host.updateEvents.at(-1)).toEqual(host.items());

			host.items.set(createItems(5));
			fixture.detectChanges();
			await flushAsync();

			expect(host.updateEvents.at(-1)).toEqual(host.items());
		});

		it('should reset the virtual padding height when virtual scroll is off', async () => {
			createFixture();
			await flushAsync();

			const padding: HTMLElement = fixture.nativeElement.querySelector('.ng-dropdown-panel-items > div:first-child');
			padding.style.height = '100px';

			host.items.set(createItems(5));
			fixture.detectChanges();
			await flushAsync();

			expect(padding.style.height).toBe('0px');
		});

		it('should reposition the overlay when items change while open', async () => {
			const overlayRef = createFakeOverlayRef();
			createFixture((host) => host.overlayRef.set(overlayRef as unknown as OverlayRef));
			await flushAsync();
			overlayRef.updatePosition.mockClear();

			host.items.set(createItems(10));
			fixture.detectChanges();
			await flushAsync();

			expect(overlayRef.updatePosition).toHaveBeenCalled();
		});
	});

	describe('virtual scroll', () => {
		it('should measure dimensions and render the first range', async () => {
			createFixture((host) => host.virtualScroll.set(true));
			await flushAsync();
			fixture.detectChanges();

			expect(panelService().dimensions.itemHeight).toBe(ITEM_HEIGHT);
			expect(panelService().dimensions.panelHeight).toBe(PANEL_HEIGHT);
			const padding: HTMLElement = fixture.nativeElement.querySelector('.total-padding');
			expect(padding.style.height).toBe(`${30 * ITEM_HEIGHT}px`);
			expect(host.viewPortItems().length).toBeLessThan(host.items().length);
			expect(host.scrollEvents.length).toBeGreaterThan(0);
		});

		it('should include option border width in virtual scroll item height', async () => {
			createFixture((host) => {
				host.virtualScroll.set(true);
				host.borderedOptions.set(true);
			});
			await flushAsync();
			fixture.detectChanges();

			const option: HTMLElement = fixture.nativeElement.querySelector('.test-option');
			expect(option.offsetHeight).toBeGreaterThan(option.clientHeight);

			const padding: HTMLElement = fixture.nativeElement.querySelector('.total-padding');
			expect(panelService().dimensions.itemHeight).toBe(option.offsetHeight);
			expect(padding.style.height).toBe(`${host.items().length * option.offsetHeight}px`);
		});

		it('should keep current dimensions when the first option cannot be measured', async () => {
			createFixture((host) => {
				host.virtualScroll.set(true);
				host.renderItems = false;
			});
			await flushAsync();

			expect(panelService().dimensions.itemHeight).toBe(0);
			expect(host.updateEvents.length).toBeGreaterThan(0);
		});

		it('should start from the marked item offset when it is below the fold', async () => {
			createFixture((host) => {
				host.virtualScroll.set(true);
				host.markedItem.set(host.items()[20]);
			});
			await flushAsync();
			fixture.detectChanges();

			expect(scrollHostElement().scrollTop).toBe(20 * ITEM_HEIGHT);
		});

		it('should start from the top when the marked item fits into the panel', async () => {
			createFixture((host) => {
				host.virtualScroll.set(true);
				host.markedItem.set(host.items()[1]);
			});
			await flushAsync();

			expect(scrollHostElement().scrollTop).toBe(0);

			host.markedItem.set(undefined);
			fixture.detectChanges();
			expect(scrollHostElement().scrollTop).toBe(0);
		});

		it('should re-render the range and reposition the overlay when items change', async () => {
			const overlayRef = createFakeOverlayRef();
			createFixture((host) => {
				host.virtualScroll.set(true);
				host.overlayRef.set(overlayRef as unknown as OverlayRef);
			});
			await flushAsync();
			fixture.detectChanges();
			overlayRef.updatePosition.mockClear();

			host.items.set(createItems(50));
			fixture.detectChanges();
			await flushAsync();
			fixture.detectChanges();

			const padding: HTMLElement = fixture.nativeElement.querySelector('.total-padding');
			expect(padding.style.height).toBe(`${50 * ITEM_HEIGHT}px`);
			expect(overlayRef.updatePosition).toHaveBeenCalled();
		});

		it('should render new ranges while scrolling and skip ranges for repeated scroll positions', async () => {
			createFixture((host) => host.virtualScroll.set(true));
			await flushAsync();
			fixture.detectChanges();

			const scrollHost = scrollHostElement();
			await dispatchScroll(scrollHost, 10 * ITEM_HEIGHT);
			fixture.detectChanges();

			expect(host.scrollEvents.at(-1).end).toBeGreaterThan(10);

			const renderedRanges = host.scrollEvents.length;
			await dispatchScroll(scrollHost, 12 * ITEM_HEIGHT);
			fixture.detectChanges();
			expect(host.scrollEvents.length).toBe(renderedRanges + 1);

			// Same scroll position again renders no new range
			scrollHost.dispatchEvent(new Event('scroll'));
			await waitForFrames();
			expect(host.scrollEvents.length).toBe(renderedRanges + 1);
		});

		it('should emit scrollToEnd once when the virtual panel is scrolled to the bottom', async () => {
			createFixture((host) => host.virtualScroll.set(true));
			await flushAsync();
			fixture.detectChanges();

			const scrollHost = scrollHostElement();
			await dispatchScroll(scrollHost, scrollHost.scrollHeight);
			expect(host.scrollToEndCount).toBe(1);

			await dispatchScroll(scrollHost, scrollHost.scrollHeight - 1);
			expect(host.scrollToEndCount).toBe(1);
		});
	});

	describe('scroll to end without virtual scroll', () => {
		it('should not emit before the bottom of the content is reached', async () => {
			createFixture();
			await flushAsync();
			fixture.detectChanges();

			await dispatchScroll(scrollHostElement(), 2 * ITEM_HEIGHT);
			expect(host.scrollToEndCount).toBe(0);
		});

		it('should emit once at the bottom and ignore scrolling back to the top', async () => {
			createFixture();
			await flushAsync();
			fixture.detectChanges();

			const scrollHost = scrollHostElement();
			await dispatchScroll(scrollHost, scrollHost.scrollHeight);
			expect(host.scrollToEndCount).toBe(1);

			await dispatchScroll(scrollHost, scrollHost.scrollHeight);
			expect(host.scrollToEndCount).toBe(1);

			await dispatchScroll(scrollHost, 0);
			expect(host.scrollToEndCount).toBe(1);
		});
	});

	describe('outside click', () => {
		it('should emit when the press starts and ends outside', async () => {
			createFixture();
			await flushAsync();

			const outside = fixture.nativeElement.querySelector('.outside-button');
			outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

			expect(host.outsideClickCount).toBe(1);
		});

		it('should not emit when the press started inside the panel', async () => {
			createFixture();
			await flushAsync();
			fixture.detectChanges();

			const option = fixture.nativeElement.querySelector('.test-option');
			option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			fixture.nativeElement.querySelector('.outside-button').dispatchEvent(new MouseEvent('click', { bubbles: true }));

			expect(host.outsideClickCount).toBe(0);
		});

		it('should close on mousedown when configured to and skip the press tracking listener', async () => {
			createFixture((host) => host.outsideClickEvent.set('mousedown'));
			await flushAsync();

			fixture.nativeElement.querySelector('.outside-button').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			expect(host.outsideClickCount).toBe(1);
		});

		it('should default to the click event when the configured event is missing', async () => {
			createFixture((host) => host.outsideClickEvent.set(null));
			await flushAsync();

			const outside = fixture.nativeElement.querySelector('.outside-button');
			outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			expect(host.outsideClickCount).toBe(1);
		});

		it('should detect inside events through element containment when no composed path exists', async () => {
			const cmp = createFixture();
			await flushAsync();
			fixture.detectChanges();

			const inSelect = selectHostElement();
			const inDropdown = fixture.nativeElement.querySelector('.test-option');
			// The dropdown lives inside the select host here, so detach it to exercise the dropdown containment check
			const detachedDropdown = panelElement();
			document.body.appendChild(detachedDropdown);
			try {
				expect((cmp as any)._isEventInside({ target: inSelect })).toBe(true);
				expect((cmp as any)._isEventInside({ target: inDropdown })).toBe(true);
				expect((cmp as any)._isEventInside({ target: document.body, composedPath: () => [] })).toBe(false);
			} finally {
				selectHostElement().appendChild(detachedDropdown);
			}
		});
	});

	describe('mousedown default prevention', () => {
		it('should prevent default for presses on the panel but keep inputs focusable', async () => {
			createFixture();
			await flushAsync();
			fixture.detectChanges();

			const option = fixture.nativeElement.querySelector('.test-option');
			const optionEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
			option.dispatchEvent(optionEvent);
			expect(optionEvent.defaultPrevented).toBe(true);

			const input = fixture.nativeElement.querySelector('.inner-input');
			const inputEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
			input.dispatchEvent(inputEvent);
			expect(inputEvent.defaultPrevented).toBe(false);
		});
	});

	describe('document scroll anchoring', () => {
		it('should reposition the overlay when the page scrolls outside the panel', async () => {
			const overlayRef = createFakeOverlayRef();
			createFixture((host) => host.overlayRef.set(overlayRef as unknown as OverlayRef));
			await flushAsync();
			// Let the initial ResizeObserver notification settle before measuring calls
			await waitForFrames();
			overlayRef.updatePosition.mockClear();

			document.dispatchEvent(new Event('scroll'));
			await waitForFrames();
			expect(overlayRef.updatePosition).toHaveBeenCalled();

			// Scrolling the option list itself does not move the anchor
			const calls = overlayRef.updatePosition.mock.calls.length;
			scrollHostElement().dispatchEvent(new Event('scroll'));
			await waitForFrames();
			expect(overlayRef.updatePosition.mock.calls.length).toBe(calls);
		});
	});

	describe('select resize', () => {
		it('should sync the overlay size and position with the select width', async () => {
			const overlayRef = createFakeOverlayRef();
			createFixture((host) => host.overlayRef.set(overlayRef as unknown as OverlayRef));
			await flushAsync();

			selectHostElement().style.width = '300px';
			await vi.waitFor(() => expect(overlayRef.updateSize).toHaveBeenCalledWith({ width: 300 }));
			expect(overlayRef.updatePosition).toHaveBeenCalled();
		});

		it('should skip resize handling when ResizeObserver is not available', async () => {
			const overlayRef = createFakeOverlayRef();
			vi.stubGlobal('ResizeObserver', undefined);
			expect(() => createFixture((host) => host.overlayRef.set(overlayRef as unknown as OverlayRef))).not.toThrow();
			await flushAsync();
			vi.unstubAllGlobals();
		});
	});
});
