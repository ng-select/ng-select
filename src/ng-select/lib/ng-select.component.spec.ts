import { NgClass } from '@angular/common';
import { Component, DebugElement, ErrorHandler, Type, viewChild, ViewEncapsulation } from '@angular/core';
import { SIGNAL } from '@angular/core/primitives/signals';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNgSelectElement, getNgSelectNativeElement, selectOption, TestsErrorHandler, tickAndDetectChanges, triggerKeyDownEvent } from '../testing/helpers';
import { MockConsole } from '../testing/mocks';
import { advanceDebounce, disableDebounceFakeTimers, enableDebounceFakeTimers, openSelect } from '../testing/timer-helpers';
import { NgSelectConfig } from './config.service';
import { ConsoleService } from './console.service';
import { NgOptionComponent } from './ng-option.component';
import { AddTagFn, NgSelectComponent } from './ng-select.component';
import { NgSelectModule, provideNgSelect } from './ng-select.module';
import { KeyCode, NgOption } from './ng-select.types';
import { NgClearButtonTemplateDirective, NgFooterTemplateDirective, NgHeaderTemplateDirective, NgLabelTemplateDirective, NgLoadingSpinnerTemplateDirective, NgLoadingTextTemplateDirective, NgMultiLabelTemplateDirective, NgNotFoundTemplateDirective, NgOptgroupTemplateDirective, NgOptionTemplateDirective, NgPlaceholderTemplateDirective, NgTagTemplateDirective, NgTypeToSearchTemplateDirective } from './ng-templates.directive';

