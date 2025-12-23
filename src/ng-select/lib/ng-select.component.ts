import {
	AfterViewInit,
	booleanAttribute,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	contentChild,
	contentChildren,
	DestroyRef,
	effect,
	ElementRef,
	forwardRef,
	HostAttributeToken,
	HostListener,
	inject,
	InjectionToken,
	Injector,
	input,
	Input,
	model,
	numberAttribute,
	OnChanges,
	OnInit,
	output,
	signal,
	SimpleChanges,
	TemplateRef,
	viewChild,
	ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, tap } from 'rxjs/operators';

import {
	NgClearButtonTemplateDirective,
	NgFooterTemplateDirective,
	NgHeaderTemplateDirective,
	NgItemLabelDirective,
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
} from './ng-templates.directive';

import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgSelectConfig } from './config.service';
import { ConsoleService } from './console.service';
import { newId } from './id';
import { ItemsList } from './items-list';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgDropdownPanelService } from './ng-dropdown-panel.service';
import { NgOptionComponent } from './ng-option.component';
import { DropdownPosition, KeyCode, NgOption } from './ng-select.types';
import { DefaultSelectionModelFactory, SelectionModelFactory } from './selection-model';
import { isDefined, isFunction, isObject, isPromise } from './value-utils';

export const SELECTION_MODEL_FACTORY = new InjectionToken<SelectionModelFactory>('ng-select-selection-model');
export type AddTagFn = (term: string) => any | Promise<any>;
export type CompareWithFn = (a: any, b: any) => boolean;
export type GroupValueFn = (key: string | any, children: any[]) => string | any;

@Component({
	selector: 'ng-select',
	exportAs: 'ngSelect',
	templateUrl: './ng-select.component.html',
	styleUrls: ['./ng-select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NgSelectComponent),
			multi: true,
		},
		NgDropdownPanelService,
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, NgItemLabelDirective, NgDropdownPanelComponent],
	host: {
		'[class.ng-select]': 'true',
		'[class.ng-select-single]': '!multiple()',
		'[class.ng-select-typeahead]': 'typeahead()',
		'[class.ng-select-multiple]': 'multiple()',
		'[class.ng-select-taggable]': 'addTag()',
		'[class.ng-select-searchable]': 'searchable()',
		'[class.ng-select-clearable]': 'clearable()',
		'[class.ng-select-opened]': 'isOpen()',
		'[class.ng-select-filtered]': 'filtered',
		'[class.ng-select-disabled]': 'disabled()',
	},
})
export class NgSelectComponent implements OnChanges, OnInit, AfterViewInit, ControlValueAccessor {
	readonly classes = inject(new HostAttributeToken('class'), { optional: true });
	readonly config = inject(NgSelectConfig);
	private readonly _cd = inject(ChangeDetectorRef);
	private readonly _console = inject(ConsoleService);
	private readonly _destroyRef = inject(DestroyRef);

