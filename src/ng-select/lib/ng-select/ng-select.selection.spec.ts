import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNgSelectElement, getNgSelectNativeElement, selectOption, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { advanceDebounce, disableDebounceFakeTimers, enableDebounceFakeTimers } from '../../testing/timer-helpers';
import { NgSelectConfig } from '../services/config.service';
import { KeyCode, NgOption } from '../types/ng-select.types';
import { NgSelectComponent } from './ng-select.component';

import { createEvent, createTestingModule, NgSelectGroupingTestComponent, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
	describe('Data source', () => {
		it('should set items from primitive numbers array', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="[0, 30, 60, 90, 120, 180, 240]">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const itemsList = fixture.componentInstance.select().itemsList;
			expect(itemsList.items.length).toBe(7);
			expect(itemsList.items[0]).toEqual(
				expect.objectContaining({
					label: '0',
					value: 0,
				}),
			);
		});

		it('should set items from array', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]=cities bindLabel="name">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const itemsList = fixture.componentInstance.select().itemsList;
			expect(itemsList.items.length).toBe(5);
			expect(itemsList.items[0]).toEqual(
				expect.objectContaining({
					label: 'New York',
					value: { id: 1, name: 'New York' },
				}),
			);
		});

		it('should set items from readonly array', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]=readonlyCities bindLabel="name">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const itemsList = fixture.componentInstance.select().itemsList;
			expect(itemsList.items.length).toBe(5);
			expect(itemsList.items[0]).toEqual(
				expect.objectContaining({
					label: 'New York',
					value: { id: 1, name: 'New York' },
				}),
			);
		});

		it('should create items from ng-option', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity">
					<ng-option [value]="true">Yes</ng-option>
					<ng-option [value]="false">No</ng-option>
				</ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			const items = fixture.componentInstance.select().itemsList.items;
			expect(items.length).toBe(2);
			expect(items[0]).toEqual(
				expect.objectContaining({
					label: 'Yes',
					value: true,
					disabled: false,
				}),
			);
			expect(items[1]).toEqual(
				expect.objectContaining({
					label: 'No',
					value: false,
					disabled: false,
				}),
			);
		});

		it('should create empty items list when initialized with null', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="null">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const itemsList = fixture.componentInstance.select().itemsList;
			expect(itemsList.items.length).toBe(0);
		});
		it('should create empty items list when initialized with undefined', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="undefined">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const itemsList = fixture.componentInstance.select().itemsList;
			expect(itemsList.items.length).toBe(0);
		});
	});

	describe('Multiple', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;
		beforeEach(() => {
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    placeholder="select value"
                    [(ngModel)]="selectedCities"
					[hideSelected]="hideSelected"
                    [closeOnSelect]="closeOnSelect"
					[maxSelectedItems]="maxSelectedItems"
                    [addTag]="addTag"
                    [typeahead]="typeahead"
                    [multiple]="true">
                </ng-select>`,
			);
		});

		it('should have relevant classes', () => {
			const selectElement = getNgSelectNativeElement(fixture);
			expect(selectElement.classList.contains('ng-select')).toBe(true);
			expect(selectElement.classList.contains('ng-select-multiple')).toBe(true);
		});

		it('should select several items', async () => {
			await selectOption(fixture, KeyCode.ArrowDown, 1);
			await selectOption(fixture, KeyCode.ArrowDown, 2);
			await tickAndDetectChanges(fixture);
			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);
		});

		it('should toggle selected item', async () => {
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await selectOption(fixture, KeyCode.ArrowDown, 2);
			await tickAndDetectChanges(fixture);
			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);

			// reopening marks the first selected option, so enter toggles it off directly
			await selectOption(fixture, KeyCode.ArrowUp, 0);
			await tickAndDetectChanges(fixture);
			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
			expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
				expect.objectContaining({
					value: { id: 3, name: 'Beijing' },
				}),
			);
		});

		it('should not toggle item on enter when dropdown is closed', async () => {
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
		});

		describe('max selected items', () => {
			let arrowIcon: DebugElement = null;
			beforeEach(() => {
				fixture.componentInstance.maxSelectedItems = 2;
				arrowIcon = fixture.debugElement.query(By.css('.ng-arrow-wrapper'));
			});

			it('should be able to select only two elements', async () => {
				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				// reopening marks the first selected option, so two arrow presses target an unselected one
				await selectOption(fixture, KeyCode.ArrowDown, 2);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);
			});

			it('should not open dropdown when maximum of items is reached', async () => {
				const clickArrow = () => arrowIcon.triggerEventHandler('click', {});
				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await tickAndDetectChanges(fixture);
				clickArrow();
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().isOpen()).toBe(false);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);
			});
		});

		describe('show selected', () => {
			beforeEach(() => {
				select = fixture.componentInstance.select();
				fixture.componentInstance.hideSelected = true;
				fixture.componentInstance.closeOnSelect = false;
			});

			it('should close dropdown when all items are selected', async () => {
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				await selectOption(fixture, KeyCode.ArrowDown, 1);
				expect(select.selectedItems.length).toBe(5);
				expect(select.itemsList.filteredItems.length).toBe(0);
				expect(select.isOpen()).toBeFalsy();
			});

			it('should not open dropdown when all items are selected', async () => {
				fixture.componentInstance.selectedCities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.selectedItems.length).toBe(5);
				expect(select.itemsList.filteredItems.length).toBe(0);
				expect(select.isOpen()).toBeFalsy();
			});

			it('should open dropdown when all items are selected and tagging is enabled', async () => {
				fixture.componentInstance.addTag = true;
				fixture.componentInstance.cities = [];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				expect(select.isOpen()).toBeTruthy();
			});

			it('should not insert option back to list if it is newly created option', async () => {
				fixture.componentInstance.addTag = true;
				fixture.componentInstance.typeahead = new Subject();
				await tickAndDetectChanges(fixture);
				select.typeahead().subscribe();
				fixture.componentInstance.cities = [];
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.select().filter('New item');
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);

				expect(select.selectedItems.length).toBe(1);
				expect(select.items().length).toBe(0);
				select.unselect(select.selectedItems[0]);
				await tickAndDetectChanges(fixture);
				expect(select.itemsList.filteredItems.length).toBe(0);
			});

			it('should remove selected item from items list', async () => {
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
				await tickAndDetectChanges(fixture);
				expect(select.selectedItems.length).toBe(1);
				expect(select.itemsList.filteredItems.length).toBe(4);
			});

			it('should put unselected item back to list', async () => {
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
				expect(fixture.componentInstance.select().selectedItems.length).toBe(0);
				expect(fixture.componentInstance.select().itemsList.filteredItems.length).toBe(5);
			});

			it('should keep same ordering while unselecting', async () => {
				fixture.componentInstance.selectedCities = [...fixture.componentInstance.cities.reverse()];
				await tickAndDetectChanges(fixture);
				select.unselect(select.selectedItems[0]);
				select.unselect(select.selectedItems[0]);
				select.unselect(select.selectedItems[0]);
				select.unselect(select.selectedItems[0]);
				select.unselect(select.selectedItems[0]);
				expect(select.selectedItems.length).toBe(0);
				expect(select.itemsList.filteredItems.length).toBe(5);
				expect(select.itemsList.filteredItems[0].label).toBe('New York');
				expect(select.itemsList.filteredItems[1].label).toBe('London');
				expect(select.itemsList.filteredItems[2].label).toBe('Beijing');
			});

			it('should reset list while clearing all selected items', async () => {
				fixture.componentInstance.selectedCities = [...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);
				select.handleClearClick();
				expect(select.selectedItems.length).toBe(0);
				expect(select.itemsList.filteredItems.length).toBe(5);
			});

			it('should skip selected items while filtering', async () => {
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
				await tickAndDetectChanges(fixture);
				select.filter('lon');
				await tickAndDetectChanges(fixture);
				expect(select.itemsList.filteredItems.length).toBe(1);
				expect(select.itemsList.filteredItems[0].label).toBe('London');
				select.filter('');
				await tickAndDetectChanges(fixture);
				expect(select.itemsList.filteredItems.length).toBe(4);
			});
		});
	});

	describe('Deselecting items', () => {
		describe('Multiple', () => {
			it('should not toggle selected item when deselectOnClick is false', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        bindLabel="name"
                        [multiple]="true"
                        [deselectOnClick]="false">
                    </ng-select>`,
				);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await selectOption(fixture, KeyCode.ArrowDown, 2);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);
				expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
					expect.objectContaining({
						value: { id: 1, name: 'New York' },
					}),
				);
			});

			it('should toggle selected item when deselectOnClick is true', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        bindLabel="name"
                        [multiple]="true"
                        [deselectOnClick]="true">
                    </ng-select>`,
				);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await selectOption(fixture, KeyCode.ArrowDown, 2);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);

				// reopening marks the first selected option, so enter toggles it off directly
				await selectOption(fixture, KeyCode.ArrowUp, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
				expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
					expect.objectContaining({
						value: { id: 3, name: 'Beijing' },
					}),
				);
			});

			it('should toggle selected item when deselectOnClick is undefined', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        bindLabel="name"
                        [multiple]="true">
                    </ng-select>`,
				);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await selectOption(fixture, KeyCode.ArrowDown, 2);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(2);

				// reopening marks the first selected option, so enter toggles it off directly
				await selectOption(fixture, KeyCode.ArrowUp, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
				expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
					expect.objectContaining({
						value: { id: 3, name: 'Beijing' },
					}),
				);
			});
		});

		describe('Single', () => {
			it('should not toggle selected item when deselectOnClick is false', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        bindLabel="name"
                        [deselectOnClick]="false">
                    </ng-select>`,
				);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
				expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
					expect.objectContaining({
						value: { id: 1, name: 'New York' },
					}),
				);
			});

			it('should toggle selected item when deselectOnClick is true', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        bindLabel="name"
                        [deselectOnClick]="true">
                    </ng-select>`,
				);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(0);
			});

			it('should not toggle selected item when deselectOnClick is undefined', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        bindLabel="name">
                    </ng-select>`,
				);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);

				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect((<NgOption[]>fixture.componentInstance.select().selectedItems).length).toBe(1);
				expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
					expect.objectContaining({
						value: { id: 1, name: 'New York' },
					}),
				);
			});
		});
	});

	describe('Tagging', () => {
		it('should select default tag', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [addTag]="true"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('new tag');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.selectedCity.name).toBe('new tag');
		});

		it('should add tag as string', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="citiesNames"
                    [addTag]="true"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('Copenhagen');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.selectedCity).toBe(<any>'Copenhagen');
		});

		it('should add tag as string when there are no items', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="[]"
                    [addTag]="true"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('Copenhagen');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.selectedCity).toBe(<any>'Copenhagen');
			expect(fixture.componentInstance.select().itemsList.filteredItems.length).toBe(1);
		});

		it('should not add item to list when select is closed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="[]"
                    [isOpen]="false"
                    [addTag]="true"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('Copenhagen');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.select().itemsList.filteredItems.length).toBe(0);
		});

		it('should add tag as string when tab pressed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="citiesNames"
                    [addTag]="true"
                    [selectOnTab]="true"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('Copenhagen');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
			expect(fixture.componentInstance.selectedCity).toBe(<any>'Copenhagen');
		});

		it('should select tag even if there are filtered items that matches search term', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [addTag]="true"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('Lon');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.selectedCity.name).toBe('Lon');
		});

		it('should select custom tag', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [addTag]="tagFunc"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('custom tag');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(<any>fixture.componentInstance.selectedCity).toEqual(
				expect.objectContaining({
					id: 'custom tag',
					name: 'custom tag',
					custom: true,
				}),
			);
		});

		it('should select custom tag with promise', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [addTag]="tagFuncPromise"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('server side tag');
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			await tickAndDetectChanges(fixture);
			expect(<any>fixture.componentInstance.selectedCity).toEqual(
				expect.objectContaining({
					id: 5,
					name: 'server side tag',
					valid: true,
				}),
			);
		});

		describe('show add tag', () => {
			let select: NgSelectComponent;
			let fixture: ComponentFixture<NgSelectTestComponent>;
			beforeEach(() => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
						bindLabel="name"
						[multiple]="true"
						[addTag]="true"
						[minTermLength]="minTermLength"
						[hideSelected]="hideSelected"
						placeholder="select value"
						[(ngModel)]="selectedCities">
					</ng-select>`,
				);
				select = fixture.componentInstance.select();
			});

			it('should be false when there is no search term', () => {
				select.filter(null);
				expect(select.showAddTag).toBeFalsy();
			});

			it('should be false when term is too short', () => {
				select.filter('vi');
				fixture.componentInstance.minTermLength = 3;
				fixture.detectChanges();
				expect(select.showAddTag).toBeFalsy();
			});

			it('should be true when term not exists among items', () => {
				select.filter('xyznonexistent');
				expect(select.showAddTag).toBeTruthy();
			});

			it('should be false when term exists among items', () => {
				select.filter('New York');
				expect(select.showAddTag).toBeFalsy();
			});

			it('should be false when term exists among selected items', async () => {
				fixture.componentInstance.hideSelected = true;
				select.filter('Palanga');
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.selectedCities = [{ name: 'Palanga', id: 9 }];
				await tickAndDetectChanges(fixture);
				expect(select.showAddTag).toBeFalsy();
			});

			it('should be false when term exists among selected items and select is closed', async () => {
				fixture.componentInstance.hideSelected = false;
				select.filter('Palanga');
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.selectedCities = [{ name: 'Palanga', id: 9 }];
				select.isOpen.set(false);
				await tickAndDetectChanges(fixture);
				expect(select.showAddTag).toBeFalsy();
			});

			it('should be false when there is search term with only empty space', () => {
				triggerKeyDownEvent(getNgSelectElement(fixture), '   ');
				expect(select.showAddTag).toBeFalsy();
			});
		});
	});

	describe('Filter', () => {
		beforeEach(() => {
			enableDebounceFakeTimers();
		});

		afterEach(() => {
			disableDebounceFakeTimers();
		});

		it('should filter using default implementation', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await advanceDebounce(fixture, 200);
			fixture.componentInstance.select().filter('new york');
			await advanceDebounce(fixture, 200);

			const result = [
				expect.objectContaining({
					value: { id: 1, name: 'New York' },
				}),
			];
			expect(fixture.componentInstance.select().itemsList.filteredItems).toEqual(result);
		});

		it('should filter using custom searchFn', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [searchFn]="searchFn"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.searchFn = (term: string, item: any) => item.name.indexOf(term) > -1 || item.id === 2;
			const select = fixture.componentInstance.select();
			await tickAndDetectChanges(fixture);
			select.filter('New York');
			await advanceDebounce(fixture, 200);

			expect(select.itemsList.filteredItems.length).toEqual(2);
			expect(select.itemsList.filteredItems[0]).toEqual(
				expect.objectContaining({
					value: { id: 1, name: 'New York' },
				}),
			);
			expect(select.itemsList.filteredItems[1]).toEqual(
				expect.objectContaining({
					value: { id: 2, name: 'London' },
				}),
			);
		});

		it('should toggle dropdown when searchable false', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [searchable]="false"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			const selectInput = fixture.debugElement.query(By.css('.ng-select-container'));
			// open
			selectInput.triggerEventHandler('mousedown', createEvent());
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().isOpen()).toBe(true);

			// close
			selectInput.triggerEventHandler('mousedown', createEvent());
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().isOpen()).toBe(false);
		});

		it('should not filter when searchable false', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [searchable]="false"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			triggerKeyDownEvent(getNgSelectElement(fixture), 'v');
			await advanceDebounce(fixture, 200);
			fixture.detectChanges();

			const input: HTMLInputElement = select.element.querySelector('input');
			expect(select.searchTerm).toBeNull();
			expect(input.readOnly).toBeTruthy();
		});

		it('should mark first item on filter', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await advanceDebounce(fixture, 200);
			fixture.componentInstance.select().filter('bei');
			await advanceDebounce(fixture, 200);

			const result = expect.objectContaining({
				value: fixture.componentInstance.cities[2],
			});
			expect(fixture.componentInstance.select().itemsList.markedItem).toEqual(result);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.select().selectedItems).toEqual([result]);
		});

		it('should not mark first item when isOpen is false', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [isOpen]="false"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await advanceDebounce(fixture, 200);
			fixture.componentInstance.select().filter('bei');
			await advanceDebounce(fixture, 200);

			expect(fixture.componentInstance.select().itemsList.markedItem).toBeUndefined();
		});

		it('should mark first item on filter when selected is not among filtered items', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			fixture.detectChanges();
			fixture.componentInstance.select().filter('bei');
			await tickAndDetectChanges(fixture);

			const result = expect.objectContaining({
				value: fixture.componentInstance.cities[2],
			});
			expect(fixture.componentInstance.select().itemsList.markedItem).toEqual(result);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			expect(fixture.componentInstance.select().selectedItems).toEqual([result]);
		});

		it('should not mark first item on filter when markFirst disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [markFirst]="false"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await advanceDebounce(fixture, 200);
			fixture.componentInstance.select().filter('bei');
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().itemsList.markedItem).toEqual(undefined);
		});

		it('should clear filterValue on selected item', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity"
                    [multiple]="true">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), 'Hey! Whats up!?');
			await selectOption(fixture, KeyCode.ArrowDown, 1);
			await tickAndDetectChanges(fixture);
			expect(select.searchTerm).toBe(null);
		});

		it('should not reset items when selecting option', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity"
                    [multiple]="true">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter(null);
			const resetFilteredItemsSpy = vi.spyOn(fixture.componentInstance.select().itemsList, 'resetFilteredItems').mockReturnValue(undefined);

			await selectOption(fixture, KeyCode.ArrowDown, 1);
			await tickAndDetectChanges(fixture);
			expect(resetFilteredItemsSpy).not.toHaveBeenCalled();
		});

		it('should filter grouped items', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			fixture.componentInstance.select().filter('adam');
			await tickAndDetectChanges(fixture);

			const filteredItems = fixture.componentInstance.select().itemsList.filteredItems;
			expect(filteredItems.length).toBe(2);
			expect(filteredItems[0].children).toBeDefined();
			expect(filteredItems[0].label).toBe('United States');
			expect(filteredItems[1].parent).toBe(filteredItems[0]);
			expect(filteredItems[1].label).toBe('Adam');
		});

		it('should continue filtering items on update of items', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.select().filter('york');
			await tickAndDetectChanges(fixture);

			let result = [
				expect.objectContaining({
					value: { id: 1, name: 'New York' },
				}),
			];
			expect(fixture.componentInstance.select().itemsList.filteredItems).toEqual(result);

			fixture.componentInstance.cities = [
				{ id: 1, name: 'New York' },
				{ id: 2, name: 'London' },
				{
					id: 3,
					name: 'Beijing',
				},
				{ id: 4, name: 'New Delhi' },
			];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.select().filter('new');
			await tickAndDetectChanges(fixture);

			result = [
				expect.objectContaining({
					value: { id: 1, name: 'New York' },
				}),
				expect.objectContaining({
					value: { id: 4, name: 'New Delhi' },
				}),
			];
			expect(fixture.componentInstance.select().itemsList.filteredItems).toEqual(result);
		});

		describe('with typeahead', () => {
			let fixture: ComponentFixture<NgSelectTestComponent>;
			beforeEach(() => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        [minTermLength]="minTermLength"
                        bindLabel="name"
						[markFirst]="markFirst"
                        [hideSelected]="hideSelected"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);
			});

			it('should not show selected city among options if it does not match search term', async () => {
				fixture.componentInstance.selectedCity = { id: 9, name: 'Copenhagen' };
				await tickAndDetectChanges(fixture);

				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.select().filter('new');
				fixture.componentInstance.cities = [{ id: 4, name: 'New York' }];
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().itemsList.filteredItems.length).toBe(1);
				expect(fixture.componentInstance.select().itemsList.filteredItems[0]).toEqual(
					expect.objectContaining({
						value: { id: 4, name: 'New York' },
					}),
				);
			});

			it('should push term to custom observable', async () => {
				fixture.componentInstance.filter.subscribe();
				const next = vi.spyOn(fixture.componentInstance.filter, 'next').mockReturnValue(undefined);
				fixture.componentInstance.select().filter('new york');
				await tickAndDetectChanges(fixture);
				expect(next).toHaveBeenCalledWith('new york');
			});

			it('should push term to custom observable', async () => {
				fixture.componentInstance.filter.subscribe();
				const next = vi.spyOn(fixture.componentInstance.filter, 'next').mockReturnValue(undefined);
				fixture.componentInstance.select().filter('');
				await tickAndDetectChanges(fixture);
				expect(next).toHaveBeenCalledWith('');
			});

			it('should not push term to custom observable if length is less than minTermLength', async () => {
				fixture.componentInstance.minTermLength = 2;
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.filter.subscribe();
				const next = vi.spyOn(fixture.componentInstance.filter, 'next').mockReturnValue(undefined);
				fixture.componentInstance.select().filter('v');
				await tickAndDetectChanges(fixture);
				expect(next).not.toHaveBeenCalledWith('v');
			});

			it('should mark first item when typeahead results are loaded', async () => {
				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.select().filter('buk');
				fixture.componentInstance.cities = [{ id: 4, name: 'Bukiskes' }];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
				expect(fixture.componentInstance.select().selectedItems).toEqual([
					expect.objectContaining({
						value: { id: 4, name: 'Bukiskes' },
					}),
				]);
			});

			it('should not mark first item when typeahead results are loaded', async () => {
				fixture.componentInstance.markFirst = false;
				fixture.detectChanges();
				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.select().filter('buk');
				fixture.componentInstance.cities = [{ id: 4, name: 'Bukiskes' }];
				await tickAndDetectChanges(fixture);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
				expect(fixture.componentInstance.select().selectedItems).toEqual([]);
			});

			it('should open dropdown when hideSelected=true and no items to select', async () => {
				fixture.componentInstance.hideSelected = true;
				fixture.componentInstance.cities = [];
				fixture.componentInstance.selectedCity = null;
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.select().open();
				expect(fixture.componentInstance.select().isOpen()).toBeTruthy();
			});

			describe('search text', () => {
				it('should be visible until minTermLength reached', async () => {
					fixture.componentInstance.cities = [];
					fixture.componentInstance.minTermLength = 3;
					fixture.componentInstance.filter.subscribe();
					fixture.componentInstance.select().filter('vi');
					await tickAndDetectChanges(fixture);
					expect(fixture.componentInstance.select().showTypeToSearch()).toBeTruthy();
				});

				it('should not be visible when valid search term is present', async () => {
					fixture.componentInstance.cities = [];
					fixture.componentInstance.minTermLength = 0;
					fixture.componentInstance.filter.subscribe();
					fixture.componentInstance.select().filter('v');
					await tickAndDetectChanges(fixture);
					expect(fixture.componentInstance.select().showTypeToSearch()).toBeFalsy();
				});
			});
		});

		describe('clear on add', () => {
			it('should clear search term by default', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [hideSelected]="hideSelected"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				expect(fixture.componentInstance.select().clearSearchOnAddValue()).toBeTruthy();

				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.cities = [{ id: 4, name: 'New York' }];
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.select().filter('new');
				expect(fixture.componentInstance.select().itemsList.filteredItems.length).toBe(1);
				expect(fixture.componentInstance.select().searchTerm).toBe('new');

				const select = fixture.componentInstance.select();
				fixture.componentInstance.select().select(select.viewPortItems[0]);
				expect(select.searchTerm).toBeNull();
			});

			it('should not clear search term by default when closeOnSelect is false ', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [hideSelected]="hideSelected"
                        [closeOnSelect]="false"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				expect(fixture.componentInstance.select().clearSearchOnAddValue()).toBeFalsy();

				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.cities = [{ id: 4, name: 'New York' }];
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.select().filter('new');

				const select = fixture.componentInstance.select();
				fixture.componentInstance.select().select(select.viewPortItems[0]);
				expect(select.itemsList.filteredItems.length).toBe(1);
				expect(select.searchTerm).toBe('new');
			});

			it('should not clear search term when clearSearchOnAdd is false', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [hideSelected]="hideSelected"
                        [clearSearchOnAdd]="false"
                        [closeOnSelect]="false"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				expect(fixture.componentInstance.select().clearSearchOnAddValue()).toBeFalsy();
				expect(fixture.componentInstance.select().closeOnSelect()).toBeFalsy();

				fixture.componentInstance.filter.subscribe();
				const select = fixture.componentInstance.select();
				select.filter('new');
				fixture.componentInstance.cities = [
					{ id: 4, name: 'New York' },
					{ id: 5, name: 'California' },
				];
				await tickAndDetectChanges(fixture);
				select.select(select.viewPortItems[0]);
				expect(select.searchTerm).toBe('new');
			});

			it('should clear search term without emitting on typeahead when selecting an item', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [hideSelected]="hideSelected"
                        [clearSearchOnAdd]="true"
                        [closeOnSelect]="false"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				expect(fixture.componentInstance.select().clearSearchOnAddValue()).toBeTruthy();
				expect(fixture.componentInstance.select().closeOnSelect()).toBeFalsy();

				const emittedTerms: (string | null)[] = [];
				fixture.componentInstance.filter.subscribe((value) => {
					emittedTerms.push(value);
				});
				fixture.componentInstance.cities = [
					{ id: 4, name: 'New York' },
					{ id: 5, name: 'California' },
				];
				await tickAndDetectChanges(fixture);
				const select = fixture.componentInstance.select();
				select.filter('new');
				expect(emittedTerms).toEqual(['new']);
				select.select(select.viewPortItems[0]);
				expect(select.searchTerm).toBeNull();
				expect(emittedTerms).toEqual(['new']);
			});

			it('should not emit on typeahead when closing after a search', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				const emittedTerms: (string | null)[] = [];
				fixture.componentInstance.filter.subscribe((value) => {
					emittedTerms.push(value);
				});
				await tickAndDetectChanges(fixture);
				const select = fixture.componentInstance.select();
				select.filter('vil');
				expect(emittedTerms).toEqual(['vil']);
				select.close();
				expect(select.searchTerm).toBeNull();
				expect(emittedTerms).toEqual(['vil']);
			});

			it('should not emit on typeahead when clearing via clear button', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);

				const emittedTerms: (string | null)[] = [];
				fixture.componentInstance.filter.subscribe((value) => {
					emittedTerms.push(value);
				});
				await tickAndDetectChanges(fixture);
				const select = fixture.componentInstance.select();
				select.filter('vil');
				expect(emittedTerms).toEqual(['vil']);
				select.handleClearClick();
				expect(select.searchTerm).toBeNull();
				expect(emittedTerms).toEqual(['vil']);
			});

			it('should respect NgSelectConfig.clearSearchOnAdd if defined', async () => {
				const config = new NgSelectConfig();
				config.clearSearchOnAdd = true;
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [hideSelected]="hideSelected"
                        [closeOnSelect]="false"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
					config,
				);

				expect(fixture.componentInstance.select().clearSearchOnAddValue()).toBeTruthy();

				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.select().filter('new');
				fixture.componentInstance.cities = [{ id: 4, name: 'New York' }];
				await tickAndDetectChanges(fixture);

				const select = fixture.componentInstance.select();
				fixture.componentInstance.select().select(select.viewPortItems[0]);
				expect(select.itemsList.filteredItems.length).toBe(1);
				expect(select.searchTerm).toBe(null);
			});

			it('should allow user to override NgSelectConfig.clearSearchOnAdd on a per component basis', async () => {
				const config = new NgSelectConfig();
				config.clearSearchOnAdd = true;
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        bindLabel="name"
                        [hideSelected]="hideSelected"
                        [closeOnSelect]="false"
                        [clearSearchOnAdd]="false"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
					config,
				);

				expect(fixture.componentInstance.select().clearSearchOnAddValue()).toBeFalsy();

				fixture.componentInstance.filter.subscribe();
				const select = fixture.componentInstance.select();
				select.filter('new');
				fixture.componentInstance.cities = [{ id: 4, name: 'New York' }];
				await tickAndDetectChanges(fixture);

				select.select(select.viewPortItems[0]);
				expect(select.itemsList.filteredItems.length).toBe(1);
				expect(select.searchTerm).toBe('new');
			});
		});

		describe('edit search query', () => {
			it('should allow edit search if option selected & input focused', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        [editableSearchTerm]="true"
                        bindValue="id"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);
				expect(fixture.componentInstance.select().editableSearchTerm()).toBeTruthy();
				const select = fixture.componentInstance.select();
				const input = select.searchInput().nativeElement;
				const selectedCity = fixture.componentInstance.cities[0];
				fixture.componentInstance.selectedCity = selectedCity.id;
				await tickAndDetectChanges(fixture);
				input.focus();
				await advanceDebounce(fixture, 2000);
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);
				expect(select.searchTerm).toEqual(selectedCity.name);
				expect(input.value).toEqual(selectedCity.name);
			});

			it('should display all items if wrong query passed & dropdown reopened', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [typeahead]="filter"
                        [editableSearchTerm]="true"
                        bindValue="id"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);
				const select = fixture.componentInstance.select();
				const input = select.searchInput().nativeElement;
				const selectedCity = fixture.componentInstance.cities[0];
				const wrongSearchTerm = 'some wrong search';
				const selectConfig = new NgSelectConfig();
				fixture.componentInstance.selectedCity = selectedCity.id;
				await tickAndDetectChanges(fixture);
				input.focus();
				input.value = wrongSearchTerm;
				input.dispatchEvent(new Event('input'));
				await tickAndDetectChanges(fixture);
				expect(select.searchTerm).toEqual(wrongSearchTerm);
				const firstOption = document.querySelector('.ng-dropdown-panel .ng-option');
				expect(firstOption.innerHTML).toEqual(selectConfig.notFoundText);
				input.blur();
				select.close();
				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBeFalsy();
				input.value = '';
				input.focus();
				input.dispatchEvent(new Event('input'));
				await tickAndDetectChanges(fixture);
				const allOptions = document.querySelectorAll('.ng-dropdown-panel .ng-option');
				expect(allOptions.length).toEqual(fixture.componentInstance.cities.length);
			});

			it('should update search term when ngModel is updated programmatically', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities"
                        [editableSearchTerm]="true"
                        bindValue="id"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                    </ng-select>`,
				);
				const select = fixture.componentInstance.select();
				const selectedCity = fixture.componentInstance.cities[0];

				// Update ngModel programmatically (simulating writeValue)
				fixture.componentInstance.selectedCity = selectedCity.id;
				await tickAndDetectChanges(fixture);

				// The search term should be updated to match the selected item's label
				expect(select.searchTerm).toEqual(selectedCity.name);
			});
		});
	});
});
