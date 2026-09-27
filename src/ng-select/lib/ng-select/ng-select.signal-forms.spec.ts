import { Component, ErrorHandler, Provider, signal, Type, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { disabled, form, FormField, provideSignalFormsConfig, readonly, required } from '@angular/forms/signals';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';
import { describe, expect, it } from 'vitest';
import { applyZonelessFixtureCompat, TestsErrorHandler, tickAndDetectChanges } from '../../testing/helpers';
import { MockConsole } from '../../testing/mocks';
import { provideNgSelect } from '../ng-select.module';
import { ConsoleService } from '../services/console.service';
import { NgSelectComponent } from './ng-select.component';

interface City {
	id: number;
	name: string;
}

interface LabeledOption {
	id: number;
	label: string;
}

const CITIES: City[] = [
	{ id: 1, name: 'New York' },
	{ id: 2, name: 'London' },
	{ id: 3, name: 'Beijing' },
];

const LABELED_OPTIONS: LabeledOption[] = [
	{ id: 1, label: 'One' },
	{ id: 2, label: 'Two' },
	{ id: 3, label: 'Three' },
];

const settle = tickAndDetectChanges;

async function createFixture<T>(component: Type<T>, providers: Provider[] = []): Promise<ComponentFixture<T>> {
	TestBed.configureTestingModule({
		providers: [
			{ provide: ErrorHandler, useClass: TestsErrorHandler },
			{ provide: ConsoleService, useFactory: () => new MockConsole() },
			...provideNgSelect(),
			...providers,
		],
	});
	const fixture = applyZonelessFixtureCompat(TestBed.createComponent(component));
	await settle(fixture);
	return fixture;
}

function selectedIds(select: NgSelectComponent): number[] {
	return select.selectedItems.map((item) => item.value?.id ?? item.value);
}

function blurSearchInput(select: NgSelectComponent): void {
	select.searchInput().nativeElement.dispatchEvent(new FocusEvent('blur'));
}

@Component({
	selector: 'ng-signal-forms-single-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [formField]="cityForm.cityId" />`,
})
class SignalFormsSingleTestComponent {
	readonly items = signal<readonly City[]>(CITIES);
	readonly model = signal({ cityId: 2 as number | null });
	readonly cityForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-explicit-single-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [multiple]="false" [formField]="cityForm.cityId" />`,
})
class SignalFormsExplicitSingleTestComponent extends SignalFormsSingleTestComponent {}

@Component({
	selector: 'ng-signal-forms-late-bind-value-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" [bindValue]="valueKey()" [formField]="cityForm.cityId" />`,
})
class SignalFormsLateBindValueTestComponent extends SignalFormsSingleTestComponent {
	readonly valueKey = signal<string | undefined>(undefined);
}

@Component({
	selector: 'ng-signal-forms-multiple-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [multiple]="multiple()" [formField]="cityForm.cityIds" />`,
})
class SignalFormsMultipleTestComponent {
	readonly items = signal<readonly City[]>(CITIES);
	readonly multiple = signal(true);
	readonly model = signal({ cityIds: [1, 3] as number[] | null });
	readonly cityForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-late-multiple-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [multiple]="multiple()" [formField]="cityForm.cityIds" />`,
})
class SignalFormsLateMultipleTestComponent extends SignalFormsMultipleTestComponent {
	override readonly multiple = signal(false);
}

@Component({
	selector: 'ng-signal-forms-duplicate-value-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [multiple]="true" [formField]="cityForm.cityIds" />`,
})
class SignalFormsDuplicateValueTestComponent {
	readonly items = signal<readonly City[]>(CITIES);
	readonly model = signal({ cityIds: [1, 1] as number[] | null });
	readonly cityForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-async-multiple-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [multiple]="true" [formField]="cityForm.cityIds" />`,
})
class SignalFormsAsyncMultipleTestComponent {
	readonly items = signal<readonly City[]>([]);
	readonly model = signal({ cityIds: [1, 3] as number[] });
	readonly cityForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-async-single-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" bindLabel="name" bindValue="id" [formField]="cityForm.cityId" />`,
})
class SignalFormsAsyncSingleTestComponent {
	readonly items = signal<readonly City[]>([]);
	readonly model = signal({ cityId: 2 as number | null });
	readonly cityForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-late-bind-label-primitive-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" [bindLabel]="labelKey()" bindValue="id" [formField]="cityForm.cityId" />`,
})
class SignalFormsLateBindLabelPrimitiveTestComponent extends SignalFormsAsyncSingleTestComponent {
	readonly labelKey = signal<string | undefined>(undefined);
}