	// signals
	public readonly _disabled = signal<boolean>(false);
	// inputs
	readonly ariaLabelDropdown = model<string>('Options List');
	readonly ariaLabel = model<string | undefined>(undefined);
	readonly markFirst = model<boolean>(true);
	readonly placeholder = model<string>(this.config.placeholder);
	readonly fixedPlaceholder = model<boolean>(true);
	readonly notFoundText = model<string>(undefined);
	readonly typeToSearchText = model<string>(undefined);
	readonly preventToggleOnRightClick = model<boolean>(false);
	readonly addTagText = model<string>(undefined);
	readonly loadingText = model<string>(undefined);
	readonly clearAllText = model<string>(undefined);
	readonly dropdownPosition = model<DropdownPosition>('auto');
	readonly appendTo = model<string>(undefined);
	readonly outsideClickEvent = model<'click' | 'mousedown'>(this.config.outsideClickEvent);
	readonly loading = model<boolean>(false);
	readonly closeOnSelect = model<boolean>(true);
	readonly hideSelected = model<boolean>(false);
	readonly selectOnTab = model<boolean>(false);
	readonly openOnEnter = model<boolean | undefined>(undefined);
	readonly maxSelectedItems = model<number | undefined>(undefined);
	readonly groupBy = model<string | ((value: any) => any)>(undefined);
	readonly groupValue = model<GroupValueFn>(undefined);
	readonly bufferAmount = model<number>(4);
	readonly virtualScroll = model<boolean | undefined>(undefined);
	readonly selectableGroup = model<boolean>(false);
	readonly tabFocusOnClearButton = model<boolean | undefined>(undefined);
	readonly selectableGroupAsModel = model<boolean>(true);
	readonly searchFn = model<any>(null);
	readonly trackByFn = model<any>(null);
	readonly clearOnBackspace = model<boolean>(true);
	readonly labelForId = model<any>(null);
	readonly inputAttrs = model<Record<string, string>>({});
	readonly tabIndex = model<number | undefined>(undefined);
	readonly readonly = model<boolean>(false);
	readonly searchWhileComposing = model<boolean>(true);
	readonly minTermLength = model<number>(0);
	readonly editableSearchTerm = model<boolean>(false);
	readonly ngClass = model<any>(null);
	readonly typeahead = model<Subject<string> | undefined>(undefined);
	readonly multiple = model<boolean>(false);
	readonly addTag = model<boolean | AddTagFn>(false);
	readonly searchable = model<boolean>(true);
	readonly clearable = model<boolean>(true);
	readonly deselectOnClick = model<boolean | undefined>(undefined);
	readonly clearSearchOnAdd = model<any | undefined>(undefined);
	readonly compareWith = model<CompareWithFn | undefined>(undefined);
	readonly keyDownFn = model<(_: KeyboardEvent) => boolean>((_: KeyboardEvent) => true);

	// @Input setters that need to apply transforms/validation
	@Input('markFirst') set markFirstInput(v: any) {
		this.markFirst.set(booleanAttribute(v));
	}

	@Input('loading') set loadingInput(v: any) {
		this.loading.set(booleanAttribute(v));
	}

	@Input('closeOnSelect') set closeOnSelectInput(v: any) {
		this.closeOnSelect.set(booleanAttribute(v));
	}

	@Input('hideSelected') set hideSelectedInput(v: any) {
		this.hideSelected.set(booleanAttribute(v));
	}

	@Input('selectOnTab') set selectOnTabInput(v: any) {
		this.selectOnTab.set(booleanAttribute(v));
	}

	@Input('openOnEnter') set openOnEnterInput(v: any) {
		this.openOnEnter.set(booleanAttribute(v));
	}

	@Input('maxSelectedItems') set maxSelectedItemsInput(v: any) {
		this.maxSelectedItems.set(numberAttribute(v));
	}

	@Input('bufferAmount') set bufferAmountInput(v: any) {
		this.bufferAmount.set(numberAttribute(v));
	}

	@Input('virtualScroll') set virtualScrollInput(v: any) {
		this.virtualScroll.set(booleanAttribute(v));
	}

	@Input('selectableGroup') set selectableGroupInput(v: any) {
		this.selectableGroup.set(booleanAttribute(v));
	}

	@Input('selectableGroupAsModel') set selectableGroupAsModelInput(v: any) {
		this.selectableGroupAsModel.set(booleanAttribute(v));
	}

	@Input('clearOnBackspace') set clearOnBackspaceInput(v: any) {
		this.clearOnBackspace.set(booleanAttribute(v));
	}

	@Input('tabIndex') set tabIndexInput(v: any) {
		this.tabIndex.set(numberAttribute(v));
	}

	@Input('readonly') set readonlyInput(v: any) {
		this.readonly.set(booleanAttribute(v));
	}

	@Input('searchWhileComposing') set searchWhileComposingInput(v: any) {
		this.searchWhileComposing.set(booleanAttribute(v));
	}

	@Input('minTermLength') set minTermLengthInput(v: any) {
		this.minTermLength.set(numberAttribute(v));
	}

	@Input('editableSearchTerm') set editableSearchTermInput(v: any) {
		this.editableSearchTerm.set(booleanAttribute(v));
	}

	@Input('multiple') set multipleInput(v: any) {
		this.multiple.set(booleanAttribute(v));
	}

	@Input('searchable') set searchableInput(v: any) {
		this.searchable.set(booleanAttribute(v));
	}

	@Input('clearable') set clearableInput(v: any) {
		this.clearable.set(booleanAttribute(v));
	}

	@Input('compareWith') set compareWithInput(fn: CompareWithFn | undefined) {
		if (fn !== undefined && fn !== null && !isFunction(fn)) {
			throw Error('`compareWith` must be a function.');
		}
		this.compareWith.set(fn);
	}