describe('NgSelectComponent', () => {
	const selectTypes = [
		{ name: 'single', classContains: 'ng-select-single', classNotContains: 'ng-select-multiple', isMultiple: false },
		{ name: 'multiple', classContains: 'ng-select-multiple', classNotContains: 'ng-select-single', isMultiple: true },
	];

	selectTypes.forEach(({ name, classContains, classNotContains, isMultiple }) => {
		describe(`Check class existence of classes on ${name} select scenario`, () => {
			let fixture: ComponentFixture<NgSelectTestComponent>;
			let componentInstance: NgSelectTestComponent;

			beforeEach(() => {
				fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [typeahead]="typeahead"
						[multiple]="${isMultiple}"
						[clearable]="clearable"
						[searchable]="searchable"
						[readonly]="readonly"
						[addTag]="addTag" />`,
				);
				componentInstance = fixture.componentInstance;
				fixture.detectChanges();

				// set default values
				componentInstance.searchable = false;
				componentInstance.clearable = false;
				fixture.detectChanges();
			});

			it('should have ng-select class on host element', () => {
				const ngSelectEl = getNgSelectNativeElement(fixture);
				expect(ngSelectEl.classList.contains('ng-select')).toBe(true);
				expect(ngSelectEl.classList.contains(classContains)).toBe(true);

				expect(ngSelectEl.classList.contains(classNotContains)).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-typeahead')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-taggable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-searchable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-clearable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-opened')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-filtered')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-disabled')).toBe(false);
			});

			it('should have ng-select-typeahead class when typeahead is true', () => {
				componentInstance.typeahead = true;
				fixture.detectChanges();

				const ngSelectEl = getNgSelectNativeElement(fixture);
				expect(ngSelectEl.classList.contains('ng-select')).toBe(true);
				expect(ngSelectEl.classList.contains('ng-select-typeahead')).toBe(true);
				expect(ngSelectEl.classList.contains(classContains)).toBe(true);

				expect(ngSelectEl.classList.contains(classNotContains)).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-taggable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-searchable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-clearable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-opened')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-filtered')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-disabled')).toBe(false);
			});

			it('should have appropriate ng-select-typeahead when taggable is true', () => {
				componentInstance.addTag = () => 'new tag';
				fixture.detectChanges();

				const ngSelectEl = getNgSelectNativeElement(fixture);
				expect(ngSelectEl.classList.contains('ng-select')).toBe(true);
				expect(ngSelectEl.classList.contains('ng-select-taggable')).toBe(true);
				expect(ngSelectEl.classList.contains(classContains)).toBe(true);

				expect(ngSelectEl.classList.contains(classNotContains)).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-typeahead')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-searchable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-clearable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-opened')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-filtered')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-disabled')).toBe(false);
			});

			it('should have appropriate ng-select-typeahead when searchable is true', () => {
				componentInstance.searchable = true;
				fixture.detectChanges();

				const ngSelectEl = getNgSelectNativeElement(fixture);
				expect(ngSelectEl.classList.contains('ng-select')).toBe(true);
				expect(ngSelectEl.classList.contains('ng-select-searchable')).toBe(true);
				expect(ngSelectEl.classList.contains(classContains)).toBe(true);

				expect(ngSelectEl.classList.contains(classNotContains)).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-typeahead')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-taggable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-clearable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-opened')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-filtered')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-disabled')).toBe(false);
			});

			it('should have appropriate ng-select-typeahead when clearable is true', () => {
				componentInstance.clearable = true;
				fixture.detectChanges();

				const ngSelectEl = getNgSelectNativeElement(fixture);
				expect(ngSelectEl.classList.contains('ng-select')).toBe(true);
				expect(ngSelectEl.classList.contains('ng-select-clearable')).toBe(true);
				expect(ngSelectEl.classList.contains(classContains)).toBe(true);

				expect(ngSelectEl.classList.contains(classNotContains)).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-typeahead')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-taggable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-searchable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-opened')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-filtered')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-disabled')).toBe(false);
			});

			it('should have appropriate ng-select-typeahead when disabled is true', () => {
				componentInstance.readonly = true;
				fixture.detectChanges();

				const ngSelectEl = getNgSelectNativeElement(fixture);
				expect(ngSelectEl.classList.contains('ng-select')).toBe(true);
				expect(ngSelectEl.classList.contains('ng-select-disabled')).toBe(true);
				expect(ngSelectEl.classList.contains(classContains)).toBe(true);

				expect(ngSelectEl.classList.contains(classNotContains)).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-typeahead')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-taggable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-searchable')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-opened')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-filtered')).toBe(false);
				expect(ngSelectEl.classList.contains('ng-select-clearable')).toBe(false);
			});
		});
	});

	describe('Appearance', () => {
		it('should add fill appearance class on select container', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select appearance="fill"></ng-select>`);

			const ngSelectContainer: HTMLElement = fixture.nativeElement.querySelector('.ng-select-container');
			expect(ngSelectContainer.classList.contains('ng-appearance-fill')).toBe(true);
			expect(ngSelectContainer.classList.contains('ng-appearance-outline')).toBe(false);
		});

		it('should add outline appearance class on select container', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select appearance="outline"></ng-select>`);

			const ngSelectContainer: HTMLElement = fixture.nativeElement.querySelector('.ng-select-container');
			expect(ngSelectContainer.classList.contains('ng-appearance-outline')).toBe(true);
			expect(ngSelectContainer.classList.contains('ng-appearance-fill')).toBe(false);
		});
	});

	describe('Input attributes', () => {
		it('should update search input attributes when inputAttrs binding changes', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" [inputAttrs]="inputAttrs"></ng-select>`);

			await tickAndDetectChanges(fixture);

			const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
			expect(input.getAttribute('aria-invalid')).toBe('false');

			fixture.componentInstance.inputAttrs = { 'aria-invalid': 'true' };
			await tickAndDetectChanges(fixture);

			expect(input.getAttribute('aria-invalid')).toBe('true');
		});

		it('should update search input attributes when inputAttrs signal is set programmatically', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" [inputAttrs]="inputAttrs"></ng-select>`);

			await tickAndDetectChanges(fixture);

			const select = fixture.componentInstance.select();
			const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

			select.inputAttrs.set({ 'aria-invalid': 'true' });
			await tickAndDetectChanges(fixture);

			expect(input.getAttribute('aria-invalid')).toBe('true');
		});
	});

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

			const options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
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

				const options = fixture.debugElement.nativeElement.querySelectorAll('.ng-dropdown-panel .ng-option');
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
			let options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
			expect(options.length).toBe(5);
			expect(options[0].innerText).toBe('New York');
			expect(options[1].innerText).toBe('London');
			expect(options[2].innerText).toBe('Beijing');

			fixture.componentInstance.cities = Array.from(Array(30).keys()).map((_, i) => ({
				id: i,
				name: String.fromCharCode(97 + i),
			}));
			await tickAndDetectChanges(fixture);
			options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
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
			const options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
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
			let options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
			expect(options.length).toBe(5);
			expect(options[0].innerText).toBe('New York');
			expect(options[1].innerText).toBe('London');
			expect(options[2].innerText).toBe('Beijing');

			fixture.componentInstance.cities = Array.from(Array(30).keys()).map((_, i) => ({
				id: i,
				name: String.fromCharCode(97 + i),
			}));
			await tickAndDetectChanges(fixture);
			options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
			expect(options.length).toBe(15);
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

			const options = document.querySelectorAll('.ng-option');
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

			const options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
			const marked = fixture.debugElement.nativeElement.querySelector('.ng-option-marked');

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
			const el: HTMLElement = fixture.debugElement.nativeElement;

			cmp.select().open();
			await tickAndDetectChanges(fixture);

			cmp.cities = Array.from(Array(30).keys()).map((_, i) => ({ id: i, name: String.fromCharCode(97 + i) }));
			await tickAndDetectChanges(fixture);

			cmp.select().dropdownPanel().scrollTo(cmp.select().itemsList.items[1]);
			await tickAndDetectChanges(fixture);

			const panelItems = el.querySelector('.ng-dropdown-panel-items');
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
			const el: HTMLElement = fixture.debugElement.nativeElement;

			cmp.cities = Array.from(Array(30).keys()).map((_, i) => ({ id: i, name: String.fromCharCode(97 + i) }));
			await openSelect(cmp.select(), fixture);

			cmp.select().dropdownPanel().scrollTo(cmp.select().itemsList.items[15]);
			await tickAndDetectChanges(fixture);

			const panelItems = el.querySelector('.ng-dropdown-panel-items');
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
			fixture.detectChanges();

			await fixture.whenStable();
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

			await fixture.whenStable();
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
			fixture.detectChanges();

			await fixture.whenStable();
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
			fixture.detectChanges();

			await fixture.whenStable();
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown).toBeNull();
		});

		it('should set aria-label on the inner listbox element when ariaLabelDropdown input is provided', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" ariaLabelDropdown="Custom Aria Label" />`);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			// The dropdown panel itself should NOT have aria-label directly
			const dropdownPanel = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel');
			expect(dropdownPanel.getAttribute('aria-label')).toBeNull();

			// The inner element with role="listbox" should have the aria-label
			const listboxElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel-items[role="listbox"]');
			expect(listboxElement.getAttribute('aria-label')).toBe('Custom Aria Label');
		});

		it('should use ariaLabelDropdown from NgSelectConfig when not provided in template', async () => {
			const config = new NgSelectConfig();
			config.ariaLabelDropdown = 'Global Aria Label';
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" />`, config);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			const listboxElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel-items[role="listbox"]');
			expect(listboxElement.getAttribute('aria-label')).toBe('Global Aria Label');
		});

		it('should override ariaLabelDropdown from NgSelectConfig when provided in template', async () => {
			const config = new NgSelectConfig();
			config.ariaLabelDropdown = 'Global Aria Label';
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" ariaLabelDropdown="Template Aria Label" />`, config);

			const select = fixture.componentInstance.select();
			select.open();
			await tickAndDetectChanges(fixture);

			const listboxElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel-items[role="listbox"]');
			expect(listboxElement.getAttribute('aria-label')).toBe('Template Aria Label');
		});

		describe('Popover', () => {
			it('should have popover input with default value false', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

				const select = fixture.componentInstance.select();
				expect(select.popover()).toBe(false);
			});

			it('should pass popover false to dropdown panel by default', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name"></ng-select>`);

				const select = fixture.componentInstance.select();
				select.open();
				await tickAndDetectChanges(fixture);

				const dropdownPanel = select.dropdownPanel();
				expect(dropdownPanel.popover()).toBe(false);

				const panelElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel');
				expect(panelElement?.matches(':popover-open')).toBe(false);
			});

			it('should pass popover true to dropdown panel when set to true', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [popover]="true"></ng-select>`);

				const select = fixture.componentInstance.select();
				expect(select.popover()).toBe(true);

				await openSelect(select, fixture);

				const dropdownPanel = select.dropdownPanel();
				expect(dropdownPanel.popover()).toBe(true);

				const panelElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel');
				expect(panelElement?.matches(':popover-open')).toBe(true);
			});

			it('should pass popover false to dropdown panel when explicitly set to false', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [popover]="false"></ng-select>`);

				const select = fixture.componentInstance.select();
				expect(select.popover()).toBe(false);

				select.open();
				await tickAndDetectChanges(fixture);

				const dropdownPanel = select.dropdownPanel();
				expect(dropdownPanel.popover()).toBe(false);

				const panelElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel');
				expect(panelElement?.matches(':popover-open')).toBe(false);
			});

			it('should toggle popover value dynamically', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [popover]="popoverEnabled"></ng-select>`);

				const component = fixture.componentInstance as any;
				component.popoverEnabled = false;
				fixture.detectChanges();

				let select = fixture.componentInstance.select();
				expect(select.popover()).toBe(false);

				component.popoverEnabled = true;
				fixture.detectChanges();

				select = fixture.componentInstance.select();
				expect(select.popover()).toBe(true);

				await openSelect(select, fixture);

				const dropdownPanel = select.dropdownPanel();
				expect(dropdownPanel.popover()).toBe(true);

				const panelElement = fixture.debugElement.nativeElement.querySelector('.ng-dropdown-panel');
				expect(panelElement?.matches(':popover-open')).toBe(true);
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
						observe() { }
						disconnect = disconnectSpy;
					};
				});

				afterEach(() => {
					(globalThis as any).ResizeObserver = originalResizeObserver;
				});

				it('should update dropdown Y and X position when select element resizes', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [popover]="true" [closeOnSelect]="false" [(ngModel)]="selectedCities"></ng-select>`,
					);
					await tickAndDetectChanges(fixture);

					const select = fixture.componentInstance.select();
					await openSelect(select, fixture);

					const dropdownPanel = select.dropdownPanel();
					const updateXSpy = vi.spyOn(dropdownPanel as any, '_updateXPosition');
					const updateYSpy = vi.spyOn(dropdownPanel as any, '_updateYPosition');

					observerCallback();
					await tickAndDetectChanges(fixture);

					expect(updateXSpy).toHaveBeenCalled();
					expect(updateYSpy).toHaveBeenCalled();
				});

				it('should not register ResizeObserver when popover is false', async () => {
					observerCallback = undefined;

					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [popover]="false" [closeOnSelect]="false" [(ngModel)]="selectedCities"></ng-select>`,
					);
					await tickAndDetectChanges(fixture);

					const select = fixture.componentInstance.select();
					select.open();
					await tickAndDetectChanges(fixture);

					expect(observerCallback).toBeUndefined();
				});

				it('should disconnect ResizeObserver when component is destroyed', async () => {
					const fixture = createTestingModule(
						NgSelectTestComponent,
						`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [popover]="true" [closeOnSelect]="false" [(ngModel)]="selectedCities"></ng-select>`,
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
			const partialFixture = TestBed.createComponent(NgSelectTestComponent);
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
			const panelClasses = (<HTMLElement>fixture.nativeElement).querySelector('.ng-dropdown-panel').classList;
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

	describe('Custom templates', () => {
		it('should display custom header template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ng-label-tmp let-item="item">
                        <div class="custom-header">{{item.name}}</div>
                    </ng-template>
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			const el = fixture.debugElement.query(By.css('.custom-header'));
			expect(el).not.toBeNull();
			expect(el.nativeElement).not.toBeNull();
		});

		it('should clear item using value', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="city">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			fixture.detectChanges();
			expect(fixture.componentInstance.select().selectedItems.length).toBe(1);

			fixture.componentInstance.select().clearItem(fixture.componentInstance.cities[0]);
			expect(fixture.componentInstance.select().selectedItems.length).toBe(0);
			await fixture.whenStable();
		});

		it('should clear item even if there are no items loaded', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await selectOption(fixture, KeyCode.ArrowDown, 0);
			fixture.detectChanges();
			expect(fixture.componentInstance.select().selectedItems.length).toBe(1);
			const selected = fixture.componentInstance.selectedCity;
			fixture.componentInstance.cities = [];
			fixture.detectChanges();

			fixture.componentInstance.select().clearItem(selected);
			expect(fixture.componentInstance.select().selectedItems.length).toBe(0);
			await fixture.whenStable();
		});

		it('should display custom dropdown option template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ng-option-tmp let-item="item">
                        <div class="custom-option">{{item.name}}</div>
                    </ng-template>
                </ng-select>`,
			);

			fixture.componentInstance.select().open();
			fixture.detectChanges();

			await fixture.whenStable();
			const el = fixture.debugElement.query(By.css('.custom-option')).nativeElement;
			expect(el).not.toBeNull();
		});

		it('should display custom multiple label template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" [multiple]="true" [(ngModel)]="selectedCities">
                    <ng-template ng-multi-label-tmp let-items="items">
                        <div class="custom-multi-label">selected {{items.length}}</div>
                    </ng-template>
                </ng-select>`,
			);

			fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			const el = fixture.debugElement.query(By.css('.custom-multi-label')).nativeElement;
			expect(el.innerHTML).toBe('selected 1');
		});

		it('should display custom footer and header template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ng-header-tmp>
                        <span class="header-label">header</span>
                    </ng-template>
                    <ng-template ng-footer-tmp>
                        <span class="footer-label">footer</span>
                    </ng-template>
                </ng-select>`,
			);

			fixture.componentInstance.select().open();
			fixture.detectChanges();

			await fixture.whenStable();
			const header = fixture.debugElement.query(By.css('.header-label')).nativeElement;
			expect(header.innerHTML).toBe('header');

			const footer = fixture.debugElement.query(By.css('.footer-label')).nativeElement;
			expect(footer.innerHTML).toBe('footer');
		});

		it('should display custom tag template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities" [(ngModel)]="selectedCity" [addTag]="true">
                    <ng-template ng-tag-tmp let-search="searchTerm">
                        <span class="tag-template">{{searchTerm}}</span>
                    </ng-template>
                </ng-select>`,
			);

			const select = fixture.componentInstance.select();
			select.filter('tag');
			select.open();
			fixture.detectChanges();

			await fixture.whenStable();
			const template = fixture.debugElement.query(By.css('.tag-template')).nativeElement;
			expect(template).toBeDefined();
		});

		it('should display custom loading and no data found template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            [loading]="citiesLoading"
                            [(ngModel)]="selectedCity">

                    <ng-template ng-notfound-tmp let-searchTerm="searchTerm">
                        <div class="custom-notfound">
                            No data found for "{{searchTerm}}"
                        </div>
                    </ng-template>
                    <ng-template ng-loadingtext-tmp let-searchTerm="searchTerm">
                        <div class="custom-loading">
                            Fetching Data for "{{searchTerm}}"
                        </div>
                    </ng-template>
                </ng-select>`,
			);

			await fixture.whenStable();
			fixture.componentInstance.cities = [];
			fixture.componentInstance.citiesLoading = true;
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			const loadingOption = fixture.debugElement.queryAll(By.css('.custom-loading'));
			expect(loadingOption.length).toBe(1);

			fixture.componentInstance.citiesLoading = false;
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			const notFoundOptions = fixture.debugElement.queryAll(By.css('.custom-notfound'));
			expect(notFoundOptions.length).toBe(1);
		});

		it('should display custom type for search template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            [typeahead]="filter"
                            [(ngModel)]="selectedCity">
                    <ng-template ng-typetosearch-tmp>
                        <div class="custom-typeforsearch">
                            Start typing...
                        </div>
                    </ng-template>

                </ng-select>`,
			);

			await fixture.whenStable();
			fixture.componentInstance.cities = [];
			fixture.componentInstance.select().open();
			fixture.componentInstance.filter.subscribe();
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			const loadingOption = fixture.debugElement.queryAll(By.css('.custom-typeforsearch'));
			expect(loadingOption.length).toBe(1);
		});

		it('should display custom loading spinner template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            [loading]="true"
                            [(ngModel)]="selectedCity">

                    <ng-template ng-loadingspinner-tmp>
                        <div class="custom-loadingspinner">
                            Custom loading spinner
                        </div>
                    </ng-template>
                </ng-select>`,
			);

			await fixture.whenStable();
			await tickAndDetectChanges(fixture);
			const spinner = fixture.debugElement.queryAll(By.css('.custom-loadingspinner'));
			expect(spinner.length).toBe(1);
		});

		it('should update ng-option state', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity">
                    <ng-option [disabled]="disabled" [value]="true">Yes</ng-option>
                    <ng-option [value]="false">No</ng-option>
                </ng-select>`,
			);

			await tickAndDetectChanges(fixture);
			const itemsList = fixture.componentInstance.select().itemsList;
			expect(itemsList.items[0].disabled).toBeFalsy();
			fixture.componentInstance.disabled = true;
			await tickAndDetectChanges(fixture);
			expect(itemsList.items[0].disabled).toBeTruthy();
		});

		it('should display custom clear button template when selected city', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            [loading]="true"
                            [(ngModel)]="selectedCity">

                    <ng-template ng-clearbutton-tmp>
                        <div class="custom-clearbutton">
                            Custom clear button
                        </div>
                    </ng-template>
                </ng-select>`,
			);

			await fixture.whenStable();
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);
			const clear = fixture.debugElement.queryAll(By.css('.custom-clearbutton'));
			expect(clear.length).toBe(1);
		});

		it('should clear selected value when clicking custom clear button template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="name"
                            [(ngModel)]="selectedCity">

                    <ng-template ng-clearbutton-tmp>
                        <div class="custom-clearbutton">
                            <span class="clear-text">Clear</span>
                        </div>
                    </ng-template>
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0].name;
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.selectedCity).toBe(fixture.componentInstance.cities[0].name);

			// Verify custom template is rendered inside the wrapper
			const clearWrapper = fixture.debugElement.query(By.css('.ng-clear-wrapper'));
			const customButton = clearWrapper.query(By.css('.custom-clearbutton'));
			expect(customButton).toBeTruthy();
			expect(customButton.nativeElement.textContent.trim()).toBe('Clear');

			// Test clicking on the wrapper clears the value
			clearWrapper.triggerEventHandler('click', createEvent({}));
			await tickAndDetectChanges(fixture);

			expect(fixture.componentInstance.selectedCity).toBeNull();
		});

		it('should display ng-placeholder template', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity">
					<ng-template ng-placeholder-tmp>
						<div class="placeholder-template">Select your city</div>
					</ng-template>
                </ng-select>`,
			);

			fixture.componentInstance.selectedCity = undefined;
			await tickAndDetectChanges(fixture);
			expect(fixture.debugElement.query(By.css('.placeholder-template')).nativeElement.innerHTML).toBe('Select your city');
			expect(fixture.debugElement.query(By.css('.ng-placeholder'))).toBeFalsy();
		});

		it('should display ng-placeholder if an item is selected', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity" 
														 [items]="cities" bindLabel="name" 
														 fixedPlaceholder="true"
														 placeholder="testPlaceholder">			
                  </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			expect(fixture.debugElement.query(By.css('.ng-placeholder'))).toBeTruthy();
		});

		it('should not display ng-placeholder if an item is selected', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity"
														 [fixedPlaceholder]="false"
														 [items]="cities" bindLabel="name"
														 placeholder="testPlaceholder">
                  </ng-select>`,
			);

			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			expect(fixture.debugElement.query(By.css('.ng-placeholder'))).toBeFalsy();
		});

		it('should update ng-option label', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity">
                    <ng-option [disabled]="disabled" [value]="true">{{label}}</ng-option>
                    <ng-option [value]="false">No</ng-option>
                </ng-select>`,
			);

			fixture.componentInstance.label = 'Indeed';
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);
			const items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].label).toBe('Indeed');
		});

		it('should update ng-option label after async change (delayed)', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity">
					<ng-option [value]="true">{{label}}</ng-option>
					<ng-option [value]="false">No</ng-option>
				</ng-select>`,
			);

			fixture.componentInstance.label = '';
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			let items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].label).toBe('');

			// Simulate delayed async update (e.g., translation loaded later or signal update)
			fixture.componentInstance.label = 'worked';
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].label).toBe('worked');
		});

		it('should update ng-option value after async change (delayed)', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [(ngModel)]="selectedCity">
					<ng-option [value]="cityValue">{{label}}</ng-option>
					<ng-option [value]="false">No</ng-option>
				</ng-select>`,
			);

			// Start with initial value
			fixture.componentInstance.cityValue = 'initial';
			fixture.componentInstance.label = 'Initial Label';
			fixture.detectChanges();
			await fixture.whenStable(); // Flush pending effects

			let items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].value).toBe('initial');
			expect(items[0].label).toBe('Initial Label');

			// Simulate delayed async update of value attribute
			fixture.componentInstance.cityValue = 'updated';
			fixture.componentInstance.label = 'Updated Label';
			fixture.detectChanges();
			await fixture.whenStable(); // Flush pending effects

			items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].value).toBe('updated');
			expect(items[0].label).toBe('Updated Label');
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

			await selectOption(fixture, KeyCode.ArrowUp, 2);
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
				await selectOption(fixture, KeyCode.ArrowDown, 1);
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

				await selectOption(fixture, KeyCode.ArrowUp, 2);
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

				await selectOption(fixture, KeyCode.ArrowUp, 2);
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
			await fixture.whenStable();
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

	describe('Placeholder', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		beforeEach(() => {
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                    bindLabel="name"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`,
			);
		});

		it('should be visible when no value selected', async () => {
			await tickAndDetectChanges(fixture);
			const element = fixture.componentInstance.select().element;
			const placeholder: any = element.querySelector('.ng-placeholder');
			expect(placeholder.innerText).toBe('select value');
			expect(getComputedStyle(placeholder).display).toBe('block');
		});

		it('should be visible when value was cleared', async () => {
			const select = fixture.componentInstance.select();
			fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);
			const element = fixture.componentInstance.select().element;
			const ngControl = element.querySelector('.ng-select-container');

			expect(ngControl.classList.contains('ng-has-value')).toBeTruthy();

			select.handleClearClick();
			await tickAndDetectChanges(fixture);
			await tickAndDetectChanges(fixture);

			const placeholder = element.querySelector('.ng-placeholder');
			expect(ngControl.classList.contains('ng-has-value')).toBeFalsy();
			expect(getComputedStyle(placeholder).display).toBe('block');
		});

		it('should contain .ng-has-value when value was selected', async () => {
			await tickAndDetectChanges(fixture);
			const element = fixture.componentInstance.select().element;
			const ngControl = element.querySelector('.ng-select-container');
			await selectOption(fixture, KeyCode.ArrowDown, 2);
			await tickAndDetectChanges(fixture);
			expect(ngControl.classList.contains('ng-has-value')).toBeTruthy();
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
			await fixture.whenStable();

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
			await fixture.whenStable();
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

			it('should update the typeahead term when the search is cleared on add', async () => {
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

				let lastEmittedSearchTerm = '';
				fixture.componentInstance.filter.subscribe((value) => {
					lastEmittedSearchTerm = value;
				});
				fixture.componentInstance.cities = [
					{ id: 4, name: 'New York' },
					{ id: 5, name: 'California' },
				];
				await tickAndDetectChanges(fixture);
				fixture.componentInstance.select().filter('new');
				expect(lastEmittedSearchTerm).toBe('new');
				fixture.componentInstance.select().select(fixture.componentInstance.select().viewPortItems[0]);
				expect(lastEmittedSearchTerm).toBe(null);
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
				const firstOption = select.element.querySelector('.ng-dropdown-panel .ng-option');
				expect(firstOption.innerHTML).toEqual(selectConfig.notFoundText);
				input.blur();
				select.close();
				await tickAndDetectChanges(fixture);
				expect(select.isOpen()).toBeFalsy();
				input.value = '';
				input.focus();
				input.dispatchEvent(new Event('input'));
				await tickAndDetectChanges(fixture);
				const allOptions = select.element.querySelectorAll('.ng-dropdown-panel .ng-option');
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

	describe('Accessibility', () => {
		let fixture: ComponentFixture<NgSelectTestComponent>;
		let select: NgSelectComponent;
		let input: HTMLInputElement;
		let comboBoxDiv: HTMLDivElement;

		beforeEach(async () => {
			fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        labelForId="lbl"
                        (change)="onChange($event)"
                        notFoundText="No items found (aria-live)"
                        bindLabel="name">
                </ng-select>`,
			);
			select = fixture.componentInstance.select();
			input = fixture.debugElement.query(By.css('input')).nativeElement;
			comboBoxDiv = fixture.debugElement.query(By.css('.ng-input')).nativeElement;
		});

		it('should set aria-activedescendant absent at start', async () => {
			expect(input.hasAttribute('aria-activedescendant')).toBe(false);
		});

		it('should set aria-expanded to false at start', async () => {
			expect(input.getAttribute('aria-expanded')).toBe('false');
		});

		it('should set aria-expanded to true on open', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);

			expect(input.getAttribute('aria-expanded')).toBe('true');
		});

		it('should set aria-controls absent at start', async () => {
			expect(input.hasAttribute('aria-controls')).toBe(false);
		});

		it('should set aria-controls to dropdownId on open', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);

			expect(input.getAttribute('aria-controls')).toBe(select.dropdownId);
		});

		it('should set aria-activedecendant equal to chosen item on open', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			expect(input.getAttribute('aria-activedescendant')).toBe(select.itemsList.markedItem.htmlId);
		});

		it('should set aria-activedecendant equal to chosen item on arrow down', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
			await tickAndDetectChanges(fixture);
			expect(input.getAttribute('aria-activedescendant')).toBe(select.itemsList.markedItem.htmlId);
		});

		it('should set aria-activedecendant equal to chosen item on arrow up', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowUp);
			await tickAndDetectChanges(fixture);
			expect(input.getAttribute('aria-activedescendant')).toBe(select.itemsList.markedItem.htmlId);
		});

		it('should set aria-activedescendant absent on dropdown close', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
			await tickAndDetectChanges(fixture);
			expect(input.hasAttribute('aria-activedescendant')).toBe(false);
		});

		it('should add labelForId on filter input id attribute', async () => {
			await tickAndDetectChanges(fixture);
			expect(input.getAttribute('id')).toEqual('lbl');
		});

		it('should show undefined for aria-label on input element', () => {
			expect(input.getAttribute('aria-label')).toBe(null);
		});

		it('should set aria-label on input element', () => {
			input.setAttribute('aria-label', 'test');
			expect(input.getAttribute('aria-label')).toBe('test');
		});

		it('should announce notFoundText in aria-live region when dropdown is open and no items match', async () => {
			const select = fixture.componentInstance.select();

			// Open dropdown
			select.open();
			await tickAndDetectChanges(fixture);

			// Filter to a non-existent item
			select.filter('not-in-list');
			await tickAndDetectChanges(fixture);

			const notFoundText = fixture.componentInstance.select().notFoundText();
			expect(notFoundText).toBe('No items found (aria-live)');
		});
	});

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

	describe('Append to', () => {
		it('should append dropdown to body', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`<ng-select [items]="cities"
                        appendTo="body"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown.parentElement).toBe(document.body);
			expect(dropdown.style.top).not.toBe('0px');
			expect(dropdown.style.left).toBe('0px');
		});

		it('should append dropdown to custom selector', async () => {
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
			expect(dropdown.style.top).not.toBe('0px');
			expect(dropdown.style.left).toBe('0px');
		});

		it('should set correct dropdown panel horizontal position and width when appended to custom selector', async () => {
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container" style="position: relative; overflow: auto; width: 200px; height: 200px">
                    <div style="height: 100%">
                        <ng-select [items]="cities"
                            appendTo=".container"
                            bindLabel="name"
                            style="width: 50%; margin-left: auto"
                            [(ngModel)]="selectedCity">
                        </ng-select>
                    </div>
                </div>`,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
			expect(dropdown.style.left).toBe('100px');
			expect(dropdown.style.width).toBe('100px');
		});

		it('should apply global appendTo from NgSelectConfig', async () => {
			const config = new NgSelectConfig();
			config.appendTo = 'body';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container"></div>
                <ng-select [items]="cities"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const dropdown = <HTMLElement>document.querySelector('.ng-dropdown-panel');
			expect(dropdown.parentElement).toBe(document.body);
			expect(dropdown.style.top).not.toBe('0px');
			expect(dropdown.style.left).toBe('0px');
		});

		it('should not apply global appendTo from NgSelectConfig if appendTo prop explicitly provided in template', async () => {
			const config = new NgSelectConfig();
			config.appendTo = 'body';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container"></div>
                <ng-select [items]="cities"
                        appendTo=".container"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			await openSelect(fixture.componentInstance.select(), fixture);
			const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
			expect(dropdown.style.top).not.toBe('0px');
			expect(dropdown.style.left).toBe('0px');
		});

		it('should pass static classes into dropdown panel when appendTo is specified', async () => {
			const config = new NgSelectConfig();
			config.appendTo = 'body';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container"></div>
                <ng-select [items]="cities"
                        class="someClass"
                        appendTo=".container"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			fixture.componentInstance.select().open();
			fixture.detectChanges();

			await fixture.whenStable();
			const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
			expect(dropdown.classList.contains('someClass')).toBe(true);
		});

		it('should pass ngClass classes into dropdown panel when appendTo is specified', async () => {
			const config = new NgSelectConfig();
			config.appendTo = 'body';
			const fixture = createTestingModule(
				NgSelectTestComponent,
				`
                <div class="container"></div>
                <ng-select [items]="cities"
                        [ngClass]="{ someClass: visible }"
                        appendTo=".container"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
				config,
			);

			fixture.componentInstance.visible = true;
			fixture.componentInstance.select().open();
			fixture.detectChanges();

			await fixture.whenStable();
			const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
			expect(dropdown.classList.contains('someClass')).toBe(true);

			fixture.componentInstance.visible = false;
			fixture.detectChanges();

			expect(dropdown.classList.contains('someClass')).toBe(false);
		});
	});
	it('should pass static classes into dropdown panel when appendTo is specified', async () => {
		const config = new NgSelectConfig();
		config.appendTo = 'body';
		const fixture = createTestingModule(
			NgSelectTestComponent,
			`
                <div class="container"></div>
                <ng-select [items]="cities"
                        class="someClass"
                        appendTo=".container"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			config,
		);

		fixture.componentInstance.select().open();
		fixture.detectChanges();

		await fixture.whenStable();
		const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
		expect(dropdown.classList.contains('someClass')).toBe(true);
	});

	it('should pass ngClass classes into dropdown panel when appendTo is specified', async () => {
		const config = new NgSelectConfig();
		config.appendTo = 'body';
		const fixture = createTestingModule(
			NgSelectTestComponent,
			`
                <div class="container"></div>
                <ng-select [items]="cities"
                        [ngClass]="{ someClass: visible }"
                        appendTo=".container"
                        [(ngModel)]="selectedCity">
                </ng-select>`,
			config,
		);

		fixture.componentInstance.visible = true;
		fixture.componentInstance.select().open();
		fixture.detectChanges();

		await fixture.whenStable();
		const dropdown = <HTMLElement>document.querySelector('.container .ng-dropdown-panel');
		expect(dropdown.classList.contains('someClass')).toBe(true);

		fixture.componentInstance.visible = false;
		fixture.detectChanges();

		expect(dropdown.classList.contains('someClass')).toBe(false);
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
		const nativeElement: HTMLElement = fixture.nativeElement as HTMLElement;

		select.filter('Adam');
		await selectOption(fixture, KeyCode.ArrowDown, 0);
		expect(fixture.componentInstance.selectedAccount).toBe('adam@email.com');

		select.filter('Amalie');
		await selectOption(fixture, KeyCode.ArrowDown, 0);
		expect(fixture.componentInstance.selectedAccount).toBe('amalie@email.com');

		select.filter('A');
		expect(nativeElement.querySelectorAll('.ng-option-selected').length).toBe(1);
		expect(select.viewPortItems.filter((opt) => opt.selected).length).toBe(1);
		expect(select.viewPortItems.find((opt) => opt.selected).index).toBe(2);
		expect(select.itemsList.selectedItems.length).toBe(1);
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

function createTestingModule<T>(cmp: Type<T>, template: string, customNgSelectConfig: NgSelectConfig | null = null): ComponentFixture<T> {
	TestBed.configureTestingModule({
		providers: [
			{ provide: ErrorHandler, useClass: TestsErrorHandler },
			{ provide: ConsoleService, useFactory: () => new MockConsole() },
			...provideNgSelect(),
		],
	}).overrideComponent(cmp, {
		set: {
			template,
			imports: [
				NgClass,
				FormsModule,
				NgSelectComponent,
				NgOptionComponent,
				NgOptgroupTemplateDirective,
				NgOptionTemplateDirective,
				NgLabelTemplateDirective,
				NgMultiLabelTemplateDirective,
				NgHeaderTemplateDirective,
				NgFooterTemplateDirective,
				NgPlaceholderTemplateDirective,
				NgNotFoundTemplateDirective,
				NgTypeToSearchTemplateDirective,
				NgLoadingTextTemplateDirective,
				NgTagTemplateDirective,
				NgLoadingSpinnerTemplateDirective,
				NgClearButtonTemplateDirective,
			],
		},
	});

	if (customNgSelectConfig) {
		TestBed.overrideProvider(NgSelectConfig, { useValue: customNgSelectConfig });
	}

	const fixture = TestBed.createComponent(cmp);
	fixture.detectChanges();
	return fixture;
}

function createEvent(target = {}) {
	return {
		preventDefault: () => { },
		target: {
			className: '',
			tagName: '',
			classList: {
				contains: () => { },
			},
			...target,
		},
	};
}

@Component({
	template: ``,
	standalone: true,
	imports: [NgClass, NgSelectComponent, NgOptionComponent, FormsModule],
})
class NgSelectTestComponent {
	readonly select = viewChild(NgSelectComponent);
	multiple = false;
	label = 'Yes';
	clearOnBackspace = true;
	disabled = false;
	readonly = false;
	dropdownPosition = 'bottom';
	visible = true;
	minTermLength = 0;
	filter = new Subject<string>();
	searchFn: (term: string, item: any) => boolean = null;
	selectOnTab = true;
	tabFocusOnClearButton: boolean;
	hideSelected = false;
	closeOnSelect = true;
	clearable = true;
	clearKeepsDisabledOptions = true;
	markFirst = true;
	searchable = true;
	openOnEnter = undefined;
	maxSelectedItems = undefined;
	addTag: boolean | AddTagFn = false;
	typeahead = undefined;
	preventToggleOnRightClick = false;
	searchWhileComposing = true;
	popoverEnabled = false;
	inputAttrs = { 'aria-invalid': 'false' };

	citiesLoading = false;
	selectedCityId: number;
	selectedCityIds: number[];
	selectedCity: {
		id: number;
		name: string;
	};
	selectedCities: {
		id: number;
		name: string;
	}[];
	city: {
		id: number;
		name: string;
	};
	cityValue: any;
	cities: any[] = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Beijing' },
		{ id: 4, name: 'New Delhi' },
		{ id: 5, name: 'Paris' },
	];
	readonlyCities: readonly any[] = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{
			id: 3,
			name: 'Beijing',
		},
		{ id: 4, name: 'New Delhi' },
		{ id: 5, name: 'Paris' },
	] as const;
	citiesNames = this.cities.map((x) => x.name);

	selectedCountry: any;
	itemsWithNestedBindValue: any[] = [];
	nestedSelectedItem: any;
	countries = [
		{ id: 1, description: { name: 'Lithuania', id: 'a' } },
		{
			id: 2,
			description: { name: 'USA', id: 'b' },
		},
		{ id: 3, description: { name: 'Australia', id: 'c' } },
	];
	keyDownFn = () => { };

	tagFunc(term: string) {
		return { id: term, name: term, custom: true };
	}

	tagFuncPromise(term: string) {
		return Promise.resolve({
			id: 5,
			name: term,
			valid: true,
		});
	}

	compareWith(a, b) {
		return a.name === b.name && a.district === b.district;
	}

	toggleVisible() {
		this.visible = !this.visible;
	}

	onChange(_: any) { }

	onFocus(_: Event) { }

	onBlur(_: Event) { }

	onOpen() { }

	onClose() { }

	onAdd(_: Event) { }

	onRemove(_: Event) { }

	onClear() { }

	onSearch(_: any) { }

	onScroll() { }

	onScrollToEnd() { }
}

@Component({
	template: ``,
	encapsulation: ViewEncapsulation.ShadowDom,
	imports: [NgSelectModule, FormsModule],
})
class EncapsulatedTestComponent extends NgSelectTestComponent {
	readonly select = viewChild(NgSelectComponent);
}

@Component({
	template: ``,
	standalone: true,
	imports: [NgSelectComponent, NgOptionComponent, FormsModule],
})
class NgSelectGroupingTestComponent {
	readonly select = viewChild(NgSelectComponent);
	selectedAccountName = 'Adam';
	selectedAccount = null;
	accounts = [
		{
			name: 'Adam',
			email: 'adam@email.com',
			age: 12,
			country: 'United States',
			child: { name: 'c1' },
		},
		{
			name: 'Samantha',
			email: 'samantha@email.com',
			age: 30,
			country: 'United States',
			child: { name: 'c1' },
		},
		{
			name: 'Amalie',
			email: 'amalie@email.com',
			age: 12,
			country: 'Argentina',
			child: { name: 'c1' },
		},
		{
			name: 'Estefanía',
			email: 'estefania@email.com',
			age: 21,
			country: 'Argentina',
			child: { name: 'c1' },
		},
		{
			name: 'Adrian',
			email: 'adrian@email.com',
			age: 21,
			country: 'Ecuador',
			child: { name: 'c1' },
		},
		{
			name: 'Wladimir',
			email: 'wladimir@email.com',
			age: 30,
			country: 'Ecuador',
			child: { name: 'c2' },
		},
		{
			name: 'Natasha',
			email: 'natasha@email.com',
			age: 54,
			country: 'Ecuador',
			child: { name: 'c2' },
		},
		{
			name: 'Nicole',
			email: 'nicole@email.com',
			age: 43,
			country: 'Colombia',
			child: { name: 'c2' },
		},
		{
			name: 'Michael',
			email: 'michael@email.com',
			age: 15,
			country: 'Colombia',
			child: { name: 'c2' },
		},
		{ name: 'Nicolás', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { name: 'c2' } },
	];
	groupedAccounts = [
		{
			country: 'United States',
			accounts: [
				{ name: 'Adam', email: 'adam@email.com', age: 12 },
				{
					name: 'Samantha',
					email: 'samantha@email.com',
					age: 30,
				},
			],
		},
		{
			country: 'Argentina',
			accounts: [
				{ name: 'Amalie', email: 'amalie@email.com', age: 12 },
				{
					name: 'Estefanía',
					email: 'estefania@email.com',
					age: 21,
				},
			],
		},
		{
			country: 'Ecuador',
			accounts: [
				{ name: 'Adrian', email: 'adrian@email.com', age: 21 },
				{
					name: 'Wladimir',
					email: 'wladimir@email.com',
					age: 30,
				},
				{ name: 'Natasha', email: 'natasha@email.com', age: 54 },
			],
		},
		{
			country: 'Colombia',
			accounts: [
				{ name: 'Nicole', email: 'nicole@email.com', age: 43 },
				{
					name: 'Michael',
					email: 'michael@email.com',
					age: 15,
				},
				{ name: 'Nicolás', email: 'nicole@email.com', age: 43 },
			],
		},
	];

	groupByFn = (item) => item.child.name;

	groupValueFn = (key, _) => ({ group: key });
}