@Component({
	selector: 'ng-signal-forms-if-test',
	imports: [FormField, NgSelectComponent],
	template: `
		@if (visible()) {
			<ng-select [items]="items()" bindLabel="name" bindValue="id" [multiple]="true" [formField]="cityForm.cityIds" />
		}
	`,
})
class SignalFormsIfTestComponent {
	readonly visible = signal(false);
	readonly items = signal<readonly City[]>(CITIES);
	readonly model = signal({ cityIds: [1, 3] as number[] });
	readonly cityForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-object-value-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" [multiple]="true" [formField]="optionForm.options" />`,
})
class SignalFormsObjectValueTestComponent {
	readonly items = signal<readonly LabeledOption[]>([]);
	readonly model = signal({ options: [LABELED_OPTIONS[0], LABELED_OPTIONS[2]] });
	readonly optionForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-late-bind-label-object-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items()" [bindLabel]="labelKey()" [compareWith]="compareWith" [formField]="optionForm.option" />`,
})
class SignalFormsLateBindLabelObjectTestComponent {
	readonly labelKey = signal<string | undefined>(undefined);
	readonly items = signal<readonly LabeledOption[]>([]);
	readonly compareWith = (a: LabeledOption | null, b: LabeledOption | null) => a?.id === b?.id;
	readonly model = signal({ option: LABELED_OPTIONS[0] as LabeledOption | null });
	readonly optionForm = form(this.model);
	readonly select = viewChild.required(NgSelectComponent);
}

@Component({
	selector: 'ng-signal-forms-state-test',
	imports: [FormField, NgSelectComponent],
	template: `<ng-select [items]="items" bindLabel="name" bindValue="id" [formField]="cityForm.cityId" />`,
})
class SignalFormsStateTestComponent {
	readonly items = CITIES;
	readonly disabledState = signal(false);
	readonly readonlyState = signal(false);
	readonly model = signal({ cityId: null as number | null });
	readonly cityForm = form(this.model, (path) => {
		required(path.cityId);
		disabled(path.cityId, { when: () => this.disabledState() });
		readonly(path.cityId, { when: () => this.readonlyState() });
	});
	readonly select = viewChild.required(NgSelectComponent);
}

