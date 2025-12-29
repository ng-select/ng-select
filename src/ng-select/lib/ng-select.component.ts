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
	linkedSignal,
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
		'[class.ng-select-single]': '!multipleState()',
		'[class.ng-select-typeahead]': 'typeaheadState()',
		'[class.ng-select-multiple]': 'multipleState()',
		'[class.ng-select-taggable]': 'addTagState()',
		'[class.ng-select-searchable]': 'searchableState()',
		'[class.ng-select-clearable]': 'clearableState()',
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
	readonly ariaLabelDropdown = input<string>('Options List');
	readonly ariaLabel = input<string | undefined>(undefined);
	readonly markFirst = input(true, { transform: booleanAttribute });
	readonly placeholder = input<string>(this.config.placeholder);
	readonly fixedPlaceholder = input<boolean>(true);
	readonly notFoundText = input<string>(undefined);
	readonly typeToSearchText = input<string>(undefined);
	readonly preventToggleOnRightClick = input<boolean>(false);
	readonly addTagText = input<string>(undefined);
	readonly loadingText = input<string>(undefined);
	readonly clearAllText = input<string>(undefined);
	readonly dropdownPosition = input<DropdownPosition>('auto');
	readonly appendTo = input<string>(undefined);
	readonly outsideClickEvent = input<'click' | 'mousedown'>(this.config.outsideClickEvent);
	readonly loading = input(false, { transform: booleanAttribute });
	readonly closeOnSelect = input(true, { transform: booleanAttribute });
	readonly hideSelected = input(false, { transform: booleanAttribute });
	readonly selectOnTab = input(false, { transform: booleanAttribute });
	readonly openOnEnter = input(undefined, { transform: booleanAttribute });
	readonly maxSelectedItems = input<number, unknown>(undefined, { transform: numberAttribute });
	readonly groupBy = input<string | ((value: any) => any)>(undefined);
	readonly groupValue = input<GroupValueFn>(undefined);
	readonly bufferAmount = input(4, { transform: numberAttribute });
	readonly virtualScroll = input<boolean, unknown>(undefined, { transform: booleanAttribute });
	readonly selectableGroup = input(false, { transform: booleanAttribute });
	readonly tabFocusOnClearButton = input<boolean | undefined>();
	readonly selectableGroupAsModel = input(true, { transform: booleanAttribute });
	readonly searchFn = input(null);
	readonly trackByFn = input(null);
	readonly clearOnBackspace = input(true, { transform: booleanAttribute });
	readonly labelForId = input(null);
	readonly inputAttrs = input<Record<string, string>>({});
	readonly tabIndex = input<number, unknown>(undefined, { transform: numberAttribute });
	readonly readonly = input(false, { transform: booleanAttribute });
	readonly searchWhileComposing = input(true, { transform: booleanAttribute });
	readonly minTermLength = input(0, { transform: numberAttribute });
	readonly editableSearchTerm = input(false, { transform: booleanAttribute });
	readonly ngClass = input(null);
	readonly typeahead = input<Subject<string>>(undefined);
	readonly multiple = input(false, { transform: booleanAttribute });
	readonly addTag = input<boolean | AddTagFn>(false);
	readonly searchable = input(true, { transform: booleanAttribute });
	readonly clearable = input(true, { transform: booleanAttribute });
	readonly deselectOnClick = input<boolean>();
	readonly clearSearchOnAdd = input(undefined);
	readonly compareWith = input(undefined, {
		transform: (fn: CompareWithFn | undefined) => {
			if (fn !== undefined && fn !== null && !isFunction(fn)) {
				throw Error('`compareWith` must be a function.');
			}
			return fn;
		},
	});
	readonly keyDownFn = input<(_: KeyboardEvent) => boolean>((_: KeyboardEvent) => true);

	// writeable linked signals
	readonly ariaLabelDropdownState = linkedSignal(() => this.ariaLabelDropdown());
	readonly ariaLabelState = linkedSignal(() => this.ariaLabel());
	readonly markFirstState = linkedSignal(() => this.markFirst());
	readonly placeholderState = linkedSignal(() => this.placeholder());
	readonly fixedPlaceholderState = linkedSignal(() => this.fixedPlaceholder());
	readonly notFoundTextState = linkedSignal(() => this.notFoundText());
	readonly typeToSearchTextState = linkedSignal(() => this.typeToSearchText());
	readonly preventToggleOnRightClickState = linkedSignal(() => this.preventToggleOnRightClick());
	readonly addTagTextState = linkedSignal(() => this.addTagText());
	readonly loadingTextState = linkedSignal(() => this.loadingText());
	readonly clearAllTextState = linkedSignal(() => this.clearAllText());
	readonly dropdownPositionState = linkedSignal(() => this.dropdownPosition());
	readonly appendToState = linkedSignal(() => this.appendTo());
	readonly outsideClickEventState = linkedSignal(() => this.outsideClickEvent());
	readonly loadingState = linkedSignal(() => this.loading());
	readonly closeOnSelectState = linkedSignal(() => this.closeOnSelect());
	readonly hideSelectedState = linkedSignal(() => this.hideSelected());
	readonly selectOnTabState = linkedSignal(() => this.selectOnTab());
	readonly openOnEnterState = linkedSignal(() => this.openOnEnter());
	readonly maxSelectedItemsState = linkedSignal(() => this.maxSelectedItems());
	readonly groupByState = linkedSignal(() => this.groupBy());
	readonly groupValueState = linkedSignal(() => this.groupValue());
	readonly bufferAmountState = linkedSignal(() => this.bufferAmount());
	readonly virtualScrollState = linkedSignal(() => this.virtualScroll());
	readonly selectableGroupState = linkedSignal(() => this.selectableGroup());
	readonly tabFocusOnClearButtonState = linkedSignal(() => this.tabFocusOnClearButton());
	readonly selectableGroupAsModelState = linkedSignal(() => this.selectableGroupAsModel());
	readonly searchFnState = linkedSignal(() => this.searchFn());
	readonly trackByFnState = linkedSignal(() => this.trackByFn());
	readonly clearOnBackspaceState = linkedSignal(() => this.clearOnBackspace());
	readonly labelForIdState = linkedSignal(() => this.labelForId());
	readonly inputAttrsState = linkedSignal(() => this.inputAttrs());
	readonly tabIndexState = linkedSignal(() => this.tabIndex());
	readonly readonlyState = linkedSignal(() => this.readonly());
	readonly searchWhileComposingState = linkedSignal(() => this.searchWhileComposing());
	readonly minTermLengthState = linkedSignal(() => this.minTermLength());
	readonly editableSearchTermState = linkedSignal(() => this.editableSearchTerm());
	readonly ngClassState = linkedSignal(() => this.ngClass());
	readonly typeaheadState = linkedSignal(() => this.typeahead());
	readonly multipleState = linkedSignal(() => this.multiple());
	readonly addTagState = linkedSignal(() => this.addTag());
	readonly searchableState = linkedSignal(() => this.searchable());
	readonly clearableState = linkedSignal(() => this.clearable());
	readonly deselectOnClickState = linkedSignal(() => this.deselectOnClick());
	readonly clearSearchOnAddState = linkedSignal(() => this.clearSearchOnAdd());
	readonly compareWithState = linkedSignal(() => this.compareWith());
	readonly keyDownFnState = linkedSignal(() => this.keyDownFn());

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
	readonly disabled = computed(() => this.readonlyState() || this._disabled());
	readonly clearSearchOnAddValue = computed(() => {
		if (isDefined(this.clearSearchOnAddState())) {
			return this.clearSearchOnAddState();
		}
		if (isDefined(this.config.clearSearchOnAdd)) {
			return this.config.clearSearchOnAdd;
		}
		return this.closeOnSelectState();
	});
	readonly deselectOnClickValue = computed(() => {
		if (isDefined(this.deselectOnClickState())) {
			return this.deselectOnClickState();
		}
		if (isDefined(this.config.deselectOnClick)) {
			return this.config.deselectOnClick;
		}
		return this.multipleState();
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
	private readonly _editableSearchTerm = computed(() => this.editableSearchTermState() && !this.multipleState());
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
		return term && term.length >= this.minTermLengthState();
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
		return (!!this.searchTerm && this.searchableState()) || this._isComposing;
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
			this.addTagState() &&
			!this.itemsList.filteredItems.some((x) => x.label.toLowerCase() === term) &&
			((!this.hideSelectedState() && this.isOpen()) || !this.selectedItems.some((x) => x.label.toLowerCase() === term)) &&
			!this.loadingState()
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
			if (this.keyDownFnState()($event) === false) {
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

		if (this.preventToggleOnRightClickState() && $event.button === 2) {
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

		if (this.searchableState()) {
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
		if (!this.clearableState()) {
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

		if (!this.typeaheadState()?.observed && !this.addTagState() && this.itemsList.noItemsToSelect) {
			return;
		}
		this.isOpen.set(true);
		this.itemsList.markSelectedOrDefault(this.markFirstState());
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
			if (this.multipleState()) {
				this.addEvent.emit(item.value);
			}
		}

		if (this.closeOnSelectState() || this.itemsList.noItemsToSelect) {
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
		if (isFunction(this.addTagState())) {
			tag = (<AddTagFn>this.addTagState())(this.searchTerm);
		} else {
			tag = this._primitive ? this.searchTerm : { [this.bindLabel()]: this.searchTerm };
		}

		const handleTag = (item) =>
			this.typeaheadState()?.observed || !this.isOpen() ? this.itemsList.mapItem(item, null) : this.itemsList.addItem(item);
		if (isPromise(tag)) {
			tag.then((item) => this.select(handleTag(item))).catch(() => { });
		} else if (tag) {
			this.select(handleTag(tag));
		}
	}

	showClear() {
		return this.clearableState() && (this.hasValue || this.searchTerm) && !this.disabled();
	}

	focusOnClear() {
		this.blur();
		if (this.clearButton()) {
			this.clearButton().nativeElement.focus();
		}
	}

	trackByOption = (_: number, item: NgOption) => {
		if (this.trackByFnState()) {
			return this.trackByFnState()(item.value);
		}

		return item;
	};

	showNoItemsFound() {
		const empty = this.itemsList.filteredItems.length === 0;
		return (
			((empty && !this.typeaheadState()?.observed && !this.loadingState()) ||
				(empty && this.typeaheadState()?.observed && this._validTerm() && !this.loadingState())) &&
			!this.showAddTag
		);
	}

	showTypeToSearch() {
		const empty = this.itemsList.filteredItems.length === 0;
		return empty && this.typeaheadState()?.observed && !this._validTerm() && !this.loadingState();
	}

	onCompositionStart() {
		this._isComposing = true;
	}

	onCompositionEnd(term: string) {
		this._isComposing = false;
		if (this.searchWhileComposingState()) {
			return;
		}

		this.filter(term);
	}

	filter(term: string) {
		if (this._isComposing && !this.searchWhileComposingState()) {
			return;
		}

		this._searchTerm.set(term);
		if (this.typeaheadState()?.observed && (this._validTerm() || this.minTermLengthState() === 0)) {
			this.typeaheadState().next(term);
		}

		if (!this.typeaheadState()?.observed) {
			this.itemsList.filter(term);
			if (this.isOpen()) {
				this.itemsList.markSelectedOrDefault(this.markFirstState());
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
		if (this.isOpen() && isDefined(this.searchTerm) && !this.typeaheadState()?.observed) {
			this.itemsList.filter(this.searchTerm);
		}
		if (this.typeaheadState()?.observed || this.isOpen()) {
			this.itemsList.markSelectedOrDefault(this.markFirstState());
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
		if (!isDefined(value) || (this.multipleState() && value === '') || (Array.isArray(value) && value.length === 0)) {
			return false;
		}

		const validateBinding = (item: any): boolean => {
			if (!isDefined(this.compareWithState()) && isObject(item) && this.bindValue()) {
				this._console.warn(
					`Setting object(${JSON.stringify(item)}) as your model with bindValue is not allowed unless [compareWith] is used.`,
				);
				return false;
			}
			return true;
		};

		if (this.multipleState()) {
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

		if (this.multipleState()) {
			(<any[]>ngModel).forEach((item) => select(item));
		} else {
			select(ngModel);
		}
	}

	private _handleKeyPresses() {
		if (this.searchableState()) {
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
			...this.inputAttrsState(),
		};

		for (const key of Object.keys(attributes)) {
			input.setAttribute(key, attributes[key]);
		}
	}

	private _setTabFocusOnClear() {
		this.tabFocusOnClear.set(isDefined(this.tabFocusOnClearButtonState()) ? !!this.tabFocusOnClearButtonState() : this.config.tabFocusOnClear);
	}

	private _updateNgModel() {
		const model = [];
		for (const item of this.selectedItems) {
			if (this.bindValue()) {
				let value = null;
				if (item.children) {
					const groupKey = this.groupValueState() ? this.bindValue() : <string>this.groupByState();
					value = item.value[groupKey || <string>this.groupByState()];
				} else {
					value = this.itemsList.resolveNested(item.value, this.bindValue());
				}
				model.push(value);
			} else {
				model.push(item.value);
			}
		}

		const selected = this.selectedItems.map((x) => x.value);
		if (this.multipleState()) {
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
		if (this.typeaheadState()?.observed) {
			this.typeaheadState().next(searchTerm);
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
		const appendTo = this.appendToState() ?? this.config.appendTo;
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
			} else if (!this.addTagState()) {
				return;
			}
		}

		if (this.selectOnTabState()) {
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
		const openOnEnter = this.openOnEnterState() ?? this.config.openOnEnter;
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
			this.addTagState() && this.searchTerm && this.itemsList.markedItem && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length)
		);
	}

	private _handleBackspace() {
		if (this.searchTerm || !this.clearableState() || !this.clearOnBackspaceState() || !this.hasValue) {
			return;
		}

		if (this.multipleState()) {
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
		return isDefined(this.virtualScrollState) ? this.virtualScrollState() : this.isVirtualScrollDisabled(config);
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