	// models
	readonly bindLabel = model<string>(undefined);
	readonly bindValue = model<string>(undefined);
	readonly appearance = model<string>(undefined);
	readonly isOpen = model<boolean | undefined>(false);
	readonly items = model<readonly any[]>([]);

	// output events
	readonly blurEvent = output<any>({ alias: 'blur' });
	readonly focusEvent = output<any>({ alias: 'focus' });
	readonly changeEvent = output<any>({ alias: 'change' });
	readonly openEvent = output({ alias: 'open' });
	readonly closeEvent = output({ alias: 'close' });
	readonly searchEvent = output<{
		term: string;
		items: any[];
	}>({ alias: 'search' });
	readonly clearEvent = output({ alias: 'clear' });
	readonly addEvent = output<any>({ alias: 'add' });
	readonly removeEvent = output<any>({ alias: 'remove' });
	readonly scroll = output<{
		start: number;
		end: number;
	}>({ alias: 'scroll' });
	readonly scrollToEnd = output<any>({ alias: 'scrollToEnd' });

	// computed
	readonly disabled = computed(() => this.readonly() || this._disabled());
	readonly clearSearchOnAddValue = computed(() => {
		if (isDefined(this.clearSearchOnAdd())) {
			return this.clearSearchOnAdd();
		}
		if (isDefined(this.config.clearSearchOnAdd)) {
			return this.config.clearSearchOnAdd;
		}
		return this.closeOnSelect();
	});
	readonly deselectOnClickValue = computed(() => {
		if (isDefined(this.deselectOnClick())) {
			return this.deselectOnClick();
		}
		if (isDefined(this.config.deselectOnClick)) {
			return this.config.deselectOnClick;
		}
		return this.multiple();
	});
	// content child queries
	readonly optionTemplate = contentChild(NgOptionTemplateDirective, { read: TemplateRef });
	readonly optgroupTemplate = contentChild(NgOptgroupTemplateDirective, { read: TemplateRef });
	readonly labelTemplate = contentChild(NgLabelTemplateDirective, { read: TemplateRef });
	readonly multiLabelTemplate = contentChild(NgMultiLabelTemplateDirective, { read: TemplateRef });
	readonly headerTemplate = contentChild(NgHeaderTemplateDirective, { read: TemplateRef });
	readonly footerTemplate = contentChild(NgFooterTemplateDirective, { read: TemplateRef });
	readonly notFoundTemplate = contentChild(NgNotFoundTemplateDirective, { read: TemplateRef });
	readonly placeholderTemplate = contentChild(NgPlaceholderTemplateDirective, { read: TemplateRef });
	readonly typeToSearchTemplate = contentChild(NgTypeToSearchTemplateDirective, { read: TemplateRef });
	readonly loadingTextTemplate = contentChild(NgLoadingTextTemplateDirective, { read: TemplateRef });
	readonly tagTemplate = contentChild(NgTagTemplateDirective, { read: TemplateRef });
	readonly loadingSpinnerTemplate = contentChild(NgLoadingSpinnerTemplateDirective, { read: TemplateRef });
	readonly clearButtonTemplate = contentChild(NgClearButtonTemplateDirective, { read: TemplateRef });
	readonly ngOptions = contentChildren(NgOptionComponent, { descendants: true });

	// view children queries
	readonly dropdownPanel = viewChild(forwardRef(() => NgDropdownPanelComponent));
	readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
	readonly clearButton = viewChild<ElementRef<HTMLSpanElement>>('clearButton');
	// public variables
	readonly dropdownId = newId();
	readonly element: HTMLElement;

	// variables
	escapeHTML = true;
	itemsList: ItemsList;
	viewPortItems: NgOption[] = [];
	tabFocusOnClear = signal<boolean>(true);
	private readonly autoFocus = inject(new HostAttributeToken('autofocus'), { optional: true });
	// private variables
	private readonly _defaultLabel = 'label';
	private readonly _editableSearchTerm = computed(() => this.editableSearchTerm() && !this.multiple());
	private _focused: boolean;
	private _injector = inject(Injector);
	private _isComposing = false;
	private _itemsAreUsed: boolean;
	private readonly _keyPress$ = new Subject<string>();
	private _manualOpen: boolean;
	private _pressedKeys: string[] = [];
	private _primitive: any;
	private readonly _searchTerm = signal<string>(null);
	private readonly _validTerm = computed(() => {
		const term = this._searchTerm()?.trim();
		return term && term.length >= this.minTermLength();
	});