describe('NgSelectComponent Signal Forms', () => {
	it('binds directly through FormField without FormsModule', async () => {
		const fixture = await createFixture(SignalFormsSingleTestComponent);
		const component = fixture.componentInstance;

		expect(selectedIds(component.select())).toEqual([2]);
		expect(component.cityForm.cityId().value()).toBe(2);

		component.cityForm.cityId().value.set(3);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([3]);

		component.select().select(component.select().itemsList.items[0]);
		await settle(fixture);
		expect(component.model()).toEqual({ cityId: 1 });
		expect(component.cityForm.cityId().dirty()).toBe(true);

		blurSearchInput(component.select());
		await settle(fixture);
		expect(component.cityForm.cityId().touched()).toBe(true);

		component.select().handleClearClick();
		await settle(fixture);
		expect(component.model()).toEqual({ cityId: null });

		component.cityForm.cityId().reset(2);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([2]);
		expect(component.cityForm.cityId().dirty()).toBe(false);
		expect(component.cityForm.cityId().touched()).toBe(false);
	});

	it('preserves an initial value when multiple is explicitly false', async () => {
		const fixture = await createFixture(SignalFormsExplicitSingleTestComponent);
		expect(selectedIds(fixture.componentInstance.select())).toEqual([2]);
	});

	it('preserves initial multiple values', async () => {
		const fixture = await createFixture(SignalFormsMultipleTestComponent);
		expect(selectedIds(fixture.componentInstance.select())).toEqual([1, 3]);
	});

	it('clears the selection and the form value when multiple turns off after initialization', async () => {
		const fixture = await createFixture(SignalFormsMultipleTestComponent);
		const component = fixture.componentInstance;
		expect(selectedIds(component.select())).toEqual([1, 3]);

		component.multiple.set(false);
		await settle(fixture);
		expect(component.select().selectedItems).toEqual([]);
		expect(component.cityForm.cityIds().value()).toBeNull();
		expect(component.model().cityIds).toBeNull();
	});

	it('keeps an initial multiple value written before multiple turns on', async () => {
		const fixture = await createFixture(SignalFormsLateMultipleTestComponent);
		const component = fixture.componentInstance;
		expect(component.select().selectedItems).toEqual([]);

		component.multiple.set(true);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([1, 3]);
		expect(component.cityForm.cityIds().value()).toEqual([1, 3]);
	});

	it('selects a duplicate bound value once', async () => {
		const fixture = await createFixture(SignalFormsDuplicateValueTestComponent);
		expect(selectedIds(fixture.componentInstance.select())).toEqual([1]);
	});

	it('remaps initial multiple values when items arrive asynchronously', async () => {
		const fixture = await createFixture(SignalFormsAsyncMultipleTestComponent);
		const component = fixture.componentInstance;
		expect(selectedIds(component.select())).toEqual([1, 3]);

		component.items.set(CITIES);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([1, 3]);
		expect(component.select().selectedItems[0]).toBe(component.select().itemsList.items[0]);
		expect(component.select().selectedItems[1]).toBe(component.select().itemsList.items[2]);
	});

	it('remaps an initial single value when items arrive asynchronously', async () => {
		const fixture = await createFixture(SignalFormsAsyncSingleTestComponent);
		const component = fixture.componentInstance;
		expect(selectedIds(component.select())).toEqual([2]);

		component.items.set(CITIES);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([2]);
		expect(component.select().selectedItems[0]).toBe(component.select().itemsList.items[1]);
	});

	it('remaps the written value when bindValue arrives later', async () => {
		const fixture = await createFixture(SignalFormsLateBindValueTestComponent);
		const component = fixture.componentInstance;

		component.valueKey.set('id');
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([2]);
		expect(component.select().selectedItems[0]).toBe(component.select().itemsList.items[1]);
		expect(component.cityForm.cityId().value()).toBe(2);
	});

	it('restores initial multiple values whenever an @if recreates the control', async () => {
		const fixture = await createFixture(SignalFormsIfTestComponent);
		const component = fixture.componentInstance;

		component.visible.set(true);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([1, 3]);

		component.visible.set(false);
		await settle(fixture);
		component.visible.set(true);
		await settle(fixture);
		expect(selectedIds(component.select())).toEqual([1, 3]);
	});

	it('supports initial whole-object values before items and before the default bindLabel is used', async () => {
		const fixture = await createFixture(SignalFormsObjectValueTestComponent);
		const component = fixture.componentInstance;
		expect(component.select().selectedItems.map((item) => item.label)).toEqual(['One', 'Three']);

		component.items.set(LABELED_OPTIONS);
		await settle(fixture);
		expect(component.select().selectedItems[0]).toBe(component.select().itemsList.items[0]);
		expect(component.select().selectedItems[1]).toBe(component.select().itemsList.items[2]);
	});

	describe('bindLabel bound to an initially undefined value (#2840)', () => {
		it('does not crash when bindLabel is bound to an initially undefined value', async () => {
			// Creating the fixture must not throw while bindLabel is still undefined.
			const fixture = await createFixture(SignalFormsLateBindLabelObjectTestComponent);
			const component = fixture.componentInstance;
			expect(component.select().selectedItems.length).toBe(1);

			component.labelKey.set('label');
			component.items.set(LABELED_OPTIONS);
			await settle(fixture);
			expect(component.select().selectedItems[0]).toBe(component.select().itemsList.items[0]);
		});

		it('does not crash with a primitive bound value when bindLabel is initially undefined', async () => {
			const fixture = await createFixture(SignalFormsLateBindLabelPrimitiveTestComponent);
			const component = fixture.componentInstance;
			expect(selectedIds(component.select())).toEqual([2]);

			component.labelKey.set('name');
			component.items.set(CITIES);
			await settle(fixture);
			expect(selectedIds(component.select())).toEqual([2]);
		});
	});

	it('integrates validation, disabled, readonly, and configured status classes', async () => {
		const fixture = await createFixture(SignalFormsStateTestComponent, [provideSignalFormsConfig({ classes: NG_STATUS_CLASSES })]);
		const component = fixture.componentInstance;
		const host = fixture.nativeElement.querySelector('ng-select') as HTMLElement;
		const input = component.select().searchInput().nativeElement;

		expect(component.cityForm.cityId().invalid()).toBe(true);
		expect(
			component.cityForm
				.cityId()
				.errors()
				.map((error) => error.kind),
		).toEqual(['required']);
		expect(host.classList.contains('ng-invalid')).toBe(true);
		expect(host.classList.contains('ng-untouched')).toBe(true);

		blurSearchInput(component.select());
		await settle(fixture);
		expect(component.cityForm.cityId().touched()).toBe(true);
		expect(host.classList.contains('ng-touched')).toBe(true);

		component.disabledState.set(true);
		await settle(fixture);
		expect(input.disabled).toBe(true);

		component.disabledState.set(false);
		component.readonlyState.set(true);
		await settle(fixture);
		expect(component.select().readonly()).toBe(true);
		expect(component.select().disabled()).toBe(true);
	});
});
