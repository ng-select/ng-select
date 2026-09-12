import { NgClass } from '@angular/common';
import { Component, ErrorHandler, Type, viewChild, ViewEncapsulation } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import {
	NgClearButtonTemplateDirective,
	NgFooterTemplateDirective,
	NgHeaderTemplateDirective,
	NgLabelTemplateDirective,
	NgLoadingSpinnerTemplateDirective,
	NgLoadingTextTemplateDirective,
	NgMultiLabelTemplateDirective,
	NgNotFoundTemplateDirective,
	NgOptgroupTemplateDirective,
	NgOptionTemplateDirective,
	NgPlaceholderTemplateDirective,
	NgTagTemplateDirective,
	NgTypeToSearchTemplateDirective,
} from '../lib/directives/ng-templates.directive';
import { NgOptionComponent } from '../lib/ng-option.component';
import { NgSelectModule, provideNgSelect } from '../lib/ng-select.module';
import { AddTagFn, NgSelectComponent } from '../lib/ng-select/ng-select.component';
import { NgSelectConfig } from '../lib/services/config.service';
import { ConsoleService } from '../lib/services/console.service';
import { applyZonelessFixtureCompat, TestsErrorHandler } from './helpers';
import { MockConsole } from './mocks';

export function createTestingModule<T>(cmp: Type<T>, template: string, customNgSelectConfig: NgSelectConfig | null = null): ComponentFixture<T> {
	TestBed.configureTestingModule({
		providers: [{ provide: ErrorHandler, useClass: TestsErrorHandler }, { provide: ConsoleService, useFactory: () => new MockConsole() }, ...provideNgSelect()],
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

	const fixture = applyZonelessFixtureCompat(TestBed.createComponent(cmp));
	fixture.detectChanges();
	return fixture;
}

export function createEvent(target = {}) {
	return {
		preventDefault: () => {},
		target: {
			className: '',
			tagName: '',
			classList: {
				contains: () => {},
			},
			...target,
		},
	};
}

@Component({
	template: ``,
	standalone: true,
	imports: [FormsModule],
})
export class NgSelectTestComponent {
	readonly select = viewChild(NgSelectComponent);
	multiple = false;
	label = 'Yes';
	clearOnBackspace = true;
	disabled = false;
	readonly = false;
	dropdownPosition = 'bottom';
	visible = true;
	dynamicClass = '';
	panelClassBinding: string | string[] | Set<string> | Record<string, boolean> = '';
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
	appendToSelector = '.container-a';
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
	keyDownFn = () => {};

	tagFunc(term: string) {
		return { id: term, name: term, custom: true };
	}

	tagFuncNull = (_: string) => null;

	trackByIdFn = (item: any) => item?.id;

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

	onChange(_: any) {}

	onFocus(_: Event) {}

	onBlur(_: Event) {}

	onOpen() {}

	onClose() {}

	onAdd(_: Event) {}

	onRemove(_: Event) {}

	onClear() {}

	onSearch(_: any) {}

	onScroll() {}

	onScrollToEnd() {}
}

@Component({
	template: ``,
	encapsulation: ViewEncapsulation.ShadowDom,
	imports: [NgSelectModule, FormsModule],
})
export class EncapsulatedTestComponent extends NgSelectTestComponent {
	readonly select = viewChild(NgSelectComponent);
}

@Component({
	template: ``,
	standalone: true,
	imports: [FormsModule],
})
export class NgSelectGroupingTestComponent {
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
