import { EventPhase } from '@angular/core/primitives/event-dispatch';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNgSelectElement, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { MockConsole } from '../../testing/mocks';
import { NgSelectConfig } from '../services/config.service';
import { KeyCode } from '../types/ng-select.types';
import { NgSelectComponent } from './ng-select.component';

import { createEvent, createTestingModule, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
	describe('Output events', () => {
		it('should fire open event once', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (open)="onOpen()"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onOpen').mockReturnValue(undefined);

			fixture.componentInstance.select().open();
			fixture.componentInstance.select().open();
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.onOpen).toHaveBeenCalledTimes(1);
		});

		it('should fire search event', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (search)="onSearch($event)"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onSearch').mockReturnValue(undefined);

			fixture.componentInstance.select().filter('term');
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.onSearch).toHaveBeenCalledTimes(1);
			expect(fixture.componentInstance.onSearch).toHaveBeenCalledWith({ term: 'term', items: [] });
		});

		it('should fire close event once', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (close)="onClose()"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onClose').mockReturnValue(undefined);

			fixture.componentInstance.select().open();
			fixture.componentInstance.select().close();
			fixture.componentInstance.select().close();
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.onClose).toHaveBeenCalledTimes(1);
		});

		it('should fire change when changed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindValue="id"
                            bindLabel="name"
                            (change)="onChange($event)"
                            [(ngModel)]="selectedCityId">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onChange').mockReturnValue(undefined);

			fixture.componentInstance.selectedCityId = fixture.componentInstance.cities[1].id;
			await tickAndDetectChanges(fixture);

			const select = fixture.componentInstance.select();
			select.select(select.itemsList.items[0]);
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.onChange).toHaveBeenCalledWith(select.selectedItems[0].value);
			expect(fixture.componentInstance.selectedCityId).toBe(fixture.componentInstance.cities[0].id);
		});

		it('should not fire change when item not changed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (change)="onChange()"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onChange').mockReturnValue(undefined);

			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);

			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);

			expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
		});

		it('should fire addEvent when item is added', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (add)="onAdd($event)"
                            [multiple]="true"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onAdd').mockReturnValue(undefined);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().select(fixture.componentInstance.select().itemsList.items[0]);

			expect(fixture.componentInstance.onAdd).toHaveBeenCalledWith(fixture.componentInstance.cities[0]);
		});

		it('should not fire addEvent for single select', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (add)="onAdd($event)"
                            [multiple]="false"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onAdd').mockReturnValue(undefined);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().select(fixture.componentInstance.select().itemsList.items[0]);
			expect(fixture.componentInstance.onAdd).not.toHaveBeenCalled();
		});

		it('should fire remove when item is removed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (remove)="onRemove($event)"
                            [multiple]="true"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onRemove').mockReturnValue(undefined);

			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.select().unselect(fixture.componentInstance.cities[0]);

			expect(fixture.componentInstance.onRemove).toHaveBeenCalledWith(fixture.componentInstance.cities[0].value);
		});

		it('should fire clear when model is cleared using clear icon', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            (clear)="onClear($event)"
                            [multiple]="true"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			vi.spyOn(fixture.componentInstance, 'onClear').mockReturnValue(undefined);

			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().handleClearClick();
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.onClear).toHaveBeenCalled();
		});
	});

	describe('Auto-focus', () => {
		it('should focus dropdown', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            autofocus
                            bindLabel="name"
                            [multiple]="true"
                            [(ngModel)]="selectedCities">
                </ng-select>`,
			);
			const select = fixture.componentInstance.select();
			const focus = vi.spyOn(select, 'focus').mockReturnValue(undefined);
			select.ngAfterViewInit();
			expect(focus).toHaveBeenCalled();
		});
	});

	describe('Mousedown', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;
		let triggerMousedown = null;

		describe('dropdown click', () => {
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            bindLabel="name"
                            [multiple]="true"
							[preventToggleOnRightClick]="preventToggleOnRightClick"
                            [(ngModel)]="selectedCities">
                    </ng-select>`,
				);
				select = fixture.componentInstance.select();

				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);
				triggerMousedown = () => {
					const control = fixture.debugElement.query(By.css('.ng-select-container'));
					control.triggerEventHandler('mousedown', createEvent({ className: 'ng-control' }));
				};
			});

			it('should focus dropdown', async () => {
				const focus = vi.spyOn(select, 'focus').mockReturnValue(undefined);
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(focus).toHaveBeenCalled();
			});

			it('shouldnt focus dropdown, because prevent flag is true for right mouse click', async () => {
				fixture.componentInstance.preventToggleOnRightClick = true;
				const event = createEvent({ tagName: 'INPUT' }) as any;
				const preventDefault = vi.spyOn(event, 'preventDefault').mockReturnValue(undefined);
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('input click', () => {
			let event: Event;
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            bindLabel="name"
                            [multiple]="true"
                            [(ngModel)]="selectedCities">
                    </ng-select>`,
				);
				select = fixture.componentInstance.select();

				event = createEvent({ tagName: 'INPUT' }) as any;
				triggerMousedown = () => {
					const control = fixture.debugElement.query(By.css('.ng-select-container'));
					control.triggerEventHandler('mousedown', event);
				};
			});

			it('should not prevent default', async () => {
				const preventDefault = vi.spyOn(event, 'preventDefault').mockReturnValue(undefined);
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('selected value text selection when not searchable (#2669)', () => {
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            bindLabel="name"
                            [searchable]="false"
                            [(ngModel)]="selectedCity">
                    </ng-select>`,
				);
				select = fixture.componentInstance.select();
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
			});

			it('should not preventDefault on mousedown of selected value label', async () => {
				const label = fixture.debugElement.query(By.css('.ng-value-label')).nativeElement as HTMLElement;
				const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 });
				label.dispatchEvent(event);
				await tickAndDetectChanges(fixture);
				expect(event.defaultPrevented).toBe(false);
			});

			it('should not toggle dropdown when mousedown is on selected value label', async () => {
				expect(select.isOpen()).toBe(false);
				const label = fixture.debugElement.query(By.css('.ng-value-label')).nativeElement as HTMLElement;
				label.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }));
				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBe(false);
			});

			it('should still toggle dropdown when mousedown is on arrow', async () => {
				const arrow = fixture.debugElement.query(By.css('.ng-arrow-wrapper')).nativeElement as HTMLElement;
				arrow.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }));
				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBe(true);
			});

			it('should ignore pointer events on .ng-input when not searchable', async () => {
				const ngInput = fixture.debugElement.query(By.css('.ng-input')).nativeElement as HTMLElement;
				expect(getComputedStyle(ngInput).pointerEvents).toBe('none');
			});
		});

		describe('event replay', () => {
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="selectedCity">
                    </ng-select>`,
				);
				select = fixture.componentInstance.select();
				await tickAndDetectChanges(fixture);
			});

			it('should not call preventDefault during Angular event replay', async () => {
				const event = {
					...createEvent({ tagName: 'DIV', className: 'ng-control' }),
					eventPhase: EventPhase.REPLAY,
				} as any;
				const preventDefault = vi.spyOn(event, 'preventDefault').mockImplementation(() => {
					throw new Error('`preventDefault` called during event replay.');
				});

				const control = fixture.debugElement.query(By.css('.ng-select-container'));
				expect(() => control.triggerEventHandler('mousedown', event)).not.toThrow();
				await tickAndDetectChanges(fixture);

				expect(preventDefault).not.toHaveBeenCalled();
				expect(select.isOpen()).toBe(true);
			});

			it('should call preventDefault for normal (non-replay) mousedown', async () => {
				const event = createEvent({ tagName: 'DIV', className: 'ng-control' }) as any;
				const preventDefault = vi.spyOn(event, 'preventDefault').mockReturnValue(undefined);

				const control = fixture.debugElement.query(By.css('.ng-select-container'));
				control.triggerEventHandler('mousedown', event);
				await tickAndDetectChanges(fixture);

				expect(preventDefault).toHaveBeenCalled();
				expect(select.isOpen()).toBe(true);
			});
		});

		describe('clear icon click', () => {
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            (change)="onChange($event)"
                            bindLabel="name"
                            [multiple]="true"
                            [disabled]="disabled"
                            [clearKeepsDisabledOptions]="clearKeepsDisabledOptions"
                            [readonly]="readonly"
                            [(ngModel)]="selectedCities">
                    </ng-select>`,
				);

				vi.spyOn(fixture.componentInstance, 'onChange').mockReturnValue(undefined);
				const disabled = { ...fixture.componentInstance.cities[1], disabled: true };
				fixture.componentInstance.selectedCities = <any>[fixture.componentInstance.cities[0], disabled];
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.cities[1].disabled = true;
				fixture.componentInstance.cities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				triggerMousedown = () => {
					const clearButton = fixture.debugElement.query(By.css('.ng-clear-wrapper'));
					clearButton.triggerEventHandler('click', createEvent({}));
				};
			});

			it('should clear model except disabled when clearKeepsDisabledOptions is enabled', async () => {
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.selectedCities.length).toBe(1);
				expect(fixture.componentInstance.selectedCities[0]).toEqual(
					expect.objectContaining({
						id: 2,
						name: 'London',
					}),
				);
				expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
			});

			it('should clear model including disabled when clearKeepsDisabledOptions is disabled', async () => {
				fixture.componentInstance.clearKeepsDisabledOptions = false;
				await tickAndDetectChanges(fixture);
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.selectedCities.length).toBe(0);
				expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
			});

			it('should clear only search text', async () => {
				const select = fixture.componentInstance.select();
				fixture.componentInstance.selectedCities = null;
				await tickAndDetectChanges(fixture);
				select.filter('Hey! Whats up!?');
				await tickAndDetectChanges(fixture);
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(0);
				expect(select.searchTerm).toBe(null);
			});

			it('should not open dropdown', async () => {
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBe(false);
			});

			it('should respond to click events for accessibility compliance', async () => {
				// Test that mousedown alone doesn't trigger clear
				const clearButton = fixture.debugElement.query(By.css('.ng-clear-wrapper'));
				clearButton.triggerEventHandler('mousedown', createEvent({}));
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.selectedCities.length).toBe(2); // Should not have cleared

				// Test that click does trigger clear
				clearButton.triggerEventHandler('click', createEvent({}));
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.selectedCities.length).toBe(1); // Should have cleared
			});

			it('clear button should not appear if select is disabled', async () => {
				fixture.componentInstance.disabled = true;
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);
				const el = fixture.debugElement.query(By.css('.ng-clear-wrapper'));
				expect(el).toBeNull();
			});

			it('clear button should not appear if select is readonly', async () => {
				fixture.componentInstance.readonly = true;
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);
				const el = fixture.debugElement.query(By.css('.ng-clear-wrapper'));
				expect(el).toBeNull();
			});
		});

		describe('value clear icon click', () => {
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            bindLabel="name"
                            [multiple]="true"
                            [(ngModel)]="selectedCities">
                    </ng-select>`,
				);
				select = fixture.componentInstance.select();

				fixture.componentInstance.selectedCities = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);
				triggerMousedown = () => {
					const control = fixture.debugElement.query(By.css('.ng-select-container'));
					control.triggerEventHandler(
						'mousedown',
						createEvent({
							classList: { contains: (term) => term === 'ng-value-icon' },
						}),
					);
				};
			});

			it('should not open dropdown', async () => {
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBe(false);
			});

			it('should focus dropdown while unselecting', async () => {
				const focus = vi.spyOn(select, 'focus').mockReturnValue(undefined);
				select.unselect(fixture.componentInstance.cities[0]);
				await tickAndDetectChanges(fixture);
				expect(focus).toHaveBeenCalled();
			});
		});

		describe('arrow icon click', () => {
			beforeEach(async () => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				triggerMousedown = () => {
					const control = fixture.debugElement.query(By.css('.ng-select-container'));
					control.triggerEventHandler(
						'mousedown',
						createEvent({
							classList: { contains: (term) => term === 'ng-arrow-wrapper' },
						}),
					);
				};
			});

			it('should toggle dropdown', async () => {
				// open
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBe(true);

				// close
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBe(false);

				// open
				triggerMousedown();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBe(true);
			});
		});
	});

	describe('Input guards and fallbacks', () => {
		it('should throw when compareWith input is not a function', () => {
			const fixture = TestBed.createComponent(NgSelectComponent);
			expect(() => fixture.componentRef.setInput('compareWith', 'not a function')).toThrowError('`compareWith` must be a function.');
		});

		it('should fall back to the default selection model when no factory is provided', () => {
			const fixture = TestBed.createComponent(NgSelectComponent);
			fixture.componentRef.setInput('bindLabel', 'label');
			fixture.detectChanges();
			const itemsList = fixture.componentInstance.itemsList;
			itemsList.setItems([{ label: 'Fallback item' }]);
			const item = itemsList.items[0];

			itemsList.select(item);

			expect(itemsList.selectedItems).toEqual([item]);
		});

		it('should use deselectOnClick from NgSelectConfig when input is not provided', () => {
			const config = new NgSelectConfig();
			config.deselectOnClick = true;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`,
				config,
			);

			expect(fixture.componentInstance.select().deselectOnClickValue()).toBe(true);
		});

		it('should expose focus state through the focused getter and ignore repeated input focus', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			expect(select.focused).toBeFalsy();

			const focusEmit = vi.spyOn(select.focusEvent, 'emit');
			select.onInputFocus(new FocusEvent('focus'));
			expect(select.focused).toBe(true);
			select.onInputFocus(new FocusEvent('focus'));
			expect(focusEmit).toHaveBeenCalledTimes(1);
		});

		it('should measure zero outline notch width when no placeholder label is rendered', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select appearance="outline" [fixedPlaceholder]="false" [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			expect(fixture.nativeElement.querySelector('.ng-placeholder')).toBeNull();
			expect(fixture.componentInstance.select().outlineNotchWidth()).toBe(0);
		});

		it('should use fixedPlaceholder from NgSelectConfig when not provided in template', async () => {
			const config = new NgSelectConfig();
			config.fixedPlaceholder = false;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" placeholder="Select City" [(ngModel)]="selectedCity"></ng-select>`,
				config,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().fixedPlaceholder()).toBe(false);
			expect(fixture.nativeElement.querySelector('.ng-placeholder')).toBeNull();
		});

		it('should override fixedPlaceholder from NgSelectConfig when provided in template', async () => {
			const config = new NgSelectConfig();
			config.fixedPlaceholder = false;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [fixedPlaceholder]="true" [items]="cities" bindLabel="name" placeholder="Select City" [(ngModel)]="selectedCity"></ng-select>`,
				config,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			expect(fixture.nativeElement.querySelector('.ng-placeholder')).not.toBeNull();
		});

		it('should keep placeholder visible via config.fixedPlaceholder when input is null', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [fixedPlaceholder]="null" placeholder="Pick one" [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			expect(fixture.nativeElement.querySelector('.ng-placeholder')).not.toBeNull();
		});

		it('should regroup items when groupBy signal changes after init', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			select.groupBy.set('name');
			await tickAndDetectChanges(fixture);

			expect(select.itemsList.items.length).toBe(10);
		});

		it('should clear items when items signal is set to null', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			select.items.set(null);
			await tickAndDetectChanges(fixture);

			expect(select.itemsList.items.length).toBe(0);
		});

		it('should warn when writing an object model with bindValue and no compareWith', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindValue="id" bindLabel="name"></ng-select>`);

			const warnSpy = vi.spyOn(MockConsole.prototype, 'warn');
			try {
				fixture.componentInstance.select().writeValue({ id: 1, name: 'New York' });
				expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('as your model with bindValue is not allowed'));
			} finally {
				warnSpy.mockRestore();
			}
		});

		it('should not call change detection on a destroyed view', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			fixture.destroy();

			expect(() => select.detectChanges()).not.toThrow();
		});
	});
});
