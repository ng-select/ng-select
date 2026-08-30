import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { getNgSelectElement, selectOption, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { KeyCode } from '../types/ng-select.types';

import { createEvent, createTestingModule, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
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

		it('should render notched outline elements when appearance is outline', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select appearance="outline" placeholder="Select city"></ng-select>`);

			const outline: HTMLElement = fixture.nativeElement.querySelector('.ng-select-container > .ng-notched-outline');
			expect(outline).toBeTruthy();
			expect(outline.querySelector('.ng-notched-outline-leading')).toBeTruthy();
			expect(outline.querySelector('.ng-notched-outline-notch')).toBeTruthy();
			expect(outline.querySelector('.ng-notched-outline-trailing')).toBeTruthy();
		});

		it('should not render notched outline elements for other appearances', () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select placeholder="Select city"></ng-select>`);

			expect(fixture.nativeElement.querySelector('.ng-notched-outline')).toBeNull();
		});

		it('should size the outline notch to the scaled placeholder width', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select appearance="outline" placeholder="Select city"></ng-select>`);
			await tickAndDetectChanges(fixture);

			const placeholder: HTMLElement = fixture.nativeElement.querySelector('.ng-placeholder');
			Object.defineProperty(placeholder, 'offsetWidth', { value: 100 });
			await tickAndDetectChanges(fixture);

			const notch: HTMLElement = fixture.nativeElement.querySelector('.ng-notched-outline-notch');
			expect(notch.style.width).toBe('75px');
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

		it('should not set aria-controls while closed when input attributes are re-applied', async () => {
			const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" [inputAttrs]="inputAttrs"></ng-select>`);

			await tickAndDetectChanges(fixture);

			const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
			fixture.componentInstance.inputAttrs = { 'aria-invalid': 'true' };
			await tickAndDetectChanges(fixture);

			expect(input.hasAttribute('aria-controls')).toBe(false);
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
			await tickAndDetectChanges(fixture);
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
			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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

			await tickAndDetectChanges(fixture);
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
			await tickAndDetectChanges(fixture); // Flush pending effects

			let items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].value).toBe('initial');
			expect(items[0].label).toBe('Initial Label');

			// Simulate delayed async update of value attribute
			fixture.componentInstance.cityValue = 'updated';
			fixture.componentInstance.label = 'Updated Label';
			await tickAndDetectChanges(fixture); // Flush pending effects

			items = fixture.componentInstance.select().itemsList.items;
			expect(items[0].value).toBe('updated');
			expect(items[0].label).toBe('Updated Label');
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
});