	constructor() {
		const config = this.config;
		const newSelectionModel = inject<SelectionModelFactory | undefined>(SELECTION_MODEL_FACTORY, { optional: true });
		const _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

		this._mergeGlobalConfig(config);
		this.itemsList = new ItemsList(this, newSelectionModel ? newSelectionModel() : DefaultSelectionModelFactory());
		this.element = _elementRef.nativeElement;
	}

	get filtered() {
		return (!!this.searchTerm && this.searchable()) || this._isComposing;
	}

	get focused() {
		return this._focused;
	}

	get searchTerm() {
		return this._searchTerm();
	}

	get selectedItems(): NgOption[] {
		return this.itemsList.selectedItems;
	}

	get selectedValues() {
		return this.selectedItems.map((x) => x.value);
	}

	get hasValue() {
		return this.selectedItems.length > 0;
	}

	get currentPanelPosition(): DropdownPosition {
		if (this.dropdownPanel()) {
			return this.dropdownPanel().currentPosition;
		}
		return undefined;
	}

	get showAddTag() {
		if (!this._validTerm()) {
			return false;
		}

		const term = this.searchTerm.toLowerCase().trim();
		return (
			this.addTag() &&
			!this.itemsList.filteredItems.some((x) => x.label.toLowerCase() === term) &&
			((!this.hideSelected() && this.isOpen()) || !this.selectedItems.some((x) => x.label.toLowerCase() === term)) &&
			!this.loading()
		);
	}

	clearItem = (item: any) => {
		const option = this.selectedItems.find((x) => x.value === item);
		this.unselect(option);
	};

