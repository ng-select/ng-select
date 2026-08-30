import { ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { getNgSelectNativeElement } from '../../testing/helpers';

import { createTestingModule, NgSelectTestComponent } from '../../testing/ng-select-test-fixtures';
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
});
