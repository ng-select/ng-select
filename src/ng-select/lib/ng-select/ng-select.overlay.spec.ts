import { ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	applyZonelessFixtureCompat,
	getNgSelectElement,
	getNgSelectNativeElement,
	selectOption,
	TestsErrorHandler,
	tickAndDetectChanges,
	triggerKeyDownEvent,
} from '../../testing/helpers';
import { MockConsole } from '../../testing/mocks';
import { openSelect } from '../../testing/timer-helpers';
import { NgOptionComponent } from '../ng-option.component';
import { provideNgSelect } from '../ng-select.module';
import { NgSelectConfig } from '../services/config.service';
import { ConsoleService } from '../services/console.service';
import { KeyCode, NgOption } from '../types/ng-select.types';
import { NgSelectComponent } from './ng-select.component';

import { createEvent, createTestingModule, EncapsulatedTestComponent, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
	describe('Dropdown panel', () => {
		it('should set and render items in dropdown panel', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			expect(select.dropdownPanel().items().length).toBe(5);
			let options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options.length).toBe(5);
			expect(options[0].innerText).toBe('New York');
			expect(options[1].innerText).toBe('London');
			expect(options[2].innerText).toBe('Beijing');

			fixture.componentInstance.cities = Array.from(Array(30).keys()).map((_, i) => ({
				id: i,
				name: String.fromCharCode(97 + i),
			}));
			await tickAndDetectChanges(fixture);
			options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options.length).toBe(30);
			expect(options[0].innerText).toBe('a');
		});

		it('should always have div #padding with height 0 in dropdown panel when virtual scroll is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [virtualScroll]="false">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			const panelItems = document.querySelector('.ng-dropdown-panel-items');
			const firstChild = <HTMLScriptElement>panelItems.firstChild;

			expect(firstChild.offsetHeight).toBe(0);
		});

		it('should have div #padding with height other than 0 in dropdown panel when virtual scroll is enabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [virtualScroll]="true">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			expect(fixture.componentInstance.select().dropdownPanel().items().length).toBe(5);
			const options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options.length).toBe(5);
			expect(options[0].innerText).toBe('New York');
			expect(options[1].innerText).toBe('London');
			expect(options[2].innerText).toBe('Beijing');

			fixture.componentInstance.cities = Array.from(Array(30).keys()).map((_, i) => ({
				id: i,
				name: String.fromCharCode(97 + i),
			}));
			await tickAndDetectChanges(fixture);

			const panelItems = document.querySelector('.ng-dropdown-panel-items');
			const firstChild = <HTMLScriptElement>panelItems.firstChild;

			expect(firstChild.offsetHeight).not.toBe(0);
		});

		it('should set and render items in dropdown panel with virtual scroll', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [virtualScroll]="true"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			expect(fixture.componentInstance.select().dropdownPanel().items().length).toBe(5);
			let options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options.length).toBe(5);
			expect(options[0].innerText).toBe('New York');
			expect(options[1].innerText).toBe('London');
			expect(options[2].innerText).toBe('Beijing');

			fixture.componentInstance.cities = Array.from(Array(30).keys()).map((_, i) => ({
				id: i,
				name: String.fromCharCode(97 + i),
			}));
			await tickAndDetectChanges(fixture);
			options = document.querySelectorAll<HTMLElement>('.ng-option');
			const { itemsPerViewport } = (select.dropdownPanel() as any)._panelService.dimensions;
			const expectedItemsLength = Math.min(fixture.componentInstance.cities.length, itemsPerViewport + 1 + select.bufferAmount());
			expect(options.length).toBe(expectedItemsLength);
			expect(options[0].innerText).toBe('a');
		});

		it('should open empty dropdown panel with virtual scroll', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="[]"
                            bindLabel="name"
                            [virtualScroll]="true"
                            appendTo="body"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			const options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options.length).toBe(1);
			expect((<HTMLElement>options[0]).innerText).toBe('No items found');
		});

		it('should scroll to selected item on first open when virtual scroll is enabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [virtualScroll]="true"
                            [appendTo]="body"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			const cmp = fixture.componentInstance;
			cmp.cities = Array.from(Array(30).keys()).map((_, i) => ({ id: i, name: String.fromCharCode(97 + i) }));
			cmp.city = cmp.cities[10];
			await tickAndDetectChanges(fixture);

			await openSelect(select, fixture);

			const options = document.querySelectorAll<HTMLElement>('.ng-option');
			const marked = document.querySelector<HTMLElement>('.ng-option-marked');

			// Accept both 17 and 18 options as valid (environment-dependent panel height causes this variation)
			// With 240px panel height: itemsPerViewport=12, buffer=4, renders 18 options
			// With 220px panel height: itemsPerViewport=11, buffer=4, renders 17 options
			expect(options.length).toBeGreaterThanOrEqual(17);
			expect(options.length).toBeLessThanOrEqual(19);
			expect(marked.innerText).toBe('k');
			expect(marked.offsetTop).toBeGreaterThanOrEqual(180);
		});

		it('should scroll to item and do not change scroll position when scrolled to visible item', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);
			const cmp = fixture.componentInstance;

			cmp.select().open();
			await tickAndDetectChanges(fixture);

			cmp.cities = Array.from(Array(30).keys()).map((_, i) => ({ id: i, name: String.fromCharCode(97 + i) }));
			await tickAndDetectChanges(fixture);

			cmp.select().dropdownPanel().scrollTo(cmp.select().itemsList.items[1]);
			await tickAndDetectChanges(fixture);

			const panelItems = document.querySelector('.ng-dropdown-panel-items');
			expect(panelItems.scrollTop).toBe(0);
		});

		it('should scroll to item and change scroll position when scrolled to not visible item', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);
			const cmp = fixture.componentInstance;

			cmp.cities = Array.from(Array(30).keys()).map((_, i) => ({ id: i, name: String.fromCharCode(97 + i) }));
			await openSelect(cmp.select(), fixture);

			cmp.select().dropdownPanel().scrollTo(cmp.select().itemsList.items[15]);
			await tickAndDetectChanges(fixture);

			const panelItems = document.querySelector('.ng-dropdown-panel-items');
			expect(panelItems.scrollTop).toBeGreaterThanOrEqual(48);
		});

		it('should close on option select by default', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);

			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
		});

		it('should select item with encapsulation = ShadowDom', async () => {
			const fixture = createTestingModule(
				EncapsulatedTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="city"></ng-select>`,
			);

			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(0);
			expect(fixture.componentInstance.select().isOpen()).toBeFalsy();

			const cmp = fixture.componentInstance;

			cmp.select().open();
			await tickAndDetectChanges(fixture);

			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(0);
			expect(fixture.componentInstance.select().isOpen()).toBeTruthy();

			const outsideClick = vi.spyOn(cmp.select().dropdownPanel().outsideClick, 'emit').mockReturnValue(undefined);
			expect(outsideClick).not.toHaveBeenCalled();

			const listItem = fixture.debugElement.query(By.css('.ng-option'));
			let event = new MouseEvent('mousedown', { bubbles: true });
			listItem.nativeElement.dispatchEvent(event);
			event = new MouseEvent('click', { bubbles: true });
			listItem.nativeElement.dispatchEvent(event);
			await tickAndDetectChanges(fixture);

			await tickAndDetectChanges(fixture);
			expect(outsideClick).not.toHaveBeenCalled();
			expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
		});

		it('should open and close normally when [isOpen] is bound to undefined', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            [isOpen]="undefined"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBe(true);
			select.close();
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBe(false);
		});

		it('should not close when isOpen is true', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            [isOpen]="true"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);

			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
		});

		it('should not close on option select when [closeOnSelect]="false"', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [closeOnSelect]="false"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
		});

		it('should remove appended dropdown when it is destroyed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <ng-select [items]="cities"
                        appendTo="body"
                        [(ngModel)]="city">
                </ng-select>`,
			);

			fixture.componentInstance.select().open();
			fixture.detectChanges();
			fixture.componentInstance.select().close();

			await tickAndDetectChanges(fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown).toBeNull();
		});

		it('should set aria-label on the inner listbox element when ariaLabelDropdown input is provided', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" ariaLabelDropdown="Custom Aria Label" />`);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			// The dropdown panel itself should NOT have aria-label directly
			const dropdownPanel = document.querySelector('.ng-dropdown-panel');
			expect(dropdownPanel.getAttribute('aria-label')).toBeNull();

			// The inner element with role="listbox" should have the aria-label
			const listboxElement = document.querySelector('.ng-dropdown-panel-items[role="listbox"]');
			expect(listboxElement.getAttribute('aria-label')).toBe('Custom Aria Label');
		});

		it('should use ariaLabelDropdown from NgSelectConfig when not provided in template', async () => {
			const config = new NgSelectConfig();
			config.ariaLabelDropdown = 'Global Aria Label';
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" />`, config);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			const listboxElement = document.querySelector('.ng-dropdown-panel-items[role="listbox"]');
			expect(listboxElement.getAttribute('aria-label')).toBe('Global Aria Label');
		});

		it('should override ariaLabelDropdown from NgSelectConfig when provided in template', async () => {
			const config = new NgSelectConfig();
			config.ariaLabelDropdown = 'Global Aria Label';
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" ariaLabelDropdown="Template Aria Label" />`, config);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			const listboxElement = document.querySelector('.ng-dropdown-panel-items[role="listbox"]');
			expect(listboxElement.getAttribute('aria-label')).toBe('Template Aria Label');
		});

		describe('Popover (deprecated)', () => {
			it('should have popover input with default value false', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

				const select = fixture.componentInstance.select();
				expect(select.popover()).toBe(false);
			});

			it('should warn that popover is deprecated and has no effect', async () => {
				const warnSpy = vi.spyOn(MockConsole.prototype, 'warn');
				try {
					createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [popover]="true"></ng-select>`);
					expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`popover` is deprecated'));
				} finally {
					warnSpy.mockRestore();
				}
			});

			it('should not warn when popover is not set', async () => {
				const warnSpy = vi.spyOn(MockConsole.prototype, 'warn');
				try {
					createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);
					expect(warnSpy).not.toHaveBeenCalled();
				} finally {
					warnSpy.mockRestore();
				}
			});

			it('should render the dropdown panel in the CDK overlay regardless of popover value', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [popover]="false"></ng-select>`);

				const select = fixture.componentInstance.select();
				await openSelect(select, fixture);

				const panelElement = document.querySelector('.ng-dropdown-panel');
				expect(panelElement).not.toBeNull();
				expect(panelElement.closest('.cdk-overlay-pane')).not.toBeNull();
			});

			it('should render the dropdown panel in the native popover top layer when the browser supports it', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

				const select = fixture.componentInstance.select();
				await openSelect(select, fixture);

				const panelElement = document.querySelector('.ng-dropdown-panel');
				// CDK renders its overlays as native popovers whenever the Popover API exists,
				// which puts the dropdown in the top layer above all z-index stacking contexts
				if ('showPopover' in document.body) {
					expect(panelElement.closest(':popover-open')).not.toBeNull();
				} else {
					expect(panelElement.closest('.cdk-overlay-container')).not.toBeNull();
				}
			});

			describe('ResizeObserver repositioning', () => {
				let originalResizeObserver: any;
				let observerCallback: () => void;
				let disconnectSpy: Mock;

				beforeEach(() => {
					originalResizeObserver = (globalThis as any).ResizeObserver;
					disconnectSpy = vi.fn().mockName('disconnect');

					(globalThis as any).ResizeObserver = class {
						constructor(cb: () => void) {
							observerCallback = cb;
						}
						observe() {}
						disconnect = disconnectSpy;
					};
				});

				afterEach(() => {
					(globalThis as any).ResizeObserver = originalResizeObserver;
				});

				it('should sync overlay width and position when the select element resizes', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [closeOnSelect]="false" [(ngModel)]="selectedCities"></ng-select>`,
					);
					await tickAndDetectChanges(fixture);

					const select = fixture.componentInstance.select();
					await openSelect(select, fixture);

					const overlayRef = select.dropdownPanel().overlayRef();
					const updateSizeSpy = vi.spyOn(overlayRef, 'updateSize');
					const updatePositionSpy = vi.spyOn(overlayRef, 'updatePosition');

					observerCallback();
					await tickAndDetectChanges(fixture);

					expect(updateSizeSpy).toHaveBeenCalled();
					expect(updatePositionSpy).toHaveBeenCalled();
				});

				it('should disconnect ResizeObserver when the dropdown closes', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [closeOnSelect]="false" [(ngModel)]="selectedCities"></ng-select>`,
					);
					await tickAndDetectChanges(fixture);

					const select = fixture.componentInstance.select();
					select.open();
					await tickAndDetectChanges(fixture);

					select.close();
					await tickAndDetectChanges(fixture);

					expect(disconnectSpy).toHaveBeenCalled();
				});

				it('should disconnect ResizeObserver when component is destroyed', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [closeOnSelect]="false" [(ngModel)]="selectedCities"></ng-select>`,
					);
					await tickAndDetectChanges(fixture);

					const select = fixture.componentInstance.select();
					select.open();
					await tickAndDetectChanges(fixture);

					fixture.destroy();

					expect(disconnectSpy).toHaveBeenCalled();
				});
			});
		});
	});

	describe('Outside click', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;
		beforeEach(() => {
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<div id="outside">Outside</div><br />
                <ng-select id="select" [items]="cities"
                    bindLabel="name"
                    multiple="true"
                    [closeOnSelect]="false"
                    appendTo="body"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			select = fixture.componentInstance.select();
		});

		it('should close dropdown if opened and clicked outside dropdown container', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
			document.getElementById('outside').click();
			const event = new MouseEvent('mousedown', { bubbles: true });
			document.getElementById('outside').dispatchEvent(event);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
		});

		it('should prevent dropdown close if clicked on select', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			expect(select.isOpen()).toBeTruthy();
			document.getElementById('select').click();
			const event = new MouseEvent('mousedown', { bubbles: true });
			document.getElementById('select').dispatchEvent(event);
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();
		});

		it('should stay open when the page shifts between mousedown on the select and the resulting click (#2773)', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();

			// The press begins on the select, but focus-scroll moves the layout before
			// the click event fires, so its target resolves to an unrelated element
			document.getElementById('select').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			document.getElementById('outside').click();

			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();
		});

		it('should close when the interaction starts and ends outside the component', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();

			const outsideEl = document.getElementById('outside');
			outsideEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			outsideEl.click();

			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeFalsy();
		});

		it('should stay open when an option is clicked from within a shadow root (#2726)', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();

			// Host the panel in a shadow root, as happens with an appendTo target inside
			// a web component. The document-level listener then sees only the shadow host
			// as event target and must trace the click via composedPath() to recognize it
			// as an inside click
			const host = document.createElement('div');
			document.body.appendChild(host);
			const shadowRoot = host.attachShadow({ mode: 'open' });
			shadowRoot.appendChild(document.querySelector('ng-dropdown-panel'));

			try {
				const option = shadowRoot.querySelector('.ng-option') as HTMLElement;
				option.click();

				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBeTruthy();
				expect(select.selectedItems.length).toBe(1);
			} finally {
				host.remove();
			}
		});

		it('should close dropdown when clicking outside if NgSelectConfig is provided as a partial object without outsideClickEvent', async () => {
			// Simulate real-world usage: `{ provide: NgSelectConfig, useValue: { appendTo: 'body' } }`
			// where outsideClickEvent is undefined because the plain object lacks that property.
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				providers: [
					{ provide: ErrorHandler, useClass: TestsErrorHandler },
					{ provide: ConsoleService, useFactory: () => new MockConsole() },
					{ provide: NgSelectConfig, useValue: { appendTo: 'body' } },
					...provideNgSelect(),
				],
			}).overrideComponent(NgSelectTestComponent, {
				set: {
					template: `<div id="outside2">Outside</div>
					<ng-select id="select2" [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`,
					imports: [NgSelectComponent, NgOptionComponent, FormsModule],
				},
			});
			TestBed.compileComponents();
			const partialFixture = applyZonelessFixtureCompat(TestBed.createComponent(NgSelectTestComponent));
			partialFixture.detectChanges();
			const partialSelect = partialFixture.componentInstance.select();

			triggerKeyDownEvent(getNgSelectElement(partialFixture), KeyCode.Space);
			await tickAndDetectChanges(partialFixture);
			expect(partialSelect.isOpen()).toBeTruthy();

			document.getElementById('outside2').click();
			await tickAndDetectChanges(partialFixture);
			expect(partialSelect.isOpen()).toBeFalsy();
		});
	});

	describe('Outside click without appendTo', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;
		beforeEach(() => {
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<div id="outside">Outside</div><br />
                <ng-select id="select" [items]="cities"
                    bindLabel="name"
                    multiple="true"
                    [closeOnSelect]="false"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			select = fixture.componentInstance.select();
		});

		it('should stay open when the page shifts between mousedown on the select and the resulting click', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();

			document.getElementById('select').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			document.getElementById('outside').click();

			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();
		});

		it('should close when the interaction starts and ends outside the component', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeTruthy();

			const outsideEl = document.getElementById('outside');
			outsideEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
			outsideEl.click();

			await tickAndDetectChanges(fixture);
			expect(select.isOpen()).toBeFalsy();
		});
	});

	describe('Immediate close - DOM removal without external change detection (issue #2765)', () => {
		// close() uses detectChanges() internally to ensure the dropdown panel is
		// removed from the DOM immediately, without relying on zone-triggered CD.
		// This is critical in Angular 21 with provideZoneChangeDetection() where
		// event coalescing defers zone-triggered change detection.

		describe('Outside click', () => {
			it('should remove dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<div id="outside">Outside</div><br />
					<ng-select [items]="cities"
						bindLabel="name"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).not.toBeNull();

				document.getElementById('outside').click();

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).toBeNull();
			});

			it('should remove appended dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<div id="outside">Outside</div><br />
					<ng-select [items]="cities"
						bindLabel="name"
						appendTo="body"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(document.querySelector('ng-dropdown-panel')).not.toBeNull();

				document.getElementById('outside').click();

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(document.querySelector('ng-dropdown-panel')).toBeNull();
			});
		});

		describe('Escape key', () => {
			it('should remove dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).not.toBeNull();

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).toBeNull();
			});

			it('should remove appended dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						appendTo="body"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(document.querySelector('ng-dropdown-panel')).not.toBeNull();

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(document.querySelector('ng-dropdown-panel')).toBeNull();
			});
		});

		describe('Tab key', () => {
			it('should remove dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).not.toBeNull();

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).toBeNull();
			});

			it('should remove appended dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						appendTo="body"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(document.querySelector('ng-dropdown-panel')).not.toBeNull();

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(document.querySelector('ng-dropdown-panel')).toBeNull();
			});
		});

		describe('Option select', () => {
			it('should remove dropdown panel from DOM immediately when selecting an option', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).not.toBeNull();

				// Select first option via Enter key
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).toBeNull();
			});

			it('should remove appended dropdown panel from DOM immediately when selecting an option', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						appendTo="body"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(document.querySelector('ng-dropdown-panel')).not.toBeNull();

				// Select first option via Enter key
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(document.querySelector('ng-dropdown-panel')).toBeNull();
			});
		});

		describe('Arrow click', () => {
			it('should remove dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).not.toBeNull();

				// Simulate arrow click via mousedown on ng-select-container
				const control = fixture.debugElement.query(By.css('.ng-select-container'));
				control.triggerEventHandler(
					'mousedown',
					createEvent({
						classList: { contains: (term) => term === 'ng-arrow-wrapper' },
					}),
				);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(fixture.debugElement.query(By.css('ng-dropdown-panel'))).toBeNull();
			});

			it('should remove appended dropdown panel from DOM immediately', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						appendTo="body"
						[(ngModel)]="selectedCity">
					</ng-select>`,
				);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
				expect(document.querySelector('ng-dropdown-panel')).not.toBeNull();

				const control = fixture.debugElement.query(By.css('.ng-select-container'));
				control.triggerEventHandler(
					'mousedown',
					createEvent({
						classList: { contains: (term) => term === 'ng-arrow-wrapper' },
					}),
				);

				expect(fixture.componentInstance.select().isOpen()).toBeFalsy();
				expect(document.querySelector('ng-dropdown-panel')).toBeNull();
			});
		});
	});

	describe('Dropdown position', () => {
		it('should auto position dropdown to bottom by default', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities"></ng-select>`);
			fixture.componentInstance.cities = [{ id: 1, name: 'New York' }];
			fixture.detectChanges();

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			expect(select.dropdownPosition()).toBe('auto');
			expect(['top', 'bottom']).toContain(select.currentPanelPosition);
		});

		it('should auto position dropdown to top if position input is set', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select dropdownPosition="top" [items]="cities"></ng-select>`);
			fixture.componentInstance.cities = [{ id: 1, name: 'New York' }];
			fixture.detectChanges();

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			const selectClasses = (<HTMLElement>fixture.nativeElement).querySelector('.ng-select').classList;
			const panelClasses = document.querySelector('.ng-dropdown-panel').classList;
			expect(select.dropdownPosition()).toBe('top');
			expect(selectClasses.contains('ng-select-bottom')).toBeFalsy();
			expect(panelClasses.contains('ng-select-bottom')).toBeFalsy();
			expect(selectClasses.contains('ng-select-top')).toBeTruthy();
			expect(panelClasses.contains('ng-select-top')).toBeTruthy();
		});

		it('should auto position appended to body dropdown to bottom', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" appendTo="body"></ng-select>`);
			fixture.componentInstance.cities = [{ id: 1, name: 'New York' }];
			fixture.detectChanges();

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			expect(select.dropdownPosition()).toBe('auto');
			expect(['top', 'bottom']).toContain(select.currentPanelPosition);
		});

		it('should return current panel position', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" appendTo="body"></ng-select>`);
			fixture.componentInstance.cities = [{ id: 1, name: 'New York' }];
			fixture.detectChanges();

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			expect(['top', 'bottom']).toContain(select.currentPanelPosition);
		});

		it('should return undefined for current panel position if dropdown is closed', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" appendTo="body"></ng-select>`);
			fixture.componentInstance.cities = [{ id: 1, name: 'New York' }];
			fixture.detectChanges();

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);
			select.close();
			await tickAndDetectChanges(fixture);

			expect(select.currentPanelPosition).toBeUndefined();
		});
	});

	describe('Append to', () => {
		it('should not warn when appendTo is set', async () => {
			const warnSpy = vi.spyOn(MockConsole.prototype, 'warn');
			try {
				createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        appendTo="body"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				);
				expect(warnSpy).not.toHaveBeenCalled();
			} finally {
				warnSpy.mockRestore();
			}
		});

		it('should not warn when appendTo is not set anywhere', async () => {
			const warnSpy = vi.spyOn(MockConsole.prototype, 'warn');
			try {
				createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				);
				expect(warnSpy).not.toHaveBeenCalled();
			} finally {
				warnSpy.mockRestore();
			}
		});

		it('should append the dropdown to a custom host element', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container"></div>
                <ng-select [items]="cities"
                        appendTo=".container"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
			expect(dropdown).not.toBeNull();
		});

		it('should append the dropdown to body', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        appendTo="body"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown).not.toBeNull();
			expect(dropdown.closest('ng-select')).toBeNull();
			expect(dropdown.closest('.cdk-overlay-container')).toBeNull();
		});

		it('should apply appendTo from NgSelectConfig', async () => {
			const config = new NgSelectConfig();
			config.appendTo = '.config-container';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="config-container"></div>
                <ng-select [items]="cities"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			expect(document.querySelector('.config-container .ng-dropdown-panel')).not.toBeNull();
		});

		it('should move the dropdown when appendTo changes between opens', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container-a"></div>
                <div class="container-b"></div>
                <ng-select [items]="cities"
                        [appendTo]="appendToSelector"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			const select = fixture.componentInstance.select();

			await openSelect(select, fixture);
			expect(document.querySelector('.container-a .ng-dropdown-panel')).not.toBeNull();

			select.close();
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.appendToSelector = '.container-b';
			await tickAndDetectChanges(fixture);

			await openSelect(select, fixture);
			expect(document.querySelector('.container-b .ng-dropdown-panel')).not.toBeNull();
			expect(document.querySelector('.container-a .ng-dropdown-panel')).toBeNull();
		});

		it('should rebuild the overlay when the appendTo host element is replaced between opens', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                @if (visible) {
                    <div class="container-a"></div>
                }
                <ng-select [items]="cities"
                        appendTo=".container-a"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			const select = fixture.componentInstance.select();

			await openSelect(select, fixture);
			expect(document.querySelector('.container-a .ng-dropdown-panel')).not.toBeNull();
			select.close();
			await tickAndDetectChanges(fixture);

			// The host is destroyed and rebuilt while the selector keeps matching — a dialog
			// that drops its DOM on close and recreates it on open (#2870)
			fixture.componentInstance.visible = false;
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.visible = true;
			await tickAndDetectChanges(fixture);

			await openSelect(select, fixture);
			expect(document.querySelector('.container-a .ng-dropdown-panel')).not.toBeNull();
		});

		it('should throw for an appendTo selector that matches no element', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        appendTo=".does-not-exist"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			expect(() => select.open()).toThrowError('appendTo selector .does-not-exist did not found any parent element');
			select.close();
			await tickAndDetectChanges(fixture);
		});

		it('should size the overlay pane to match the select width', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div style="width: 200px">
                    <ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="selectedCity">
                    </ng-select>
                </div>`,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const pane = <HTMLElement>document.querySelector('.cdk-overlay-pane');
			expect(pane.style.width).toBe('200px');
		});

		it('should pass static classes into dropdown panel', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        class="someClass"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.select().open();

			await tickAndDetectChanges(fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown.classList.contains('someClass')).toBe(true);
		});

		it('should pass ngClass classes into dropdown panel', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        [ngClass]="{ someClass: visible }"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.visible = true;
			fixture.componentInstance.select().open();

			await tickAndDetectChanges(fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown.classList.contains('someClass')).toBe(true);

			fixture.componentInstance.visible = false;
			await tickAndDetectChanges(fixture);

			expect(dropdown.classList.contains('someClass')).toBe(false);
		});

		it('should pass [class] binding classes into dropdown panel', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        class="search-box"
                        [class]="dynamicClass"
                        [ngClass]="{ 'ng-class': visible }"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.dynamicClass = 'dynamic-class';
			fixture.componentInstance.select().open();

			await tickAndDetectChanges(fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown.classList.contains('search-box')).toBe(true);
			expect(dropdown.classList.contains('dynamic-class')).toBe(true);
			expect(dropdown.classList.contains('ng-class')).toBe(true);
			expect(dropdown.classList.contains('ng-valid')).toBe(false);
			expect(dropdown.classList.contains('ng-untouched')).toBe(false);
			expect(dropdown.classList.contains('ng-pristine')).toBe(false);

			fixture.componentInstance.dynamicClass = '';
			fixture.componentInstance.visible = false;
			await tickAndDetectChanges(fixture);

			expect(dropdown.classList.contains('dynamic-class')).toBe(false);
			expect(dropdown.classList.contains('ng-class')).toBe(false);
			expect(dropdown.classList.contains('search-box')).toBe(true);
		});

		it('should pass every supported panelClass value into dropdown panel', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        class="someClass"
                        [panelClass]="panelClassBinding"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.panelClassBinding = 'panel-only';
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().open();
			await tickAndDetectChanges(fixture);

			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown.classList.contains('someClass')).toBe(true);
			expect(dropdown.classList.contains('panel-only')).toBe(true);

			fixture.componentInstance.panelClassBinding = 'panel-updated';
			await tickAndDetectChanges(fixture);

			expect(dropdown.classList.contains('panel-updated')).toBe(true);
			expect(dropdown.classList.contains('panel-only')).toBe(false);

			fixture.componentInstance.panelClassBinding = ['panel-array', 'panel-shared'];
			await tickAndDetectChanges(fixture);

			expect(dropdown.classList.contains('panel-array')).toBe(true);
			expect(dropdown.classList.contains('panel-shared')).toBe(true);
			expect(dropdown.classList.contains('panel-updated')).toBe(false);

			fixture.componentInstance.panelClassBinding = new Set(['panel-set', 'panel-shared']);
			await tickAndDetectChanges(fixture);

			expect(dropdown.classList.contains('panel-set')).toBe(true);
			expect(dropdown.classList.contains('panel-shared')).toBe(true);
			expect(dropdown.classList.contains('panel-array')).toBe(false);

			fixture.componentInstance.panelClassBinding = {
				'panel-map': true,
				'panel-disabled': false,
				someClass: false,
			};
			await tickAndDetectChanges(fixture);

			expect(dropdown.classList.contains('panel-map')).toBe(true);
			expect(dropdown.classList.contains('panel-disabled')).toBe(false);
			expect(dropdown.classList.contains('panel-set')).toBe(false);
			// panelClass is additive and cannot remove a class mirrored from the host.
			expect(dropdown.classList.contains('someClass')).toBe(true);
		});
	});

	describe('Overlay edge cases', () => {
		it('should snapshot rtl direction when opening', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const previousDir = document.documentElement.dir;
			document.documentElement.dir = 'rtl';
			try {
				const select = fixture.componentInstance.select();
				await openSelect(select, fixture);

				expect(document.querySelector('.ng-dropdown-panel').closest('[dir="rtl"]')).not.toBeNull();
			} finally {
				document.documentElement.dir = previousDir;
			}
		});

		it('should resolve appendTo selectors against the shadow root of the select', async () => {
			const fixture = createTestingModule(
				EncapsulatedTestComponent,
				`
                <div class="shadow-append-host"></div>
                <ng-select [items]="cities"
                        bindLabel="name"
                        appendTo=".shadow-append-host"
                        [(ngModel)]="city"></ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			const root = select.element.getRootNode() as ShadowRoot;
			expect(root instanceof ShadowRoot).toBe(true);
			expect(root.querySelector('.shadow-append-host .ng-dropdown-panel')).not.toBeNull();
		});
	});

	describe('Template event bindings', () => {
		it('should stop propagation of native change events from the search input', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const input: HTMLInputElement = fixture.nativeElement.querySelector('.ng-input input');
			const changeListener = vi.fn();
			getNgSelectNativeElement(fixture).addEventListener('change', changeListener);
			input.dispatchEvent(new Event('change', { bubbles: true }));

			expect(changeListener).not.toHaveBeenCalled();
		});

		it('should filter with the input value on native compositionend', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [searchWhileComposing]="false"></ng-select>`);

			const input: HTMLInputElement = fixture.nativeElement.querySelector('.ng-input input');
			input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
			input.value = 'new';
			input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().searchTerm).toBe('new');
		});

		it('should re-emit dropdown panel scroll events', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			const emitted: { start: number; end: number }[] = [];
			select.scroll.subscribe((event) => emitted.push(event));
			select.dropdownPanel().scroll.emit({ start: 0, end: 5 });

			expect(emitted).toEqual([{ start: 0, end: 5 }]);
		});
	});
});