	ngOnInit() {
		this._handleKeyPresses();
		this._setInputAttributes();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.multiple) {
			this.itemsList.clearSelected();
		}
		if (changes.items) {
			this._itemsAreUsed = true;
			this._setItems(changes.items.currentValue || []);
		}
		if (changes.isOpen) {
			this._manualOpen = isDefined(changes.isOpen.currentValue);
		}
		if (changes.groupBy) {
			if (!changes.items) {
				this._setItems([...this.items()]);
			}
		}
		if (changes.inputAttrs) {
			this._setInputAttributes();
		}
		this._setTabFocusOnClear();
	}

	ngAfterViewInit() {
		if (!this._itemsAreUsed) {
			this.escapeHTML = false;
			this._setItemsFromNgOptions();
		}

		if (isDefined(this.autoFocus)) {
			this.focus();
		}
	}

	@HostListener('keydown', ['$event'])
	handleKeyDown($event: KeyboardEvent) {
		const keyName = $event.key;
		if (Object.values(KeyCode).includes(keyName as KeyCode)) {
			if (this.keyDownFn()($event) === false) {
				return;
			}
			this.handleKeyCode($event);
		} else if (keyName && keyName.length === 1) {
			this._keyPress$.next(keyName.toLocaleLowerCase());
		}
	}

	handleKeyCode($event: KeyboardEvent) {
		const target = $event.target;

		if (this.clearButton() && this.clearButton().nativeElement === target) {
			this.handleKeyCodeClear($event);
		} else {
			this.handleKeyCodeInput($event);
		}
	}

	handleKeyCodeInput($event: KeyboardEvent) {
		switch ($event.key) {
			case KeyCode.ArrowDown:
				this._handleArrowDown($event);
				break;
			case KeyCode.ArrowUp:
				this._handleArrowUp($event);
				break;
			case KeyCode.Space:
				this._handleSpace($event);
				break;
			case KeyCode.Enter:
				this._handleEnter($event);
				break;
			case KeyCode.Tab:
				this._handleTab($event);
				break;
			case KeyCode.Esc:
				this.close();
				$event.preventDefault();
				break;
			case KeyCode.Backspace:
				this._handleBackspace();
				break;
		}
	}

	handleKeyCodeClear($event: KeyboardEvent) {
		switch ($event.key) {
			case KeyCode.Enter:
				this.handleClearClick();
				$event.preventDefault();
				break;
		}
	}

	handleMousedown($event: MouseEvent) {
		if (this.disabled()) {
			return;
		}

		if (this.preventToggleOnRightClick() && $event.button === 2) {
			return false;
		}
		const target = $event.target as HTMLElement;
		if (target.tagName !== 'INPUT') {
			$event.preventDefault();
		}

		if (target.classList.contains('ng-clear-wrapper')) {
			// Don't handle clear on mousedown - let click event handle it
			return;
		}

		if (target.classList.contains('ng-arrow-wrapper')) {
			this.handleArrowClick();
			return;
		}

		if (target.classList.contains('ng-value-icon')) {
			return;
		}

		if (!this._focused) {
			this.focus();
		}

		if (this.searchable()) {
			this.open();
		} else {
			this.toggle();
		}
	}

	handleArrowClick() {
		if (this.isOpen()) {
			this.close();
		} else {
			this.open();
		}
	}

	handleClearClick(_event?: MouseEvent) {
		if (this.hasValue) {
			this.itemsList.clearSelected(true);
			this._updateNgModel();
		}
		this._clearSearch();
		this.focus();
		this.clearEvent.emit();

		this._onSelectionChanged();
	}

	clearModel() {
		if (!this.clearable()) {
			return;
		}
		this.itemsList.clearSelected();
		this._updateNgModel();
	}

	writeValue(value: any | any[]): void {
		this.itemsList.clearSelected();
		this._handleWriteValue(value);
		if (this._editableSearchTerm()) {
			this._setSearchTermFromItems();
		}
		this._cd.markForCheck();
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	setDisabledState(state: boolean): void {
		this._disabled.set(state);
		this._cd.markForCheck();
	}

	toggle() {
		if (!this.isOpen()) {
			this.open();
		} else {
			this.close();
		}
	}

	open() {
		if (this.disabled() || this.isOpen() || this._manualOpen) {
			return;
		}

		if (!this.typeahead()?.observed && !this.addTag() && this.itemsList.noItemsToSelect) {
			return;
		}
		this.isOpen.set(true);
		this.itemsList.markSelectedOrDefault(this.markFirst());
		this.openEvent.emit();
		if (!this.searchTerm) {
			this.focus();
		}
		this.detectChanges();
	}

	close() {
		if (!this.isOpen() || this._manualOpen) {
			return;
		}
		this.isOpen.set(false);
		this._isComposing = false;
		if (!this._editableSearchTerm()) {
			this._clearSearch();
		} else {
			this.itemsList.resetFilteredItems();
		}
		this.itemsList.unmarkItem();
		this._onTouched();
		this.closeEvent.emit();
		this._cd.markForCheck();
	}

	toggleItem(item: NgOption) {
		if (!item || item.disabled || this.disabled()) {
			return;
		}

		if (this.deselectOnClickValue() && item.selected) {
			this.unselect(item);
		} else {
			this.select(item);
		}

		if (this._editableSearchTerm()) {
			this._setSearchTermFromItems();
		}
	}

	select(item: NgOption) {
		if (!item.selected) {
			this.itemsList.select(item);
			if (this.clearSearchOnAddValue() && !this._editableSearchTerm()) {
				this._clearSearch();
			}

			this._updateNgModel();
			if (this.multiple()) {
				this.addEvent.emit(item.value);
			}
		}

		if (this.closeOnSelect() || this.itemsList.noItemsToSelect) {
			this.close();
		}

		this._onSelectionChanged();
	}

	focus() {
		this.searchInput().nativeElement.focus();
	}

	blur() {
		this.searchInput().nativeElement.blur();
	}

	unselect(item: NgOption) {
		if (!item) {
			return;
		}

		this.itemsList.unselect(item);
		this.focus();
		this._updateNgModel();
		this.removeEvent.emit(item.value);
		this._onSelectionChanged();
	}

	selectTag() {
		let tag;
		if (isFunction(this.addTag())) {
			tag = (<AddTagFn>this.addTag())(this.searchTerm);
		} else {
			tag = this._primitive ? this.searchTerm : { [this.bindLabel()]: this.searchTerm };
		}

		const handleTag = (item) =>
			this.typeahead()?.observed || !this.isOpen() ? this.itemsList.mapItem(item, null) : this.itemsList.addItem(item);
		if (isPromise(tag)) {
			tag.then((item) => this.select(handleTag(item))).catch(() => { });
		} else if (tag) {
			this.select(handleTag(tag));
		}
	}

	showClear() {
		return this.clearable() && (this.hasValue || this.searchTerm) && !this.disabled();
	}

	focusOnClear() {
		this.blur();
		if (this.clearButton()) {
			this.clearButton().nativeElement.focus();
		}
	}

	trackByOption = (_: number, item: NgOption) => {
		if (this.trackByFn()) {
			return this.trackByFn()(item.value);
		}

		return item;
	};

	showNoItemsFound() {
		const empty = this.itemsList.filteredItems.length === 0;
		return (
			((empty && !this.typeahead()?.observed && !this.loading()) ||
				(empty && this.typeahead()?.observed && this._validTerm() && !this.loading())) &&
			!this.showAddTag
		);
	}

	showTypeToSearch() {
		const empty = this.itemsList.filteredItems.length === 0;
		return empty && this.typeahead()?.observed && !this._validTerm() && !this.loading();
	}

	onCompositionStart() {
		this._isComposing = true;
	}

	onCompositionEnd(term: string) {
		this._isComposing = false;
		if (this.searchWhileComposing()) {
			return;
		}

		this.filter(term);
	}

	filter(term: string) {
		if (this._isComposing && !this.searchWhileComposing()) {
			return;
		}

		this._searchTerm.set(term);
		if (this.typeahead()?.observed && (this._validTerm() || this.minTermLength() === 0)) {
			this.typeahead().next(term);
		}

		if (!this.typeahead()?.observed) {
			this.itemsList.filter(term);
			if (this.isOpen()) {
				this.itemsList.markSelectedOrDefault(this.markFirst());
			}
		}

		this.searchEvent.emit({ term, items: this.itemsList.filteredItems.map((x) => x.value) });
		this.open();
	}

	onInputFocus($event: FocusEvent) {
		if (this._focused) {
			return;
		}

		if (this._editableSearchTerm()) {
			this._setSearchTermFromItems();
		}

		this.element.classList.add('ng-select-focused');
		this.focusEvent.emit($event);
		this._focused = true;
	}

	onInputBlur($event: FocusEvent) {
		this.element.classList.remove('ng-select-focused');
		this.blurEvent.emit($event);
		if (!this.isOpen() && !this.disabled()) {
			this._onTouched();
		}
		if (this._editableSearchTerm()) {
			this._setSearchTermFromItems();
		}
		this._focused = false;
	}

	onItemHover(item: NgOption) {
		if (item.disabled) {
			return;
		}
		this.itemsList.markItem(item);
	}

	detectChanges() {
		if (!(<any>this._cd).destroyed) {
			this._cd.detectChanges();
		}
	}

	private _onChange = (_: any) => { };

	private _onTouched = () => { };

	private _setSearchTermFromItems() {
		const selected = this.selectedItems?.[0];
		this._searchTerm.set(selected?.label ?? null);
	}

	private _setItems(items: readonly any[]) {
		const firstItem = items[0];
		this.bindLabel.set(this.bindLabel() || this._defaultLabel);
		this._primitive = isDefined(firstItem) ? !isObject(firstItem) : this._primitive || this.bindLabel() === this._defaultLabel;
		this.itemsList.setItems(items);
		if (items.length > 0 && this.hasValue) {
			this.itemsList.mapSelectedItems();
		}
		if (this.isOpen() && isDefined(this.searchTerm) && !this.typeahead()?.observed) {
			this.itemsList.filter(this.searchTerm);
		}
		if (this.typeahead()?.observed || this.isOpen()) {
			this.itemsList.markSelectedOrDefault(this.markFirst());
		}
	}

	private _setItemsFromNgOptions() {
		effect(
			() => {
				const options = this.ngOptions();
				this.bindLabel.set(this._defaultLabel);
				const items =
					options.map((option) => ({
						$ngOptionValue: option.value(),
						$ngOptionLabel: option.elementRef.nativeElement.innerHTML,
						disabled: option.disabled(),
					})) ?? [];
				this.items.set(items);
				this.itemsList.setItems(items);
				if (this.hasValue) {
					this.itemsList.mapSelectedItems();
				}
				this._cd.detectChanges();

				options
					// find item for each option
					.map((option) => ({
						option,
						item: this.itemsList.findItem(option.value()),
					}))
					// filter non found items
					.filter(({ item }) => isDefined(item))
					// process to update disabled and label
					.forEach(({ option, item }) => {
						item.disabled = option.disabled();
						item.label = option.label() || item.label;
					});
			},
			{ injector: this._injector },
		);
	}

	private _isValidWriteValue(value: any): boolean {
		if (!isDefined(value) || (this.multiple() && value === '') || (Array.isArray(value) && value.length === 0)) {
			return false;
		}

		const validateBinding = (item: any): boolean => {
			if (!isDefined(this.compareWith()) && isObject(item) && this.bindValue()) {
				this._console.warn(
					`Setting object(${JSON.stringify(item)}) as your model with bindValue is not allowed unless [compareWith] is used.`,
				);
				return false;
			}
			return true;
		};

		if (this.multiple()) {
			if (!Array.isArray(value)) {
				this._console.warn('Multiple select ngModel should be array.');
				return false;
			}
			return value.every((item) => validateBinding(item));
		} else {
			return validateBinding(value);
		}
	}

	private _handleWriteValue(ngModel: any | any[]) {
		if (!this._isValidWriteValue(ngModel)) {
			return;
		}

		const select = (val: any) => {
			let item = this.itemsList.findItem(val);
			if (item) {
				this.itemsList.select(item);
			} else {
				const isValObject = isObject(val);
				const isPrimitive = !isValObject && !this.bindValue();
				if (isValObject || isPrimitive) {
					this.itemsList.select(this.itemsList.mapItem(val, null));
				} else if (this.bindValue()) {
					item = {
						[this.bindLabel()]: null,
						[this.bindValue()]: val,
					};
					this.itemsList.select(this.itemsList.mapItem(item, null));
				}
			}
		};

		if (this.multiple()) {
			(<any[]>ngModel).forEach((item) => select(item));
		} else {
			select(ngModel);
		}
	}

	private _handleKeyPresses() {
		if (this.searchable()) {
			return;
		}

		this._keyPress$
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				tap((letter) => this._pressedKeys.push(letter)),
				debounceTime(200),
				filter(() => this._pressedKeys.length > 0),
				map(() => this._pressedKeys.join('')),
			)
			.subscribe((term) => {
				const item = this.itemsList.findByLabel(term);
				if (item) {
					if (this.isOpen()) {
						this.itemsList.markItem(item);
						this._scrollToMarked();
						this._cd.markForCheck();
					} else {
						this.select(item);
					}
				}
				this._pressedKeys = [];
			});
	}

	private _setInputAttributes() {
		const input = this.searchInput().nativeElement;
		const attributes = {
			type: 'text',
			autocorrect: 'off',
			autocapitalize: 'off',
			autocomplete: 'off',
			'aria-controls': this.dropdownId,
			...this.inputAttrs(),
		};

		for (const key of Object.keys(attributes)) {
			input.setAttribute(key, attributes[key]);
		}
	}

	private _setTabFocusOnClear() {
		this.tabFocusOnClear.set(isDefined(this.tabFocusOnClearButton()) ? !!this.tabFocusOnClearButton() : this.config.tabFocusOnClear);
	}

	private _updateNgModel() {
		const model = [];
		for (const item of this.selectedItems) {
			if (this.bindValue()) {
				let value = null;
				if (item.children) {
					const groupKey = this.groupValue() ? this.bindValue() : <string>this.groupBy();
					value = item.value[groupKey || <string>this.groupBy()];
				} else {
					value = this.itemsList.resolveNested(item.value, this.bindValue());
				}
				model.push(value);
			} else {
				model.push(item.value);
			}
		}

		const selected = this.selectedItems.map((x) => x.value);
		if (this.multiple()) {
			this._onChange(model);
			this.changeEvent.emit(selected);
		} else {
			this._onChange(isDefined(model[0]) ? model[0] : null);
			this.changeEvent.emit(selected[0]);
		}

		this._cd.markForCheck();
	}

	private _clearSearch() {
		if (!this.searchTerm) {
			return;
		}

		this._changeSearch(null);
		this.itemsList.resetFilteredItems();
	}

	private _changeSearch(searchTerm: string) {
		this._searchTerm.set(searchTerm);
		if (this.typeahead()?.observed) {
			this.typeahead().next(searchTerm);
		}
	}

	private _scrollToMarked() {
		if (!this.isOpen() || !this.dropdownPanel()) {
			return;
		}
		this.dropdownPanel().scrollTo(this.itemsList.markedItem);
	}

	private _scrollToTag() {
		if (!this.isOpen() || !this.dropdownPanel()) {
			return;
		}
		this.dropdownPanel().scrollToTag();
	}

	private _onSelectionChanged() {
		const appendTo = this.appendTo() ?? this.config.appendTo;
		if (this.isOpen() && this.deselectOnClickValue() && appendTo) {
			// Make sure items are rendered.
			this._cd.detectChanges();
			this.dropdownPanel().adjustPosition();
		}
	}

	private _handleTab($event: KeyboardEvent) {
		if (this.isOpen() === false) {
			if (this.showClear() && !$event.shiftKey && this.tabFocusOnClear()) {
				this.focusOnClear();
				$event.preventDefault();
			} else if (!this.addTag()) {
				return;
			}
		}

		if (this.selectOnTab()) {
			if (this.itemsList.markedItem) {
				this.toggleItem(this.itemsList.markedItem);
				$event.preventDefault();
			} else if (this.showAddTag) {
				this.selectTag();
				$event.preventDefault();
			} else {
				this.close();
			}
		} else {
			this.close();
		}
	}

	private _handleEnter($event: KeyboardEvent) {
		const openOnEnter = this.openOnEnter() ?? this.config.openOnEnter;
		if (this.isOpen() || this._manualOpen) {
			if (this.itemsList.markedItem) {
				this.toggleItem(this.itemsList.markedItem);
			} else if (this.showAddTag) {
				this.selectTag();
			}
		} else if (openOnEnter) {
			this.open();
		} else {
			return;
		}

		$event.preventDefault();
	}

	private _handleSpace($event: KeyboardEvent) {
		if (this.isOpen() || this._manualOpen) {
			return;
		}
		this.open();
		$event.preventDefault();
	}

	private _handleArrowDown($event: KeyboardEvent) {
		if (this._nextItemIsTag(+1)) {
			this.itemsList.unmarkItem();
			this._scrollToTag();
		} else {
			this.itemsList.markNextItem();
			this._scrollToMarked();
		}
		this.open();
		$event.preventDefault();
	}

	private _handleArrowUp($event: KeyboardEvent) {
		if (!this.isOpen()) {
			return;
		}

		if (this._nextItemIsTag(-1)) {
			this.itemsList.unmarkItem();
			this._scrollToTag();
		} else {
			this.itemsList.markPreviousItem();
			this._scrollToMarked();
		}
		$event.preventDefault();
	}

	private _nextItemIsTag(nextStep: number): boolean {
		const nextIndex = this.itemsList.markedIndex + nextStep;
		return (
			this.addTag() && this.searchTerm && this.itemsList.markedItem && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length)
		);
	}

	private _handleBackspace() {
		if (this.searchTerm || !this.clearable() || !this.clearOnBackspace() || !this.hasValue) {
			return;
		}

		if (this.multiple()) {
			this.unselect(this.itemsList.lastSelectedItem);
		} else {
			this.clearModel();
		}
	}

	private _mergeGlobalConfig(config: NgSelectConfig) {
		this.bindValue.set(this.bindValue() || config.bindValue);
		this.bindLabel.set(this.bindLabel() || config.bindLabel);
		this.appearance.set(this.appearance() || config.appearance);
		this._setTabFocusOnClear();
	}

	/**
	 * Gets virtual scroll value from input or from config
	 *
	 *  @param config NgSelectConfig object
	 *
	 *  @returns `true` if virtual scroll is enabled, `false` otherwise
	 */
	private getVirtualScroll(config: NgSelectConfig): boolean {
		return isDefined(this.virtualScroll) ? this.virtualScroll() : this.isVirtualScrollDisabled(config);
	}

	/**
	 * Gets disableVirtualScroll value from input or from config
	 *
	 *  @param config NgSelectConfig object
	 *
	 *  @returns `true` if disableVirtualScroll is enabled, `false` otherwise
	 */
	private isVirtualScrollDisabled(config: NgSelectConfig) {
		return isDefined(config.disableVirtualScroll) ? !config.disableVirtualScroll : false;
	}
}
