import { SIGNAL } from '@angular/core/primitives/signals';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNgSelectElement, selectOption, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { advanceDebounce, disableDebounceFakeTimers, enableDebounceFakeTimers, openSelect } from '../../testing/timer-helpers';
import { NgSelectConfig } from '../services/config.service';
import { KeyCode, NgOption } from '../types/ng-select.types';
import { NgSelectComponent } from './ng-select.component';

import { createEvent, createTestingModule, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
	describe('Keyboard events', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;

		beforeEach(() => {
			enableDebounceFakeTimers();
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
					bindLabel="name"
					[loading]="citiesLoading"
					[selectOnTab]="selectOnTab"
					[openOnEnter]="openOnEnter"
					[multiple]="multiple"
					[clearOnBackspace]="clearOnBackspace"
					[clearable]="clearable"
					[markFirst]="markFirst"
					[searchable]="searchable"
					[(ngModel)]="selectedCity">
				</ng-select>`,
			);
			select = fixture.componentInstance.select();
		});

		afterEach(() => {
			disableDebounceFakeTimers();
		});

		describe('space', () => {
			it('should open dropdown', () => {
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.isOpen()).toBe(true);
			});

			it('should not open dropdown when isOpen is false', () => {
				const open = vi.spyOn(select, 'open').mockReturnValue(undefined);
				select.ngOnChanges(<any>{ isOpen: { currentValue: false } });
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.isOpen()).toBeFalsy();
				expect(open).not.toHaveBeenCalled();
			});

			it('should open and close dropdown normally when isOpen is undefined', () => {
				select.ngOnChanges(<any>{ isOpen: { currentValue: undefined } });
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.isOpen()).toBe(true);
				select.close();
				expect(select.isOpen()).toBe(false);
			});

			it('should open empty dropdown if no items', async () => {
				fixture.componentInstance.cities = [];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				const text = fixture.debugElement.query(By.css('.ng-option')).nativeElement.innerHTML;
				expect(text).toContain('No items found');
			});

			it('should open dropdown with loading message', async () => {
				fixture.componentInstance.cities = [];
				fixture.componentInstance.citiesLoading = true;
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				const options = fixture.debugElement.queryAll(By.css('.ng-option'));
				expect(options.length).toBe(1);
				expect(options[0].nativeElement.innerHTML).toContain('Loading...');
			});

			it('should open dropdown and mark first item', () => {
				const result = { value: fixture.componentInstance.cities[0] };
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.itemsList.markedItem).toEqual(expect.objectContaining(result));
			});

			it('should open dropdown and mark first not disabled item', async () => {
				fixture.componentInstance.cities[0].disabled = true;
				fixture.componentInstance.cities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				const result = { value: fixture.componentInstance.cities[1] };
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.itemsList.markedItem).toEqual(expect.objectContaining(result));
			});

			it('should open dropdown without marking first item', async () => {
				fixture.componentInstance.markFirst = false;
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.itemsList.markedItem).toEqual(undefined);
			});
		});

		describe('arrows', () => {
			it('should select next value on arrow down', async () => {
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[1],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});

			it('should stop marked loop if all items disabled', async () => {
				fixture.componentInstance.cities[0].disabled = true;
				fixture.componentInstance.cities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				select.filter('new york');
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
				expect(select.itemsList.markedItem).toBeUndefined();
			});

			it('should select first value on arrow down when current value is last', async () => {
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[4];
				await tickAndDetectChanges(fixture);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await tickAndDetectChanges(fixture);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[0],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});

			it('should skip disabled option and select next one', async () => {
				const city: any = fixture.componentInstance.cities[0];
				city.disabled = true;
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await tickAndDetectChanges(fixture);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[1],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});

			it('should select previous value on arrow up', async () => {
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
				await tickAndDetectChanges(fixture);
				await selectOption(fixture, KeyCode.ArrowUp, 1);
				await tickAndDetectChanges(fixture);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[0],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});

			it('should select last value on arrow up', async () => {
				await selectOption(fixture, KeyCode.ArrowUp, 1);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[4],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});
		});

		describe('esc', () => {
			it('should close opened dropdown', () => {
				select.isOpen.set(true);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
				expect(select.isOpen()).toBe(false);
			});

			it('should call preventDefault when Escape closes the dropdown', () => {
				select.isOpen.set(true);
				const preventDefault = vi.fn();
				getNgSelectElement(fixture).triggerEventHandler('keydown', {
					key: KeyCode.Esc,
					preventDefault,
				});
				expect(select.isOpen()).toBe(false);
				expect(preventDefault).toHaveBeenCalled();
			});

			it('should not call preventDefault when Escape has no effect', () => {
				expect(select.isOpen()).toBe(false);
				const preventDefault = vi.fn();
				getNgSelectElement(fixture).triggerEventHandler('keydown', {
					key: KeyCode.Esc,
					preventDefault,
				});
				expect(preventDefault).not.toHaveBeenCalled();
			});

			it('should not call preventDefault when isOpen is controlled externally', () => {
				select.ngOnChanges(<any>{ isOpen: { currentValue: true } });
				select.isOpen.set(true);
				const preventDefault = vi.fn();
				getNgSelectElement(fixture).triggerEventHandler('keydown', {
					key: KeyCode.Esc,
					preventDefault,
				});
				expect(select.isOpen()).toBe(true);
				expect(preventDefault).not.toHaveBeenCalled();
			});
		});

		describe('backspace', () => {
			it('should remove selected value', async () => {
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				expect(select.selectedItems).toEqual([]);
			});

			it('should not remove selected value if filter is set', async () => {
				select.filter('a');

				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[0],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});

			it('should not remove selected value when clearable is false', async () => {
				fixture.componentInstance.clearable = false;
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[0],
					}),
				];
				expect(select.selectedItems).toEqual(result);
			});

			it('should do nothing when there is no selection', async () => {
				const clear = vi.spyOn(select, 'clearModel').mockReturnValue(undefined);
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				expect(clear).not.toHaveBeenCalled();
			});

			it('should remove last selected value when multiple', async () => {
				const remove = vi.spyOn(select.removeEvent, 'emit').mockReturnValue(undefined);
				const removedItem = fixture.componentInstance.cities[2];
				fixture.componentInstance.multiple = true;
				fixture.componentInstance.cities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[1],
					}),
				];
				expect(select.selectedItems).toEqual(result);
				expect(remove).toHaveBeenCalledWith(removedItem);
			});

			it('should not remove last selected if it is disabled', async () => {
				const remove = vi.spyOn(select.removeEvent, 'emit').mockReturnValue(undefined);
				fixture.componentInstance.multiple = true;
				const disabled = { ...fixture.componentInstance.cities[1], disabled: true };
				fixture.componentInstance.selectedCity = <any>[fixture.componentInstance.cities[0], disabled];
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.cities[1].disabled = true;
				fixture.componentInstance.cities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				const result = [
					expect.objectContaining({
						value: fixture.componentInstance.cities[1],
					}),
				];
				expect(select.selectedItems).toEqual(result);
				expect(remove).toHaveBeenCalled();
			});

			it('should not remove selected value when clearOnBackspace false', async () => {
				fixture.componentInstance.multiple = true;
				fixture.componentInstance.clearOnBackspace = false;
				fixture.componentInstance.cities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				expect(select.selectedItems.length).toEqual(2);
			});
		});

		describe('key presses', () => {
			beforeEach(async () => {
				fixture.componentInstance.searchable = false;
				await tickAndDetectChanges(fixture);
				select.ngOnInit();
			});

			it('should select item using key while not opened', async () => {
				triggerKeyDownEvent(getNgSelectElement(fixture), 'p');
				await advanceDebounce(fixture, 200);

				expect(fixture.componentInstance.selectedCity?.name).toBe('Paris');
			});

			it('should mark item using key while opened', async () => {
				const findByLabel = vi.spyOn(select.itemsList, 'findByLabel').mockReturnValue(undefined);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				triggerKeyDownEvent(getNgSelectElement(fixture), 'n');
				triggerKeyDownEvent(getNgSelectElement(fixture), 'e');
				triggerKeyDownEvent(getNgSelectElement(fixture), 'w');
				await tickAndDetectChanges(fixture);
				await advanceDebounce(fixture, 200);

				expect(fixture.componentInstance.selectedCity).toBeUndefined();
				expect(select.itemsList.markedItem.label).toBe('New York');
				expect(findByLabel).toHaveBeenCalledWith('new');
			});
		});

		describe('enter', () => {
			beforeEach(async () => {
				fixture.componentInstance.searchable = false;
				await tickAndDetectChanges(fixture);
				select.ngOnInit();
			});

			it('should open dropdown when it is closed', async () => {
				fixture.componentInstance.openOnEnter = true;
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBe(true);
			});

			it('should select option and close dropdown', () => {
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
				expect(select.selectedItems[0].value).toEqual(fixture.componentInstance.cities[0]);
				expect(select.isOpen()).toBe(false);
			});

			it('should not open dropdown if [openOnEnter]="false"', async () => {
				fixture.componentInstance.openOnEnter = false;
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
				expect(select.isOpen()).toBe(false);
			});

			it('should clear input when enter pressed while clear button focused', async () => {
				await selectOption(fixture, KeyCode.ArrowDown, 0);
				select.searchInput().nativeElement.focus();
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);

				const handleClearClick = vi.spyOn(select, 'handleClearClick').mockReturnValue(undefined);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter, select.clearButton().nativeElement);
				expect(handleClearClick).toHaveBeenCalled();
			});
		});
	});

	describe('Keyboard events (tab)', () => {
		beforeEach(() => {
			enableDebounceFakeTimers();
		});

		afterEach(() => {
			disableDebounceFakeTimers();
		});

		function genericFixture() {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
					bindLabel="name"
					[loading]="citiesLoading"
					[selectOnTab]="selectOnTab"
					[multiple]="multiple"
					[tabFocusOnClearButton]="tabFocusOnClearButton"
					[(ngModel)]="selectedCity" />
				`,
			);
			const select = fixture.componentInstance.select();
			return { fixture, select };
		}

		it('should close dropdown when there are no items', async () => {
			const { fixture, select } = genericFixture();
			select.filter('random stuff');
			await advanceDebounce(fixture, 200);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(select.isOpen()).toBeFalsy();
		});

		it('should close dropdown when [selectOnTab]="false"', async () => {
			const { fixture, select } = genericFixture();
			fixture.componentInstance.selectOnTab = false;
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(select.selectedItems).toEqual([]);
			expect(select.isOpen()).toBeFalsy();
		});

		it('should close dropdown and keep selected value', async () => {
			const { fixture, select } = genericFixture();
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			await tickAndDetectChanges(fixture);
			const result = [
				expect.objectContaining({
					value: fixture.componentInstance.cities[0],
				}),
			];
			expect(select.selectedItems).toEqual(result);
			expect(select.isOpen()).toBeFalsy();
		});

		it('should mark first item on filter when tab', async () => {
			const { fixture } = genericFixture();
			await advanceDebounce(fixture, 200);
			fixture.componentInstance.select().filter('bei');
			await advanceDebounce(fixture, 200);

			const result = expect.objectContaining({
				value: fixture.componentInstance.cities[2],
			});
			expect(fixture.componentInstance.select().itemsList.markedItem).toEqual(result);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(fixture.componentInstance.select().selectedItems).toEqual([result]);
		});

		it('should select marked item on blur when [selectOnTab]="true"', async () => {
			// #2425 — focus can leave the open control without a Tab keydown (click-away, AT navigation);
			// the marked item should still be committed so forms using updateOn: 'blur' pick up the value.
			const { fixture, select } = genericFixture();
			await advanceDebounce(fixture, 200);
			select.filter('bei');
			await advanceDebounce(fixture, 200);

			const result = expect.objectContaining({ value: fixture.componentInstance.cities[2] });
			expect(select.isOpen()).toBeTruthy();
			expect(select.itemsList.markedItem).toEqual(result);

			select.searchInput().nativeElement.dispatchEvent(new FocusEvent('blur'));
			await tickAndDetectChanges(fixture);

			expect(select.selectedItems).toEqual([result]);
			expect(select.isOpen()).toBeFalsy();
		});

		it('should not select marked item on blur when [selectOnTab]="false"', async () => {
			const { fixture, select } = genericFixture();
			fixture.componentInstance.selectOnTab = false;
			await tickAndDetectChanges(fixture);
			await advanceDebounce(fixture, 200);
			select.filter('bei');
			await advanceDebounce(fixture, 200);

			expect(select.itemsList.markedItem).toBeTruthy();

			select.searchInput().nativeElement.dispatchEvent(new FocusEvent('blur'));
			await tickAndDetectChanges(fixture);

			expect(select.selectedItems).toEqual([]);
		});

		it('should focus on clear button when tab pressed while not opened and clear showing', async () => {
			const { fixture, select } = genericFixture();
			fixture.componentInstance.tabFocusOnClearButton = true;
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).toHaveBeenCalled();
		});

		it('should not focus on clear button when tab pressed if global flag is false and [tabFocusOnClearButton]="false"', async () => {
			const config = new NgSelectConfig();
			config.tabFocusOnClear = false;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [loading]="citiesLoading"
                        [selectOnTab]="selectOnTab"
                        [multiple]="multiple"
												[tabFocusOnClearButton]="tabFocusOnClearButton"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);
			const select = fixture.componentInstance.select();
			fixture.componentInstance.tabFocusOnClearButton = false;
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).not.toHaveBeenCalled();
		});

		it('should not focus on clear button when tab pressed if global flag is true and [tabFocusOnClearButton]="false"', async () => {
			const config = new NgSelectConfig();
			config.tabFocusOnClear = true;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [loading]="citiesLoading"
                        [selectOnTab]="selectOnTab"
                        [multiple]="multiple"
												[tabFocusOnClearButton]="tabFocusOnClearButton"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);
			const select = fixture.componentInstance.select();
			fixture.componentInstance.tabFocusOnClearButton = false;
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).not.toHaveBeenCalled();
		});

		it('should focus on clear button when tab pressed if global flag is false and [tabFocusOnClearButton]="true"', async () => {
			const config = new NgSelectConfig();
			config.tabFocusOnClear = false;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [loading]="citiesLoading"
                        [selectOnTab]="selectOnTab"
                        [multiple]="multiple"
						[tabFocusOnClearButton]="tabFocusOnClearButton"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);
			const select = fixture.componentInstance.select();
			fixture.componentInstance.tabFocusOnClearButton = true;
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).toHaveBeenCalled();
		});

		it('should focus on clear button when tab pressed if global flag is true and [tabFocusOnClearButton]="true"', async () => {
			const config = new NgSelectConfig();
			config.tabFocusOnClear = true;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [loading]="citiesLoading"
                        [selectOnTab]="selectOnTab"
                        [multiple]="multiple"
												[tabFocusOnClearButton]="tabFocusOnClearButton"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);
			const select = fixture.componentInstance.select();
			fixture.componentInstance.tabFocusOnClearButton = true;
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).toHaveBeenCalled();
		});

		it('should not focus on clear button when tab pressed if global flag is false and [tabFocusOnClearButton] is not provided', async () => {
			const config = new NgSelectConfig();
			config.tabFocusOnClear = false;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [loading]="citiesLoading"
                        [selectOnTab]="selectOnTab"
                        [multiple]="multiple"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);
			const select = fixture.componentInstance.select();
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).not.toHaveBeenCalled();
		});

		it('should focus on clear button when tab pressed if global flag is true and [tabFocusOnClearButton] is not provided', async () => {
			const config = new NgSelectConfig();
			config.tabFocusOnClear = true;
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [loading]="citiesLoading"
                        [selectOnTab]="selectOnTab"
                        [multiple]="multiple"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);
			const select = fixture.componentInstance.select();
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(select.showClear()).toBeTruthy();

			select.searchInput().nativeElement.focus();
			const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(focusOnClear).toHaveBeenCalled();
		});
	});

	describe('Interaction guards', () => {
		it('should ignore mousedown when the select is disabled', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [readonly]="true"></ng-select>`);

			const select = fixture.componentInstance.select();
			select.handleMousedown(createEvent() as any);

			expect(select.isOpen()).toBe(false);
		});

		it('should prevent toggle on right click when preventToggleOnRightClick is true', () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [preventToggleOnRightClick]="true"></ng-select>`,
			);

			const select = fixture.componentInstance.select();
			expect(select.handleMousedown({ ...createEvent(), button: 2 } as any)).toBe(false);
			expect(select.isOpen()).toBe(false);

			select.handleMousedown({ ...createEvent(), button: 0 } as any);
			expect(select.isOpen()).toBe(true);
		});

		it('should not toggle on mousedown over the clear wrapper', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			select.handleMousedown(
				createEvent({
					tagName: 'SPAN',
					classList: { contains: (token: string) => token === 'ng-clear-wrapper' },
				}) as any,
			);

			expect(select.isOpen()).toBe(false);
		});

		it('should not clear the model when clearable is false', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [clearable]="false" [(ngModel)]="selectedCity"></ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			const select = fixture.componentInstance.select();
			expect(select.selectedItems.length).toBe(1);

			select.clearModel();
			expect(select.selectedItems.length).toBe(1);
		});

		it('should ignore toggleItem for missing, disabled or read-only state', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			expect(() => select.toggleItem(null)).not.toThrow();
			expect(select.selectedItems.length).toBe(0);

			select.toggleItem({ disabled: true } as NgOption);
			expect(select.selectedItems.length).toBe(0);

			select.setDisabledState(true);
			select.toggleItem(select.itemsList.items[0]);
			expect(select.selectedItems.length).toBe(0);
		});

		it('should sync search term with selected item when toggling with editableSearchTerm', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [editableSearchTerm]="true" [(ngModel)]="selectedCity"></ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);
			select.toggleItem(select.itemsList.items[1]);
			await tickAndDetectChanges(fixture);

			expect(select.searchTerm).toBe('London');
		});

		it('should ignore unselect when no item is given', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			const removeEmit = vi.spyOn(select.removeEvent, 'emit');
			expect(() => select.unselect(null)).not.toThrow();
			expect(removeEmit).not.toHaveBeenCalled();
		});

		it('should ignore unselect when the select is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [disabled]="true" [(ngModel)]="selectedCities"></ng-select>`,
			);
			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			const select = fixture.componentInstance.select();
			const removeEmit = vi.spyOn(select.removeEvent, 'emit');
			select.unselect(select.selectedItems[0]);
			await tickAndDetectChanges(fixture);

			expect(select.selectedItems.length).toBe(2);
			expect(removeEmit).not.toHaveBeenCalled();
		});

		it('should ignore unselect when the item is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [(ngModel)]="selectedCities"></ng-select>`,
			);
			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			const select = fixture.componentInstance.select();
			select.selectedItems[0].disabled = true;
			const removeEmit = vi.spyOn(select.removeEvent, 'emit');
			select.unselect(select.selectedItems[0]);
			await tickAndDetectChanges(fixture);

			expect(select.selectedItems.length).toBe(2);
			expect(removeEmit).not.toHaveBeenCalled();
		});

		// https://github.com/ng-select/ng-select/issues/2517
		it('should ignore the remove icon click when the select is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [disabled]="true" [(ngModel)]="selectedCities"></ng-select>`,
			);
			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			fixture.debugElement.query(By.css('.ng-value-icon')).triggerEventHandler('click', {});
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems.length).toBe(2);
		});

		it('should ignore enter on the remove icon when the select is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [disabled]="true" [(ngModel)]="selectedCities"></ng-select>`,
			);
			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			fixture.debugElement
				.query(By.css('.ng-value-icon'))
				.triggerEventHandler('keydown', { key: KeyCode.Enter, preventDefault: () => {}, stopPropagation: () => {} });
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems.length).toBe(2);
		});

		it('should ignore clearItem when the select is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [disabled]="true" [(ngModel)]="selectedCities"></ng-select>`,
			);
			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			const select = fixture.componentInstance.select();
			select.clearItem(select.selectedItems[0].value);
			await tickAndDetectChanges(fixture);

			expect(select.selectedItems.length).toBe(2);
		});

		it('should not select anything when addTag function returns a falsy value', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [addTag]="tagFuncNull"></ng-select>`);

			const select = fixture.componentInstance.select();
			select.filter('zzz');
			await tickAndDetectChanges(fixture);
			select.selectTag();

			expect(select.selectedItems.length).toBe(0);
		});

		it('should not fail focusing on clear when the clear button is hidden', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			expect(() => fixture.componentInstance.select().focusOnClear()).not.toThrow();
		});

		it('should track options through trackByFn when provided', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [trackByFn]="trackByIdFn"></ng-select>`);

			const select = fixture.componentInstance.select();
			expect(select.trackByOption(0, { value: { id: 7 } } as NgOption)).toBe(7);
		});

		it('should mark hovered items but skip disabled ones', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [markFirst]="false"></ng-select>`);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			select.onItemHover(select.itemsList.items[1]);
			expect(select.itemsList.markedItem.label).toBe('London');

			select.onItemHover({ disabled: true } as NgOption);
			expect(select.itemsList.markedItem.label).toBe('London');
		});

		it('should ignore remove keydown for disabled items and unrelated keys', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [multiple]="true"></ng-select>`);

			const select = fixture.componentInstance.select();
			const unselectSpy = vi.spyOn(select, 'unselect').mockReturnValue(undefined);
			const event = { preventDefault: () => {}, stopPropagation: () => {} };

			select.handleRemoveKeydown({ ...event, key: KeyCode.Enter } as any, { disabled: true } as NgOption);
			expect(unselectSpy).not.toHaveBeenCalled();

			select.handleRemoveKeydown({ ...event, key: 'a' } as any, { disabled: false } as NgOption);
			expect(unselectSpy).not.toHaveBeenCalled();

			select.handleRemoveKeydown({ ...event, key: KeyCode.Space } as any, { disabled: false } as NgOption);
			expect(unselectSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Keyboard navigation edge cases', () => {
		it('should ignore arrow up when the dropdown is closed', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

			const select = fixture.componentInstance.select();
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowUp);

			expect(select.isOpen()).toBe(false);
			expect(select.itemsList.markedItem).toBeUndefined();
		});

		it('should clear the item marker when arrowing up to the add-tag row', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [addTag]="true"></ng-select>`);

			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);
			select.filter('new');
			await tickAndDetectChanges(fixture);
			expect(select.itemsList.markedItem.label).toBe('New York');

			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowUp);
			await tickAndDetectChanges(fixture);

			expect(select.itemsList.markedItem).toBeUndefined();
		});

		it('should mark matching item on key press while opened', async () => {
			enableDebounceFakeTimers();
			try {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [searchable]="false" [(ngModel)]="selectedCity"></ng-select>`,
				);

				const select = fixture.componentInstance.select();
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), 'p');
				await advanceDebounce(fixture, 200);

				expect(select.isOpen()).toBe(true);
				expect(select.itemsList.markedItem.label).toBe('Paris');
			} finally {
				disableDebounceFakeTimers();
			}
		});

		it('should not mark disabled item on key press while opened', async () => {
			enableDebounceFakeTimers();
			try {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [searchable]="false" [(ngModel)]="selectedCity"></ng-select>`,
				);

				fixture.componentInstance.cities = [
					{ id: 1, name: 'New York' },
					{ id: 2, name: 'Paris', disabled: true },
				];
				await tickAndDetectChanges(fixture);

				const select = fixture.componentInstance.select();
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), 'p');
				await advanceDebounce(fixture, 200);

				expect(select.itemsList.markedItem.label).toBe('New York');
			} finally {
				disableDebounceFakeTimers();
			}
		});
	});

	describe('Input method composition', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;
		const originValue = '';
		const imeInputValue = 'zhangsan';

		beforeEach(() => {
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="citiesNames"
					[keyDownFn]="keyDownFn"
                    [addTag]="true"
                    placeholder="select value"
                    [searchWhileComposing]="searchWhileComposing"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			select = fixture.componentInstance.select();
			fixture.componentInstance.searchWhileComposing = false;
		});

		describe('composition start', () => {
			it('should not update search term', async () => {
				select.filter(originValue);
				await tickAndDetectChanges(fixture);
				select.onCompositionStart();
				await tickAndDetectChanges(fixture);
				select.filter(imeInputValue);

				expect(select.searchTerm).toBe(originValue);
			});

			it('should be filtered even search term is empty', async () => {
				select.filter('');
				await tickAndDetectChanges(fixture);
				select.onCompositionStart();
				await tickAndDetectChanges(fixture);
				select.filter(imeInputValue);

				expect(select.searchTerm).toBe('');
				expect(select.filtered).toBeTruthy();
			});
		});

		describe('composition end', () => {
			it('should update search term', async () => {
				await tickAndDetectChanges(fixture);
				select.filter(originValue);
				await tickAndDetectChanges(fixture);
				select.onCompositionEnd(imeInputValue);
				await tickAndDetectChanges(fixture);

				expect(select.searchTerm).toBe(imeInputValue);
			});

			it('should update search term when searchWhileComposing', async () => {
				fixture.componentInstance.searchWhileComposing = true;
				select.onCompositionStart();
				select.onCompositionEnd(imeInputValue);
				select.filter('new term');

				expect(select.searchTerm).toBe('new term');
			});
		});
	});

	describe('User defined keyDown handler', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;

		beforeEach(() => {
			fixture = createTestingModule(NgSelectTestComponent, `<ng-select [keyDownFn]="keyDownFn" />`);
			select = fixture.componentInstance.select();
		});

		const expectSpyToBeCalledAfterKeyDown = (spy, expectedNumber) => {
			const possibleKeyCodes = Object.keys(KeyCode);
			possibleKeyCodes.forEach((keyCode) => {
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode[keyCode]);
			});
			expect(spy).toHaveBeenCalledTimes(expectedNumber);
		};

		it('should execute user function if any of defined keys was pressed', () => {
			const spy = vi.spyOn(fixture.componentInstance.select()._keyDownFn[SIGNAL], 'value').mockReturnValue(undefined);

			expectSpyToBeCalledAfterKeyDown(spy, Object.keys(KeyCode).length);
		});

		it('should not call any of default keyDown handlers if user handler returns false', async () => {
			fixture.componentInstance.keyDownFn = () => false;
			await tickAndDetectChanges(fixture);
			const spy = vi.spyOn(fixture.componentInstance.select(), 'handleKeyCode').mockReturnValue(undefined);

			expectSpyToBeCalledAfterKeyDown(spy, 0);
		});

		it('should call default keyHandler if user handler returns truthy', async () => {
			fixture.componentInstance.keyDownFn = () => true;
			await tickAndDetectChanges(fixture);

			const spy = vi.spyOn(fixture.componentInstance.select(), 'handleKeyCode').mockReturnValue(undefined);
			expectSpyToBeCalledAfterKeyDown(spy, Object.keys(KeyCode).length);
		});

		it('should call default keyHandler if user handler returns falsy but not `false`', async () => {
			fixture.componentInstance.keyDownFn = () => null;
			await tickAndDetectChanges(fixture);

			const spy = vi.spyOn(fixture.componentInstance.select(), 'handleKeyCode').mockReturnValue(undefined);
			expectSpyToBeCalledAfterKeyDown(spy, Object.keys(KeyCode).length);
		});
	});
});
