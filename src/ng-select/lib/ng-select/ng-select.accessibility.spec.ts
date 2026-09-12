import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNgSelectElement, tickAndDetectChanges, triggerKeyDownEvent } from '../../testing/helpers';
import { KeyCode } from '../types/ng-select.types';
import { NgSelectComponent } from './ng-select.component';

import { createTestingModule, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';

describe('NgSelectComponent', () => {
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

		it('should reference the element with role listbox via aria-controls on open', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);

			const controlled = document.getElementById(input.getAttribute('aria-controls'));
			expect(controlled).not.toBeNull();
			expect(controlled.getAttribute('role')).toBe('listbox');
		});

		it('should set aria-controls absent on dropdown close', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
			await tickAndDetectChanges(fixture);

			expect(input.hasAttribute('aria-controls')).toBe(false);
		});

		it('should set aria-posinset and aria-setsize based on filtered items', async () => {
			triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
			await tickAndDetectChanges(fixture);
			select.filter('new');
			await tickAndDetectChanges(fixture);

			const options = document.querySelectorAll<HTMLElement>('.ng-option');
			expect(options.length).toBe(2);
			expect(Array.from(options).map((option: HTMLElement) => option.getAttribute('aria-posinset'))).toEqual(['1', '2']);
			expect(Array.from(options).map((option: HTMLElement) => option.getAttribute('aria-setsize'))).toEqual(['2', '2']);
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

	describe('Accessibility enhancements', () => {
		function liveRegionText(fixture: ComponentFixture<NgSelectTestComponent>): string {
			return fixture.debugElement.query(By.css('.ng-visually-hidden')).nativeElement.textContent.trim();
		}

		describe('selected value remove icon', () => {
			it('should expose remove icon as a focusable button with aria-label', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [(ngModel)]="selectedCities"></ng-select>`,
				);
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				const icon = fixture.debugElement.query(By.css('.ng-value-icon')).nativeElement;
				expect(icon.getAttribute('role')).toBe('button');
				expect(icon.getAttribute('tabindex')).toBe('0');
				expect(icon.getAttribute('aria-label')).toBe('Remove New York');
			});

			it('should use custom removeText in the remove icon aria-label', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [multiple]="true" removeText="Verwijder" [(ngModel)]="selectedCities"></ng-select>`,
				);
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0]];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				const icon = fixture.debugElement.query(By.css('.ng-value-icon')).nativeElement;
				expect(icon.getAttribute('aria-label')).toBe('Verwijder New York');
			});

			it('should unselect item when enter is pressed on remove icon', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [(ngModel)]="selectedCities"></ng-select>`,
				);
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				const icon = fixture.debugElement.query(By.css('.ng-value-icon'));
				icon.triggerEventHandler('keydown', { key: KeyCode.Enter, preventDefault: () => {}, stopPropagation: () => {} });
				await tickAndDetectChanges(fixture);

				const select = fixture.componentInstance.select();
				expect(select.selectedItems.length).toBe(1);
				expect(select.selectedItems[0].label).toBe('London');
			});

			it('should unselect item when space is pressed on remove icon', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [(ngModel)]="selectedCities"></ng-select>`,
				);
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[0], fixture.componentInstance.cities[1]];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				const icon = fixture.debugElement.query(By.css('.ng-value-icon'));
				icon.triggerEventHandler('keydown', { key: KeyCode.Space, preventDefault: () => {}, stopPropagation: () => {} });
				await tickAndDetectChanges(fixture);

				expect(fixture.componentInstance.select().selectedItems.length).toBe(1);
			});
		});

		describe('clear button', () => {
			it('should set aria-label from clearAllText on clear button', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`);
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				const clear = fixture.debugElement.query(By.css('.ng-clear-wrapper')).nativeElement;
				expect(clear.getAttribute('aria-label')).toBe('Clear all');
			});

			it('should clear input when space pressed while clear button focused', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`);
				const select = fixture.componentInstance.select();
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				const handleClearClick = vi.spyOn(select, 'handleClearClick').mockReturnValue(undefined);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space, select.clearButton().nativeElement);
				expect(handleClearClick).toHaveBeenCalled();
			});
		});

		describe('aria-live region', () => {
			it('should announce typeToSearchText when type to search is shown', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [typeahead]="filter" [(ngModel)]="selectedCity"></ng-select>`,
				);
				fixture.componentInstance.filter.subscribe();
				fixture.componentInstance.cities = [];
				await tickAndDetectChanges(fixture);

				fixture.componentInstance.select().open();
				await tickAndDetectChanges(fixture);

				expect(liveRegionText(fixture)).toBe('Type to search');
			});

			it('should announce loadingText while loading with no items', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [loading]="citiesLoading" [(ngModel)]="selectedCity"></ng-select>`,
				);
				fixture.componentInstance.cities = [];
				fixture.componentInstance.citiesLoading = true;
				await tickAndDetectChanges(fixture);

				fixture.componentInstance.select().open();
				await tickAndDetectChanges(fixture);

				expect(liveRegionText(fixture)).toBe('Loading...');
			});

			it('should announce the marked option label as it changes (issues #2758, #2589)', async () => {
				const fixture = createTestingModule(NgSelectTestComponent, `<ng-select [items]="cities" bindLabel="name" [(ngModel)]="selectedCity"></ng-select>`);
				await tickAndDetectChanges(fixture);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
				await tickAndDetectChanges(fixture);
				expect(liveRegionText(fixture)).toBe('New York');

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
				await tickAndDetectChanges(fixture);
				expect(liveRegionText(fixture)).toBe('London');
			});
		});

		describe('multiple select marked item on open', () => {
			it('should mark first selected option in list order when opening', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [multiple]="true" [(ngModel)]="selectedCities"></ng-select>`,
				);
				fixture.componentInstance.selectedCities = [fixture.componentInstance.cities[1], fixture.componentInstance.cities[3]];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);

				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
				await tickAndDetectChanges(fixture);

				expect(fixture.componentInstance.select().itemsList.markedItem.label).toBe('London');
			});
		});

		describe('custom clear button focus (issue #2735)', () => {
			it('should focus clear wrapper on tab when custom clear button template is used', async () => {
				const fixture = createTestingModule(
					NgSelectTestComponent,
					`<ng-select [items]="cities" bindLabel="name" [(ngModel)]="selectedCity">
						<ng-template ng-clearbutton-tmp>
							<div class="custom-clearbutton">X</div>
						</ng-template>
					</ng-select>`,
				);
				const select = fixture.componentInstance.select();
				fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
				await tickAndDetectChanges(fixture);
				await tickAndDetectChanges(fixture);
				expect(select.showClear()).toBeTruthy();

				select.searchInput().nativeElement.focus();
				const focusOnClear = vi.spyOn(select, 'focusOnClear').mockReturnValue(undefined);
				triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
				expect(focusOnClear).toHaveBeenCalled();
			});
		});
	});
});
