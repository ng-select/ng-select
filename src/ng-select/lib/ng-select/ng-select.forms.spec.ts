import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { getNgSelectElement, selectOption, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { advanceDebounce, disableDebounceFakeTimers, enableDebounceFakeTimers, openSelect } from '../../testing/timer-helpers';
import { NgSelectModule } from '../ng-select.module';
import { DefaultSelectionModelFactory } from '../selection-model';
import { NgSelectConfig } from '../services/config.service';
import { KeyCode, NgOption } from '../types/ng-select.types';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select.component';

import { createTestingModule, NgSelectGroupingTestComponent, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
	describe('Model bindings and data changes', () => {
		let select: NgSelectComponent;

		it('should update ngModel on value change', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 1);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.selectedCity).toEqual(expect.objectContaining(fixture.componentInstance.cities[1]));

			fixture.componentInstance.select().clearModel();
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.selectedCity).toEqual(null);
		});

		it('should update internal model on ngModel change', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					value: fixture.componentInstance.cities[0],
				}),
			]);

			fixture.componentInstance.selectedCity = null;
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems).toEqual([]);
		});

		it('should update internal model after it was toggled with @if()', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                @if (visible) {
                    <ng-select
                            [items]="cities"
                            bindLabel="name"
                            [clearable]="true"
                            [(ngModel)]="selectedCity">
                    </ng-select>
                }`,
			);

			// select first city
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			// toggle to hide/show
			fixture.componentInstance.toggleVisible();
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.toggleVisible();
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.selectedCity = null;
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems).toEqual([]);
		});

		it('should set items correctly after ngModel set first when bindValue is used', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="id"
                        [clearable]="true"
                        [(ngModel)]="selectedCityId">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [];
			fixture.componentInstance.selectedCityId = 7;
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [{ id: 7, name: 'Pailgis' }];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems[0]).toBe(select.itemsList.items[0]);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					value: { id: 7, name: 'Pailgis' },
				}),
			]);
		});

		it('should set items correctly after ngModel set first when bindValue is not used', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [];
			fixture.componentInstance.selectedCity = { id: 7, name: 'Pailgis' };
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [{ id: 7, name: 'Pailgis' }];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems[0]).toBe(select.itemsList.items[0]);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					value: { id: 7, name: 'Pailgis' },
				}),
			]);
		});

		it('should set items correctly after ngModel set first when bindValue is used from NgSelectConfig', async () => {
			const config = new NgSelectConfig();
			config.bindValue = 'id';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCityId">
                </ng-select>`,
				config,
			);

			fixture.componentInstance.cities = [];
			fixture.componentInstance.selectedCityId = 7;
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [{ id: 7, name: 'Pailgis' }];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems[0]).toBe(select.itemsList.items[0]);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					value: { id: 7, name: 'Pailgis' },
				}),
			]);
		});

		it('should not apply global bindValue from NgSelectConfig if bindValue prop explicitly provided in template', async () => {
			const config = new NgSelectConfig();
			config.bindValue = 'globalbindvalue';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="id"
                        [clearable]="true"
                        [(ngModel)]="selectedCityId">
                </ng-select>`,
				config,
			);

			fixture.componentInstance.cities = [];
			fixture.componentInstance.selectedCityId = 7;
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [{ id: 7, name: 'Pailgis' }];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems[0]).toBe(select.itemsList.items[0]);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					value: { id: 7, name: 'Pailgis' },
				}),
			]);
		});

		it('should bind whole object as value when bindValue prop is specified with empty string in template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue=""
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [];
			fixture.componentInstance.selectedCity = { id: 7, name: 'Pailgis' };
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [{ id: 7, name: 'Pailgis' }];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems[0]).toBe(select.itemsList.items[0]);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					value: { id: 7, name: 'Pailgis' },
				}),
			]);
		});

		it('should map label correctly', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [{ label: 'New York city', name: 'New York' }];
			await tickAndDetectChanges(fixture);
			select = fixture.componentInstance.select();

			expect(select.itemsList.items[0].label).toBe('New York');
		});

		it('should escape label', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [{ label: '<img src="azd" (error)="alert(1)" />', name: 'New York' }];
			await tickAndDetectChanges(fixture);
			const select = fixture.componentInstance.select();
			await openSelect(select, fixture);

			const options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options[0].innerText).toBe('<img src="azd" (error)="alert(1)" />');
		});

		it('should set items correctly after ngModel set first when typeahead and single select is used', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [typeahead]="filter"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			select = fixture.componentInstance.select();
			fixture.componentInstance.selectedCity = { id: 1, name: 'New York' };
			await tickAndDetectChanges(fixture);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					label: 'New York',
					value: { id: 1, name: 'New York' },
				}),
			]);

			fixture.componentInstance.cities = [
				{ id: 1, name: 'New York' },
				{ id: 2, name: 'London' },
				{
					id: 3,
					name: 'Beijing',
				},
			];
			await tickAndDetectChanges(fixture);
			const newYork = select.itemsList.items[0];
			expect(select.selectedItems[0]).toBe(select.itemsList.items[0]);
			expect(newYork.selected).toBeTruthy();
		});

		it('should set items correctly after ngModel set first when typeahead and multi-select is used', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    [multiple]="true"
                    [typeahead]="filter"
                    placeholder="select value"
                    [(ngModel)]="selectedCities">
                </ng-select>`,
			);

			select = fixture.componentInstance.select();
			fixture.componentInstance.selectedCities = [
				{ id: 1, name: 'New York' },
				{ id: 2, name: 'London' },
			];
			await tickAndDetectChanges(fixture);
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					label: 'New York',
					value: { id: 1, name: 'New York' },
				}),
				expect.objectContaining({ label: 'London', value: { id: 2, name: 'London' } }),
			]);

			fixture.componentInstance.cities = [
				{ id: 1, name: 'New York' },
				{ id: 2, name: 'London' },
				{
					id: 3,
					name: 'Beijing',
				},
			];
			await tickAndDetectChanges(fixture);
			const newYork = select.itemsList.items[0];
			const kaunas = select.itemsList.items[1];
			expect(select.selectedItems[0]).toBe(newYork);
			expect(newYork.selected).toBeTruthy();
			expect(select.selectedItems[1]).toBe(kaunas);
			expect(kaunas.selected).toBeTruthy();
		});

		it('should set items correctly if there is no bindLabel', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select
                    [items]="cities"
                    [clearable]="true"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			const cities = [{ id: 7, name: 'Pailgis' }];
			fixture.componentInstance.selectedCity = { id: 7, name: 'Pailgis' };
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.cities = [
				{ id: 1, name: 'New York' },
				{ id: 2, name: 'London' },
			];
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems[0]).toEqual(
				expect.objectContaining({
					value: cities[0],
				}),
			);
		});

		it('should bind ngModel object even if items are empty', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.selectedCity = { id: 7, name: 'Pailgis' };
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					value: { id: 7, name: 'Pailgis' },
					selected: true,
				}),
			]);
		});

		it('should bind ngModel simple value even if items are empty', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="citiesNames"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [];
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.selectedCity = <any>'London';
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					value: 'London',
					label: 'London',
					selected: true,
				}),
			]);
		});

		it('should preserve latest selected value when items are changing', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			const selectValue = fixture.componentInstance.select();
			fixture.componentInstance.select().select(selectValue.itemsList.items[1]);
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[1]);

			selectValue.clearModel();
			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.selectedCity).toBeNull();
		});

		it('should map selected items with items in dropdown', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			select = fixture.componentInstance.select();

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);
			expect(select.itemsList.filteredItems[0].selected).toBeTruthy();
		});

		it('should keep selected item while setting new items and bindValue is incorrect', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="value"
                        [clearable]="true"
                        [(ngModel)]="selectedCityId">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture); // triggers write value

			select = fixture.componentInstance.select();
			select.select(select.itemsList.items[1]);
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);

			expect(select.selectedItems[0]).toEqual(
				expect.objectContaining({
					value: { id: 2, name: 'London' },
				}),
			);
		});

		it('should clear previous single select value when setting new model', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			const lastSelection: any = fixture.componentInstance.select().selectedItems[0];
			expect(lastSelection.selected).toBeTruthy();

			fixture.componentInstance.selectedCity = null;
			await tickAndDetectChanges(fixture);
			expect(lastSelection.selected).toBeFalsy();
		});

		it('should clear disabled selected values when setting new model', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [multiple]="true"
                        [clearable]="true"
                        [(ngModel)]="selectedCities">
                </ng-select>`,
			);

			const disabled = { ...fixture.componentInstance.cities[1], disabled: true };
			fixture.componentInstance.selectedCities = <any>[fixture.componentInstance.cities[0], disabled];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities[1].disabled = true;
			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.selectedCities = [];
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems).toEqual([]);
		});

		it('should clear previous selected value even if it is disabled', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities[0].disabled = true;
			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems.length).toBe(1);
		});

		it('should clear previous multiple select value when setting new model', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [multiple]="true"
                        [clearable]="true"
                        [(ngModel)]="selectedCities">
                </ng-select>`,
			);

			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
			await tickAndDetectChanges(fixture);
			select = fixture.componentInstance.select();
			expect(select.selectedItems.length).toBe(1);

			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[1]];
			await tickAndDetectChanges(fixture);
			expect(select.selectedItems.length).toBe(1);

			fixture.componentInstance.selectedCities = [];
			await tickAndDetectChanges(fixture);
			expect(select.selectedItems.length).toBe(0);
		});

		it('should not add selected items to new items list when [items] are changed', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [multiple]="true"
                        [clearable]="true"
                        [(ngModel)]="selectedCities">
                </ng-select>`,
			);

			fixture.componentInstance.selectedCities = fixture.componentInstance.cities.slice(0, 2);
			await tickAndDetectChanges(fixture);

			fixture.componentInstance.cities = [{ id: 1, name: 'New city' }];
			await tickAndDetectChanges(fixture);

			const internalItems = fixture.componentInstance.select().itemsList.items;
			expect(internalItems.length).toBe(1);
			expect(internalItems[0].value).toEqual(expect.objectContaining({ id: 1, name: 'New city' }));
		});

		it('should reset marked item when [items] are changed and dropdown is opened', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);
			select = fixture.componentInstance.select();

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			expect(fixture.componentInstance.select().itemsList.markedItem.value).toEqual({ name: 'Beijing', id: 3 });

			fixture.componentInstance.selectedCity = { name: 'New city', id: 5 };
			await tickAndDetectChanges(fixture);
			fixture.componentInstance.cities = [...fixture.componentInstance.cities];
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().itemsList.markedItem.value).toEqual({ name: 'New York', id: 1 });
		});

		it('should bind to custom object properties', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            [(ngModel)]="selectedCityId">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.selectedCityId).toEqual(1);

			fixture.componentInstance.selectedCityId = 2;
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					value: fixture.componentInstance.cities[1],
				}),
			]);
		});

		it('should bind to nested label property', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="countries"
                            bindLabel="description.name"
                            [(ngModel)]="selectedCountry">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 1);
			fixture.detectChanges();
			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					label: 'USA',
					value: fixture.componentInstance.countries[1],
				}),
			]);

			fixture.componentInstance.selectedCountry = fixture.componentInstance.countries[0];
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					label: 'Lithuania',
					value: fixture.componentInstance.countries[0],
				}),
			]);
		});

		it('should bind to nested value property', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="countries"
                            bindLabel="description.name"
                            bindValue="description.id"
                            [(ngModel)]="selectedCountry">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 1);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.selectedCountry).toEqual('b');

			fixture.componentInstance.selectedCountry = fixture.componentInstance.countries[2].description.id;
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					label: 'Australia',
					value: fixture.componentInstance.countries[2],
				}),
			]);

			await selectOption(fixture, KeyCode.ArrowUp, 1);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.selectedCountry).toEqual('b');
		});

		it('should bind to simple array', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="citiesNames"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.selectedCity).toBe(<any>'New York');
			fixture.componentInstance.selectedCity = <any>'London';
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					label: 'London',
					value: 'London',
				}),
			]);
		});

		it('should bind to object', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			// from component to model
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			await tickAndDetectChanges(fixture);
			expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);

			// from model to component
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.select().selectedItems).toEqual([
				expect.objectContaining({
					value: fixture.componentInstance.cities[1],
				}),
			]);
		});

		it('should use bindLabel from NgSelectConfig when bindLabel is not provided in template', async () => {
			const config = new NgSelectConfig();
			config.bindLabel = 'name';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			fixture.componentInstance.cities = [{ id: 1, name: 'New York', label: '' }];
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					label: 'New York',
				}),
			]);
		});

		it('should override bindLabel from NgSelectConfig by template-provided bindLabel property', async () => {
			const config = new NgSelectConfig();
			config.bindLabel = 'label';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			fixture.componentInstance.cities = [{ id: 1, name: 'New York', label: 'the capital of USA' }];
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					label: 'New York',
				}),
			]);
		});

		it('should bind option label to "label" property when bindLabel is not provided', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			fixture.componentInstance.cities = [{ id: 1, name: 'New York', label: 'the capital of USA' }];
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);

			select = fixture.componentInstance.select();
			expect(select.selectedItems).toEqual([
				expect.objectContaining({
					label: 'the capital of USA',
				}),
			]);
		});

		describe('ng-option', () => {
			it('should not render HTML from unknown ngModel when using ng-option', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCityId">
						<ng-option [value]="1">Yes</ng-option>
						<ng-option [value]="2">No</ng-option>
					</ng-select>`,
				);
				await tickAndDetectChanges(fixture);

				fixture.componentInstance.selectedCityId = `<img src="x" onerror="window.__xss2374=1">` as any;
				await tickAndDetectChanges(fixture);

				const labelEl = document.querySelector('.ng-value-label') as HTMLElement;
				expect(labelEl).toBeTruthy();
				expect(labelEl.querySelector('img')).toBeNull();
				expect(labelEl.textContent).toContain('<img');
			});

			it('should reset to empty array', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCityId">
						@for (city of cities; track city) {
                            <ng-option [value]="city.id">{{city.name}}</ng-option>
                        }
                    </ng-select>`,
				);

				select = fixture.componentInstance.select();
				await tickAndDetectChanges(fixture);
				expect(select.itemsList.items.length).toEqual(5);

				fixture.componentInstance.cities = [];
				await tickAndDetectChanges(fixture);
				expect(select.itemsList.items.length).toEqual(0);
			});

			it('should update ng-option when updated asynchronously', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCityId">
                        @for (city of cities; track city) {
                            <ng-option [value]="city.id">{{city.name}}</ng-option>
                        }
                    </ng-select>`,
				);
				select = fixture.componentInstance.select();
				expect(select.items().length).toEqual(5);

				fixture.componentInstance.cities = [
					{ id: 1, name: 'New York' },
					{ id: 2, name: 'London' },
				];
				await tickAndDetectChanges(fixture);
				expect(select.items().length).toEqual(2);
			});

			it('should apply ng-option host classes to the root dropdown option', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCityId">
                        @for (city of cities; track city) {
                            <ng-option [value]="city.id" [ngClass]="city.optionClass"><span>{{city.name}}</span></ng-option>
                        }
                    </ng-select>`,
				);

				fixture.componentInstance.cities = [
					{ id: 1, name: 'New York', optionClass: 'custom-city' },
					{ id: 2, name: 'London', optionClass: 'muted-city' },
				];
				await tickAndDetectChanges(fixture);
				select = fixture.componentInstance.select();
				select.open();
				await tickAndDetectChanges(fixture);
				fixture.detectChanges();

				const options = document.querySelectorAll('.ng-dropdown-panel .ng-option');
				expect(options[0].classList).toContain('custom-city');
				expect(options[1].classList).toContain('muted-city');
				expect(options[0].querySelector('span').classList).not.toContain('custom-city');
			});

			it('should bind value', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCityId">
						<ng-option [value]="1">A</ng-option>
						<ng-option [value]="2">B</ng-option>
					</ng-select>`,
				);

				// from component to model
				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.selectedCityId).toEqual(1);

				// from model to component
				fixture.componentInstance.selectedCityId = 2;
				await tickAndDetectChanges(fixture);

				expect(fixture.componentInstance.select().selectedItems).toEqual([
					expect.objectContaining({
						value: 2,
						label: 'B',
					}),
				]);
			});

			it('should not fail while resolving selected item from object', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCity">
                        <ng-option [value]="cities[0]">New York</ng-option>
                        <ng-option [value]="cities[1]">London</ng-option>
                	</ng-select>`,
				);

				const selected = { name: 'New York', id: 1 };
				fixture.componentInstance.selectedCity = selected;
				await tickAndDetectChanges(fixture);

				expect(fixture.componentInstance.select().selectedItems).toEqual([
					expect.objectContaining({
						value: selected,
						label: '',
					}),
				]);
			});

			it('should remap selected items when ng-options change while a value is selected', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [(ngModel)]="selectedCityId">
						@for (city of cities; track city.id) {
                            <ng-option [value]="city.id">{{city.name}}</ng-option>
                        }
                    </ng-select>`,
				);

				select = fixture.componentInstance.select();
				await selectOption(fixture, KeyCode.ArrowDown, 0);
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.selectedCityId).toBe(1);

				fixture.componentInstance.cities = [{ id: 99, name: 'Reykjavik' }, ...fixture.componentInstance.cities];
				await tickAndDetectChanges(fixture);

				expect(select.selectedItems.length).toBe(1);
				expect(select.selectedItems[0].value).toBe(1);
			});
		});

		it('should not set internal model when single select ngModel is not valid', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [multiple]="false"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			const invalidValues = [undefined, null];

			for (const v of invalidValues) {
				fixture.componentInstance.selectedCity = <any>v;
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().selectedItems.length).toBe(0);
			}
		});

		it('should not set internal model when multiselect ngModel is not valid', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [multiple]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			const invalidValues = [{}, '', undefined, 0, 1, 'false', 'true', false];

			for (const v of invalidValues) {
				fixture.componentInstance.selectedCity = <any>v;
				await tickAndDetectChanges(fixture);
				expect(fixture.componentInstance.select().selectedItems.length).toBe(0);
			}
		});

		describe('Pre-selected model', () => {
			describe('single', () => {
				it('should select by bindValue when primitive type', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            placeholder="select value"
                            [(ngModel)]="selectedCityId">
                        </ng-select>`,
					);

					fixture.componentInstance.selectedCityId = 2;
					await tickAndDetectChanges(fixture);
					const result = [
						expect.objectContaining({
							value: { id: 2, name: 'London' },
							selected: true,
						}),
					];
					select = fixture.componentInstance.select();
					expect(select.selectedItems).toEqual(result);
				});

				it('should apply host css classes', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            placeholder="select value"
                            [(ngModel)]="selectedCityId">
                        </ng-select>`,
					);

					fixture.componentInstance.selectedCityId = 2;
					await tickAndDetectChanges(fixture);
					await tickAndDetectChanges(fixture);

					const classes = ['ng-select', 'ng-select-single', 'ng-select-searchable'];
					const selectEl = fixture.nativeElement.querySelector('ng-select');
					for (const c of classes) {
						expect(selectEl.classList.contains(c), `expected to contain "${c}" class`).toBeTruthy();
					}
					let hasValueEl = fixture.nativeElement.querySelector('.ng-has-value');
					expect(hasValueEl).not.toBeNull();

					fixture.componentInstance.selectedCityId = null;
					await tickAndDetectChanges(fixture);
					await tickAndDetectChanges(fixture);
					hasValueEl = fixture.nativeElement.querySelector('.ng-has-value');
					expect(hasValueEl).toBeNull();
				});

				it('should select by bindValue ', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            placeholder="select value"
                            [(ngModel)]="selectedCityId">
                        </ng-select>`,
					);

					fixture.componentInstance.cities = [{ id: 0, name: 'New York' }];
					fixture.componentInstance.selectedCityId = 0;

					await tickAndDetectChanges(fixture);

					const result = [
						expect.objectContaining({
							value: { id: 0, name: 'New York' },
							selected: true,
						}),
					];
					expect(fixture.componentInstance.select().selectedItems).toEqual(result);
				});

				it('should select by bindLabel when binding to object', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            placeholder="select value"
                            [(ngModel)]="selectedCity">
                        </ng-select>`,
					);

					fixture.componentInstance.selectedCity = { id: 2, name: 'London' };
					await tickAndDetectChanges(fixture);
					const result = [
						expect.objectContaining({
							value: { id: 2, name: 'London' },
							selected: true,
						}),
					];
					expect(fixture.componentInstance.select().selectedItems).toEqual(result);
				});

				it('should select by object reference', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            placeholder="select value"
                            [(ngModel)]="selectedCity">
                        </ng-select>`,
					);

					fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
					await tickAndDetectChanges(fixture);
					const result = [
						expect.objectContaining({
							value: { id: 2, name: 'London' },
							selected: true,
						}),
					];
					expect(fixture.componentInstance.select().selectedItems).toEqual(result);
				});

				it('should select by compareWith function when bindValue is not used', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            placeholder="select value"
                            [compareWith]="compareWith"
                            [(ngModel)]="selectedCity">
                        </ng-select>`,
					);

					const city = { name: 'New York', id: 7, district: 'Ozo parkas' };
					fixture.componentInstance.cities.push(city);
					fixture.componentInstance.cities = [...fixture.componentInstance.cities];
					fixture.componentInstance.selectedCity = { name: 'New York', district: 'Ozo parkas' } as any;

					await tickAndDetectChanges(fixture);
					expect(fixture.componentInstance.select().selectedItems[0].value).toEqual(city);
				});

				it('should select by compareWith function when bindValue is used', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            placeholder="select value"
                            [compareWith]="compareWith"
                            [(ngModel)]="selectedCityId">
                        </ng-select>`,
					);

					const cmp = fixture.componentInstance;
					cmp.selectedCityId = cmp.cities[1].id.toString();

					cmp.compareWith = (city, model: string) => city.id === +model;

					await tickAndDetectChanges(fixture);
					expect(cmp.select().selectedItems[0].value).toEqual(cmp.cities[1]);
				});

				it('should call compareWith with model value when bindValue items are set after ngModel', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            [compareWith]="compareWith"
                            [(ngModel)]="selectedCityId">
                        </ng-select>`,
					);

					const cmp = fixture.componentInstance;
					cmp.cities = [];
					cmp.selectedCityId = 2;
					const compareWith = vi
						.fn()
						.mockName('compareWith')
						.mockImplementation((city, model) => city.id === model);
					cmp.compareWith = compareWith;

					await tickAndDetectChanges(fixture);

					expect(cmp.compareWith).not.toHaveBeenCalled();
					expect(cmp.select().selectedItems[0].value).toEqual({ name: null, id: 2 });

					cmp.cities = [
						{ id: 1, name: 'New York' },
						{ id: 2, name: 'London' },
					];

					await tickAndDetectChanges(fixture);

					expect(cmp.compareWith).toHaveBeenCalled();
					for (const call of vi.mocked(compareWith).mock.calls) {
						expect(call[1]).toBe(2);
					}
					expect(cmp.select().selectedItems[0].value).toEqual({ id: 2, name: 'London' });
				});

				it('should call compareWith when items are updated from empty to populated', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="itemsWithNestedBindValue"
                            bindLabel="description"
                            bindValue="item"
                            [compareWith]="compareWith"
                            [(ngModel)]="nestedSelectedItem">
                        </ng-select>`,
					);

					const cmp = fixture.componentInstance;
					const select = fixture.componentInstance.select();
					// Start with empty items and a selected item
					cmp.itemsWithNestedBindValue = [];
					cmp.nestedSelectedItem = { code: 'A', value: 'description' };
					cmp.compareWith = vi
						.fn()
						.mockName('compareWith')
						.mockImplementation((toCompare, selected) => {
							return toCompare && selected && toCompare.item && toCompare.item.code === selected.code;
						});

					await tickAndDetectChanges(fixture);

					// Initially no compareWith should be called since items is empty
					expect(cmp.compareWith).not.toHaveBeenCalled();
					expect(select.hasValue).toBe(true);
					expect(select.selectedItems.length).toBe(1);

					// Now update items to contain the matching item
					cmp.itemsWithNestedBindValue = [
						{
							description: 'alternate description',
							item: { code: 'A', value: 'description' },
							group: 'some group',
						},
					];

					await tickAndDetectChanges(fixture);

					// compareWith should be called when items are updated
					expect(cmp.compareWith).toHaveBeenCalled();

					// The selected item should be properly mapped to the new item
					expect(select.selectedItems.length).toBe(1);
					expect(select.selectedItems[0].value).toEqual({
						description: 'alternate description',
						item: { code: 'A', value: 'description' },
						group: 'some group',
					});
				});

				it('should select selected when there is no items', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            placeholder="select value"
                            [(ngModel)]="selectedCityId">
                        </ng-select>`,
					);

					fixture.componentInstance.cities = [];
					fixture.componentInstance.selectedCityId = 2;
					await tickAndDetectChanges(fixture);
					const selected = fixture.componentInstance.select().selectedItems[0];
					expect(selected.label).toEqual('');
					expect(selected.value).toEqual({ name: null, id: 2 });
				});
			});

			describe('multiple', () => {
				const result = [
					expect.objectContaining({
						value: { id: 2, name: 'London' },
						selected: true,
					}),
					expect.objectContaining({
						value: { id: 3, name: 'Beijing' },
						selected: true,
					}),
				];

				it('should select by bindValue when primitive type', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            multiple="true"
                            placeholder="select value"
                            [(ngModel)]="selectedCityIds">
                        </ng-select>`,
					);

					fixture.componentInstance.selectedCityIds = [2, 3];
					await tickAndDetectChanges(fixture);

					expect(fixture.componentInstance.select().selectedItems).toEqual(result);
				});

				it('should select by bindLabel when binding to object', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities"
                            bindLabel="name"
                            multiple="true"
                            placeholder="select value"
                            [(ngModel)]="selectedCities">
                        </ng-select>`,
					);

					fixture.componentInstance.selectedCities = [
						{ id: 2, name: 'London' },
						{ id: 3, name: 'Beijing' },
					];
					await tickAndDetectChanges(fixture);
					expect(fixture.componentInstance.select().selectedItems).toEqual(result);
				});
			});
		});
	});

	describe('Grouping', () => {
		it('should group flat items list by group key', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			const items = fixture.componentInstance.select().itemsList.items;

			expect(items.length).toBe(14);
			expect(items[0].children).toBeDefined();
			expect(items[0].index).toBe(0);
			expect(items[0].label).toBe('United States');
			expect(items[0].disabled).toBeTruthy();
			expect(items[0].value).toEqual({ country: 'United States' });

			expect(items[1].children).toBeUndefined();
			expect(items[1].parent).toBe(items[0]);

			expect(items[2].children).toBeUndefined();
			expect(items[2].parent).toBe(items[0]);

			expect(items[3].label).toBe('Argentina');
			expect(items[3].label).toBe('Argentina');

			expect(items[10].label).toBe('Colombia');
			expect(items[11].parent).toBe(items[10]);
		});

		it('should not apply ng-option class to group header elements', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);
			fixture.detectChanges();

			const optgroup = document.querySelector('.ng-dropdown-panel .ng-optgroup');
			expect(optgroup).toBeTruthy();
			expect(optgroup.classList).not.toContain('ng-option');
		});

		it('should group items with children array by group key', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="groupedAccounts"
                        groupBy="accounts"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			const items = fixture.componentInstance.select().itemsList.items;

			expect(items.length).toBe(14);
			expect(items[0].children).toBeDefined();
			expect(items[0].index).toBe(0);
			expect(items[0].disabled).toBeTruthy();
			expect(items[0].value).toEqual(expect.objectContaining({ country: 'United States' }));

			expect(items[1].children).toBeUndefined();
			expect(items[1].parent).toBe(items[0]);

			expect(items[2].children).toBeUndefined();
			expect(items[2].parent).toBe(items[0]);

			expect(items[3].value).toEqual(expect.objectContaining({ country: 'Argentina' }));

			expect(items[10].value).toEqual(expect.objectContaining({ country: 'Colombia' }));
			expect(items[11].parent).toBe(items[10]);
		});

		it('should not group items without key', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			fixture.componentInstance.accounts.push(
				<any>{
					name: 'Henry',
					email: 'henry@email.com',
					age: 10,
				},
				<any>{ name: 'Meg', email: 'meg@email.com', age: 7, country: null },
				<any>{
					name: 'Meg',
					email: 'meg@email.com',
					age: 7,
					country: '',
				},
			);
			fixture.componentInstance.accounts = [...fixture.componentInstance.accounts];
			await tickAndDetectChanges(fixture);

			const items: NgOption[] = fixture.componentInstance.select().itemsList.items;
			expect(items.length).toBe(18);
			expect(items[0].children).toBeTruthy();
			expect(items[0].parent).toBeNull();
			expect(items[14].children).toBeUndefined();
			expect(items[14].parent).toBeUndefined();
			expect(items[15].children).toBeUndefined();
			expect(items[15].parent).toBeUndefined();
			expect(items[16].children).toBeTruthy();
			expect(items[16].label).toBe('');
			expect(items[17].parent).toBeDefined();
		});

		it('should group by group fn', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        bindLabel="name"
                        [groupBy]="groupByFn"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			const items = fixture.componentInstance.select().itemsList.items;

			expect(items.length).toBe(12);
			expect(items[0].children).toBeDefined();
			expect(items[0].value.name).toBe('c1');
			expect(items[6].children).toBeDefined();
			expect(items[6].value.name).toBe('c2');
		});

		it('should set group value using custom fn', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        bindLabel="name"
                        [groupBy]="groupByFn"
                        [groupValue]="groupValueFn"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			const items = fixture.componentInstance.select().itemsList.items;

			expect(items.length).toBe(12);
			expect(items[0].children).toBeDefined();
			expect(items[0].value.group).toBe('c1');
			expect(items[6].children).toBeDefined();
			expect(items[6].value.group).toBe('c2');
		});

		it('should not mark optgroup item as marked', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindValue="name"
                        [(ngModel)]="selectedAccountName">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);

			const select = fixture.componentInstance.select();
			expect(select.itemsList.markedItem).toBeUndefined();

			select.onItemHover(select.itemsList.items[0]);
			expect(select.itemsList.markedItem).toBeUndefined();
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
			const select = fixture.componentInstance.select();
			select.filter('aDaM');

			const filteredItems = select.itemsList.filteredItems;
			expect(filteredItems.length).toBe(2);
			expect(filteredItems[0].children).toBeTruthy();
			expect(filteredItems[1].parent).toBe(filteredItems[0]);

			select.filter('not in list');
			expect(select.itemsList.filteredItems.length).toBe(0);
		});

		it('should allow select optgroup items when [selectableGroup]="true"', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        bindValue="email"
                        [selectableGroup]="true"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			expect(fixture.componentInstance.selectedAccount).toBe('United States');

			await selectOption(fixture, KeyCode.ArrowDown, 1);
			expect(fixture.componentInstance.selectedAccount).toBe('adam@email.com');
		});

		it('should select group by default when [selectableGroup]="true"', async () => {
			enableDebounceFakeTimers();
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        bindValue="email"
                        [selectableGroup]="true"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			await tickAndDetectChanges(fixture);
			select.filter('adam');
			await advanceDebounce(fixture, 200);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			expect(fixture.componentInstance.selectedAccount).toBe('United States');
			disableDebounceFakeTimers();
		});
		it('Should have class ng-select', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        bindValue="email"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			fixture.detectChanges();
			const element = fixture.elementRef.nativeElement;
			const elClasses: DOMTokenList = element.children[0].classList;
			const hasClass = elClasses.contains('ng-select');

			expect(hasClass).toBe(true);
		});
		it('Should have class ng-select and test', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        bindLabel="name"
                        bindValue="email"
                        [(ngModel)]="selectedAccount"
                        [class]="'test'">
                </ng-select>`,
			);

			fixture.detectChanges();
			const element = fixture.elementRef.nativeElement;
			const elClasses: DOMTokenList = element.children[0].classList;
			const hasClass = elClasses.contains('ng-select') && elClasses.contains('test');

			expect(hasClass).toBe(true);
		});

		it('should correctly update ng option selected property when groups map has undefined key', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="group"
                        bindLabel="name"
                        bindValue="email"
                        [(ngModel)]="selectedAccount"
                        [class]="'test'">
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();

			select.filter('Adam');
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			expect(fixture.componentInstance.selectedAccount).toBe('adam@email.com');

			select.filter('Amalie');
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			expect(fixture.componentInstance.selectedAccount).toBe('amalie@email.com');

			select.filter('A');
			expect(document.querySelectorAll('.ng-option-selected').length).toBe(1);
			expect(select.viewPortItems.filter((opt) => opt.selected).length).toBe(1);
			expect(select.viewPortItems.find((opt) => opt.selected).index).toBe(2);
			expect(select.itemsList.selectedItems.length).toBe(1);
		});

		it('should resolve selected group model through bindValue when groupValue is provided', async () => {
			const fixture = createTestingModule(
				NgSelectGroupingTestComponent,
				`<ng-select [items]="accounts"
                        groupBy="country"
                        [groupValue]="groupValueFn"
                        bindLabel="name"
                        bindValue="group"
                        [selectableGroup]="true"
                        [(ngModel)]="selectedAccount">
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			await selectOption(fixture, KeyCode.ArrowDown, 0);
			expect(fixture.componentInstance.selectedAccount).toBe('United States');
		});
	});

	describe('NgSelectModule', () => {
		it('should provide the default selection model factory when imported', () => {
			TestBed.configureTestingModule({ imports: [NgSelectModule] });

			expect(TestBed.inject(SELECTION_MODEL_FACTORY)).toBe(DefaultSelectionModelFactory);
		});
	});
});
