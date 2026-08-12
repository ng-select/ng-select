import {
	ConnectedPosition,
	createFlexibleConnectedPositionStrategy,
	createNoopScrollStrategy,
	createOverlayRef,
	FlexibleConnectedPositionStrategy,
	OverlayContainer,
	OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
	afterEveryRender,
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
	isDevMode,
	linkedSignal,
	model,
	numberAttribute,
	OnChanges,
	OnInit,
	output,
	runInInjectionContext,
	signal,
	SimpleChanges,
	TemplateRef,
	untracked,
	viewChild,
	ViewContainerRef,
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

import { NgClass, NgTemplateOutlet } from '@angular/common';
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

/** DI token for SelectionModel implementation. You can provide custom implementation changing selection behaviour. */
export const SELECTION_MODEL_FACTORY = new InjectionToken<SelectionModelFactory>('ng-select-selection-model');
export type AddTagFn = (term: string) => any | Promise<any>;
export type CompareWithFn = (a: any, b: any) => boolean;
export type GroupValueFn = (key: string | any, children: any[]) => string | any;

function optionalBooleanAttribute(value: unknown): boolean | undefined {
	return value == null ? undefined : booleanAttribute(value);
}

const DROPDOWN_POSITION_BELOW: ConnectedPosition = { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' };
const DROPDOWN_POSITION_ABOVE: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' };
const DROPDOWN_POSITION_AFTER: ConnectedPosition = { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' };
const DROPDOWN_POSITION_BEFORE: ConnectedPosition = { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' };

const DROPDOWN_POSITIONS: Record<DropdownPosition, ConnectedPosition[]> = {
	// 'auto' prefers below and flips above when the panel does not fit the viewport;
	// the fit check measures the rendered overlay, so header/footer templates and
	// item count are accounted for (#2687, #2575)
	auto: [DROPDOWN_POSITION_BELOW, DROPDOWN_POSITION_ABOVE],
	bottom: [DROPDOWN_POSITION_BELOW],
	top: [DROPDOWN_POSITION_ABOVE],
	right: [DROPDOWN_POSITION_AFTER],
	left: [DROPDOWN_POSITION_BEFORE],
};

/**
 * Overlay container created inside the `appendTo` host. Only used by browsers without the
 * Popover API (where the popover insertion point cannot place the overlay host): keeping the
 * container a descendant of the `appendTo` host preserves ancestor-scoped styles and focus
 * containment there too. The container element carries `position: fixed`, so the connected
 * position strategy's viewport coordinates stay valid, same as the default body container.
 */
class NgSelectAppendToOverlayContainer extends OverlayContainer {
	constructor(private readonly _appendToHost: HTMLElement) {
		super();
	}

	protected override _createContainer(): void {
		super._createContainer();
		this._appendToHost.appendChild(this._containerElement);
	}
}

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
	imports: [NgClass, NgTemplateOutlet, NgItemLabelDirective, NgDropdownPanelComponent],
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
	// signals
	public readonly _disabled = signal<boolean>(false);
	// inputs: underscored input() + alias + linkedSignal() for stable public names (back compat)
	readonly _ariaLabelDropdown = input<string>(undefined, { alias: 'ariaLabelDropdown' });
	readonly ariaLabelDropdown = linkedSignal(() => this._ariaLabelDropdown());
	readonly _ariaLabel = input<string | undefined>(undefined, { alias: 'ariaLabel' });
	readonly ariaLabel = linkedSignal(() => this._ariaLabel());
	/** Marks first item as focused when opening/filtering. */
	readonly _markFirst = input(true, { alias: 'markFirst', transform: booleanAttribute });
	readonly markFirst = linkedSignal(() => this._markFirst());
	/** Placeholder text. */
	readonly _placeholder = input<string>(this.config.placeholder, { alias: 'placeholder' });
	readonly placeholder = linkedSignal(() => this._placeholder());
	/** Set placeholder visible even when an item is selected */
	readonly _fixedPlaceholder = input<boolean>(true, { alias: 'fixedPlaceholder' });
	readonly fixedPlaceholder = linkedSignal(() => this._fixedPlaceholder());
	/** Set custom text when filter returns empty result */
	readonly _notFoundText = input<string>(undefined, { alias: 'notFoundText' });
	readonly notFoundText = linkedSignal(() => this._notFoundText());
	/** Set custom text when using Typeahead */
	readonly _typeToSearchText = input<string>(undefined, { alias: 'typeToSearchText' });
	readonly typeToSearchText = linkedSignal(() => this._typeToSearchText());
	/** Prevent opening of ng-select on right mouse click */
	readonly _preventToggleOnRightClick = input<boolean>(false, { alias: 'preventToggleOnRightClick' });
	readonly preventToggleOnRightClick = linkedSignal(() => this._preventToggleOnRightClick());
	/** Set custom text when using tagging */
	readonly _addTagText = input<string>(undefined, { alias: 'addTagText' });
	readonly addTagText = linkedSignal(() => this._addTagText());
	/** Set custom text when for loading items */
	readonly _loadingText = input<string>(undefined, { alias: 'loadingText' });
	readonly loadingText = linkedSignal(() => this._loadingText());
	/** Set custom text for clear all icon title */
	readonly _clearAllText = input<string>(undefined, { alias: 'clearAllText' });
	readonly clearAllText = linkedSignal(() => this._clearAllText());
	/** Set custom text prefixed to the option label in the aria-label of the remove icon on selected values (multiple mode) */
	readonly _removeText = input<string>(undefined, { alias: 'removeText' });
	readonly removeText = linkedSignal(() => this._removeText());
	/** Set the dropdown position on open */
	readonly _dropdownPosition = input<DropdownPosition>('auto', { alias: 'dropdownPosition' });
	readonly dropdownPosition = linkedSignal(() => this._dropdownPosition());
	/**
	 * Append the dropdown overlay to any element using a css selector, resolved against the
	 * select's own root (document or shadow root). The panel keeps its viewport-based
	 * positioning and top-layer painting; the target controls where the overlay lives in the
	 * DOM — ancestor-scoped styles, stacking context and focus containment. Defaults to the
	 * document body.
	 */
	readonly _appendTo = input<string>(undefined, { alias: 'appendTo' });
	readonly appendTo = linkedSignal(() => this._appendTo());
	/** Configure which DOM event type is used for outside click detection. Use `'mousedown'` to fix issues with backdrop/loading overlays that appear on dropdown open */
	readonly _outsideClickEvent = input<'click' | 'mousedown'>(this.config.outsideClickEvent ?? 'click', { alias: 'outsideClickEvent' });
	readonly outsideClickEvent = linkedSignal(() => this._outsideClickEvent());
	/** You can set the loading state from the outside (e.g. async items loading) */
	readonly _loading = input(false, { alias: 'loading', transform: booleanAttribute });
	readonly loading = linkedSignal(() => this._loading());
	/** Whether to close the menu when a value is selected */
	readonly _closeOnSelect = input(true, { alias: 'closeOnSelect', transform: booleanAttribute });
	readonly closeOnSelect = linkedSignal(() => this._closeOnSelect());
	/** Allows to hide selected items. */
	readonly _hideSelected = input(false, { alias: 'hideSelected', transform: booleanAttribute });
	readonly hideSelected = linkedSignal(() => this._hideSelected());
	/** Select marked dropdown item using tab. Default `false` */
	readonly _selectOnTab = input(false, { alias: 'selectOnTab', transform: booleanAttribute });
	readonly selectOnTab = linkedSignal(() => this._selectOnTab());
	/** Open dropdown using enter. Default `true` */
	readonly _openOnEnter = input(undefined, { alias: 'openOnEnter', transform: booleanAttribute });
	readonly openOnEnter = linkedSignal(() => this._openOnEnter());
	/** When multiple = true, allows to set a limit number of selection. */
	readonly _maxSelectedItems = input<number, unknown>(undefined, { alias: 'maxSelectedItems', transform: numberAttribute });
	readonly maxSelectedItems = linkedSignal(() => this._maxSelectedItems());
	/** Allow to group items by key or function expression */
	readonly _groupBy = input<string | ((value: any) => any)>(undefined, { alias: 'groupBy' });
	readonly groupBy = linkedSignal(() => this._groupBy());
	/** Function expression to provide group value */
	readonly _groupValue = input<GroupValueFn>(undefined, { alias: 'groupValue' });
	readonly groupValue = linkedSignal(() => this._groupValue());
	/** Used in virtual scrolling, the `bufferAmount` property controls the number of items preloaded in the background to ensure smoother and more seamless scrolling. */
	readonly _bufferAmount = input(4, { alias: 'bufferAmount', transform: numberAttribute });
	readonly bufferAmount = linkedSignal(() => this._bufferAmount());
	/** Enable virtual scroll for better performance when rendering a lot of data */
	readonly _virtualScroll = input<boolean | undefined, unknown>(undefined, {
		alias: 'virtualScroll',
		transform: optionalBooleanAttribute,
	});
	readonly virtualScroll = linkedSignal(() => this._virtualScroll());
	readonly dropdownVirtualScroll = computed(() => {
		const value = this._virtualScroll();
		return isDefined(value) ? value : this.isVirtualScrollDisabled(this.config);
	});
	/** Allow to select group when groupBy is used */
	readonly _selectableGroup = input(false, { alias: 'selectableGroup', transform: booleanAttribute });
	readonly selectableGroup = linkedSignal(() => this._selectableGroup());
	/** Control tab navigation behavior for the clear button. Default `true` */
	readonly _tabFocusOnClearButton = input<boolean | undefined>(undefined, { alias: 'tabFocusOnClearButton' });
	readonly tabFocusOnClearButton = linkedSignal(() => this._tabFocusOnClearButton());
	/** Indicates whether to select all children or group itself */
	readonly _selectableGroupAsModel = input(true, { alias: 'selectableGroupAsModel', transform: booleanAttribute });
	readonly selectableGroupAsModel = linkedSignal(() => this._selectableGroupAsModel());
	/** Allow to filter by custom search function */
	readonly _searchFn = input(null, { alias: 'searchFn' });
	readonly searchFn = linkedSignal(() => this._searchFn());
	/** Provide custom trackBy function */
	readonly _trackByFn = input(null, { alias: 'trackByFn' });
	readonly trackByFn = linkedSignal(() => this._trackByFn());
	/** Clear selected values one by one when clicking backspace. Default `true` */
	readonly _clearOnBackspace = input(true, { alias: 'clearOnBackspace', transform: booleanAttribute });
	readonly clearOnBackspace = linkedSignal(() => this._clearOnBackspace());
	/** Id to associate control with label. */
	readonly _labelForId = input(null, { alias: 'labelForId' });
	readonly labelForId = linkedSignal(() => this._labelForId());
	/** Pass custom attributes to underlying `input` element */
	readonly _inputAttrs = input<Record<string, string>>({}, { alias: 'inputAttrs' });
	readonly inputAttrs = linkedSignal(() => this._inputAttrs());
	/** Set tabindex on ng-select */
	readonly _tabIndex = input<number, unknown>(undefined, { alias: 'tabIndex', transform: numberAttribute });
	readonly tabIndex = linkedSignal(() => this._tabIndex());
	/** Set ng-select as readonly. Mostly used with reactive forms. */
	readonly _readonly = input(false, { alias: 'readonly', transform: booleanAttribute });
	readonly readonly = linkedSignal(() => this._readonly());
	/** Whether items should be filtered while composition started */
	readonly _searchWhileComposing = input(true, { alias: 'searchWhileComposing', transform: booleanAttribute });
	readonly searchWhileComposing = linkedSignal(() => this._searchWhileComposing());
	/** Minimum term length to start a search. Should be used with `typeahead` */
	readonly _minTermLength = input(0, { alias: 'minTermLength', transform: numberAttribute });
	readonly minTermLength = linkedSignal(() => this._minTermLength());
	/** Allow to edit search query if option selected. Default `false`. Works only if multiple is `false`. */
	readonly _editableSearchTerm = input(false, { alias: 'editableSearchTerm', transform: booleanAttribute });
	readonly editableSearchTerm = linkedSignal(() => this._editableSearchTerm());
	readonly _ngClass = input(null, { alias: 'ngClass' });
	readonly ngClass = linkedSignal(() => this._ngClass());
	/** Custom autocomplete or advanced filter. */
	readonly _typeahead = input<Subject<string>>(undefined, { alias: 'typeahead' });
	readonly typeahead = linkedSignal(() => this._typeahead());
	/** Allows to select multiple items. */
	readonly _multiple = input(false, { alias: 'multiple', transform: booleanAttribute });
	readonly multiple = linkedSignal(() => this._multiple());
	/** Allows to create custom options. */
	readonly _addTag = input<boolean | AddTagFn>(false, { alias: 'addTag' });
	readonly addTag = linkedSignal(() => this._addTag());
	/** Allow to search for value. Default `true` */
	readonly _searchable = input(true, { alias: 'searchable', transform: booleanAttribute });
	readonly searchable = linkedSignal(() => this._searchable());
	/** Allow to clear selected value. Default `true` */
	readonly _clearable = input(true, { alias: 'clearable', transform: booleanAttribute });
	readonly clearable = linkedSignal(() => this._clearable());
	readonly _clearKeepsDisabledOptions = input(true, { alias: 'clearKeepsDisabledOptions', transform: booleanAttribute });
	readonly clearKeepsDisabledOptions = linkedSignal(() => this._clearKeepsDisabledOptions());
	/** Deselects a selected item when it is clicked in the dropdown. Default `false`. Default `true` when **multiple** is `true` */
	readonly _deselectOnClick = input<boolean>(undefined, { alias: 'deselectOnClick' });
	readonly deselectOnClick = linkedSignal(() => this._deselectOnClick());
	/** Clears search input when item is selected. Default `true`. Default `false` when **closeOnSelect** is `false` */
	readonly _clearSearchOnAdd = input(undefined, { alias: 'clearSearchOnAdd' });
	readonly clearSearchOnAdd = linkedSignal(() => this._clearSearchOnAdd());
	/** A function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection(model). A boolean should be returned. */
	readonly _compareWith = input(undefined, {
		alias: 'compareWith',
		transform: (fn: CompareWithFn | undefined) => {
			if (fn !== undefined && fn !== null && !isFunction(fn)) {
				throw Error('`compareWith` must be a function.');
			}
			return fn;
		},
	});
	readonly compareWith = linkedSignal(() => this._compareWith());
	/** Provide custom keyDown function. Executed before default handler. Return false to suppress execution of default key down handlers */
	readonly _keyDownFn = input<(_: KeyboardEvent) => boolean>((_: KeyboardEvent) => true, { alias: 'keyDownFn' });
	readonly keyDownFn = linkedSignal(() => this._keyDownFn());
	/** @deprecated Has no effect: the CDK overlay renders in the native Popover API top layer automatically in supporting browsers. Will be removed in a future major version. */
	readonly _popover = input(false, { alias: 'popover', transform: booleanAttribute });
	/** @deprecated Has no effect: the CDK overlay renders in the native Popover API top layer automatically in supporting browsers. Will be removed in a future major version. */
	readonly popover = linkedSignal(() => this._popover());
	// models
	/** Object property to use for label. Default `label` */
	readonly bindLabel = model<string>(undefined);
	/** Object property to use for selected model. By default binds to whole object. */
	readonly bindValue = model<string>(undefined);
	/** Allows to select dropdown appearance. Set to `outline` or `fill` for Material form-field styles (applies only to Material theme) */
	readonly appearance = model<string>(undefined);
	/** Allows manual control of dropdown opening and closing. `true` - won't close. `false` - won't open. */
	readonly isOpen = model<boolean | undefined>(false);
	/** Items array */
	readonly items = model<readonly any[]>([]);
	// output events
	/** Fired on select blur */
	readonly blurEvent = output<any>({ alias: 'blur' });
	/** Fired on select focus */
	readonly focusEvent = output<any>({ alias: 'focus' });
	/** Fired on model change. Outputs whole model */
	readonly changeEvent = output<any>({ alias: 'change' });
	/** Fired on select dropdown open */
	readonly openEvent = output({ alias: 'open' });
	/** Fired on select dropdown close */
	readonly closeEvent = output({ alias: 'close' });
	/** Fired while typing search term. Outputs search term with filtered items */
	readonly searchEvent = output<{
		term: string;
		items: any[];
	}>({ alias: 'search' });
	/** Fired on clear icon click */
	readonly clearEvent = output({ alias: 'clear' });
	/** Fired when item is added while `[multiple]="true"`. Outputs added item */
	readonly addEvent = output<any>({ alias: 'add' });
	/** Fired when item is removed while `[multiple]="true"` */
	readonly removeEvent = output<any>({ alias: 'remove' });
	/** Fired when scrolled (only when `[virtualScroll]="true"`). Provides the start and end index of the currently available items. Can be used for loading more items in chunks before the user has scrolled all the way to the bottom of the list. */
	readonly scroll = output<{
		start: number;
		end: number;
	}>({ alias: 'scroll' });
	/** Fired when scrolled to the end of items. Can be used for loading more items in chunks. */
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
	private readonly _dropdownTemplate = viewChild<TemplateRef<any>>('dropdownTemplate');
	// The portal's embedded view is anchored at the template's own container so it stays
	// part of this component's logical view tree (DI, view queries, detectChanges) while
	// its DOM nodes live in the CDK overlay
	private readonly _dropdownOutlet = viewChild('dropdownTemplate', { read: ViewContainerRef });
	private readonly _selectContainer = viewChild<ElementRef<HTMLDivElement>>('selectContainer');
	// public variables
	readonly dropdownId = newId();
	readonly element: HTMLElement;
	/** Width of the notched-outline gap for the floated label in the material outline appearance */
	readonly outlineNotchWidth = signal(0);
	// variables
	escapeHTML = true;
	itemsList: ItemsList;
	viewPortItems: NgOption[] = [];
	tabFocusOnClear = signal<boolean>(true);
	private readonly _cd = inject(ChangeDetectorRef);
	private readonly _console = inject(ConsoleService);
	private readonly _destroyRef = inject(DestroyRef);
	private readonly autoFocus = inject(new HostAttributeToken('autofocus'), { optional: true });
	/** Overlay hosting the dropdown panel while open. Bound into the panel so it can request repositioning. */
	protected dropdownOverlayRef: OverlayRef | null = null;
	// private variables
	private readonly _defaultLabel = 'label';
	private readonly _editableSearchTermActive = computed(() => this.editableSearchTerm() && !this.multiple());
	private readonly _document = inject(DOCUMENT);
	private _dropdownPositionStrategy: FlexibleConnectedPositionStrategy | null = null;
	private _dropdownPortal: TemplatePortal | null = null;
	/** `appendTo` value the current overlay was created against; a change rebuilds the overlay. */
	private _overlayAppendTo: string | null = null;
	/** Overlay container placed inside the `appendTo` host for browsers without the Popover API. */
	private _appendToContainer: NgSelectAppendToOverlayContainer | null = null;
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
		this._handleSignalChanges();
		afterEveryRender({
			read: () => this._measureOutlineNotch(),
		});
		this._destroyRef.onDestroy(() => this._destroyDropdownOverlay());
	}

	/**
	 * Measures the placeholder label so the notched outline can leave a real gap in the border
	 * for the floated label instead of masking it with an opaque background (material theme).
	 * The 0.75 factor matches the `scale(0.75)` the material theme applies to the floated label.
	 */
	private _measureOutlineNotch() {
		if (this.appearance() !== 'outline') {
			return;
		}
		const label = this.element.querySelector<HTMLElement>('.ng-select-container > .ng-value-container .ng-placeholder');
		const width = label ? label.offsetWidth * 0.75 : 0;
		if (width !== this.outlineNotchWidth()) {
			this.outlineNotchWidth.set(width);
		}
	}

	private _focused: boolean;

	get focused() {
		return this._focused;
	}

	get filtered() {
		return (!!this.searchTerm && this.searchable()) || this._isComposing;
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
		this._warnDeprecatedInputs();
	}

	ngOnChanges(changes: SimpleChanges) {
		const multipleChange = changes._multiple ?? changes.multiple;
		const itemsChange = changes.items;
		const isOpenChange = changes.isOpen;
		const groupByChange = changes._groupBy ?? changes.groupBy;

		if (multipleChange?.firstChange) {
			this.itemsList.clearSelected(false);
		}

		if (itemsChange?.firstChange) {
			this._itemsAreUsed = true;
			this._setItems(itemsChange.currentValue || []);
		}

		if (isOpenChange) {
			this._manualOpen = isDefined(isOpenChange.currentValue);
		}

		if (groupByChange?.firstChange && !itemsChange) {
			this._setItems([...this.items()]);
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
			case KeyCode.Space:
				this.handleClearClick();
				$event.preventDefault();
				break;
		}
	}

	handleRemoveKeydown($event: KeyboardEvent, item: NgOption) {
		if (item.disabled) {
			return;
		}
		if ($event.key === KeyCode.Enter || $event.key === KeyCode.Space) {
			$event.preventDefault();
			$event.stopPropagation();
			this.unselect(item);
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
			this.itemsList.clearSelected(this.clearKeepsDisabledOptions());
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
		this.itemsList.clearSelected(false);
		this._updateNgModel();
	}

	writeValue(value: any | any[]): void {
		this.itemsList.clearSelected(false);
		this._handleWriteValue(value);
		if (this._editableSearchTermActive()) {
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

	/** Opens the select dropdown panel */
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
		// Attach synchronously (effects only flush on the next tick): consumers expect the
		// panel to be in the DOM right after open() returns
		this._syncDropdownOverlay();
		this.detectChanges();
	}

	/** Closes the select dropdown panel */
	close() {
		if (!this.isOpen() || this._manualOpen) {
			return;
		}
		this.isOpen.set(false);
		this._isComposing = false;
		if (!this._editableSearchTermActive()) {
			this._clearSearch();
		} else {
			this.itemsList.resetFilteredItems();
		}
		this.itemsList.unmarkItem();
		this._onTouched();
		this.closeEvent.emit();
		// Detach synchronously (effects only flush on the next tick): the panel must leave
		// the DOM without relying on zone-triggered change detection (#2765)
		this._syncDropdownOverlay();
		this.detectChanges();
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

		if (this._editableSearchTermActive()) {
			this._setSearchTermFromItems();
		}
	}

	select(item: NgOption) {
		if (!item.selected) {
			this.itemsList.select(item);
			if (this.clearSearchOnAddValue() && !this._editableSearchTermActive()) {
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

	/** Focuses the select element */
	focus() {
		this.searchInput().nativeElement.focus();
	}

	/** Blurs the select element */
	blur() {
		this.searchInput().nativeElement.blur();
	}

	unselect(item: NgOption) {
		if (!item || this.disabled() || item.disabled) {
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

		const handleTag = (item) => (this.typeahead()?.observed || !this.isOpen() ? this.itemsList.mapItem(item, null) : this.itemsList.addItem(item));
		if (isPromise(tag)) {
			tag.then((item) => this.select(handleTag(item))).catch(() => {});
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
			((empty && !this.typeahead()?.observed && !this.loading()) || (empty && this.typeahead()?.observed && this._validTerm() && !this.loading())) &&
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

		if (this._editableSearchTermActive()) {
			this._setSearchTermFromItems();
		}

		this.element.classList.add('ng-select-focused');
		this.focusEvent.emit($event);
		this._focused = true;
	}

	onInputBlur($event: FocusEvent) {
		this.element.classList.remove('ng-select-focused');
		this.blurEvent.emit($event);
		// When `selectOnTab` is enabled, commit the marked item on any focus loss, not just the literal Tab
		// key handled in `_handleTab` (e.g. mouse click-away or assistive-technology navigation). The Tab key
		// path calls `preventDefault()` and keeps focus, so this cannot double-select for that case.
		if (this.selectOnTab() && this.isOpen() && !this.disabled() && this.itemsList.markedItem && !this._isComposing) {
			this.toggleItem(this.itemsList.markedItem);
		}
		if (!this.isOpen() && !this.disabled()) {
			this._onTouched();
		}
		if (this._editableSearchTermActive()) {
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

	private _onChange = (_: any) => {};

	private _onTouched = () => {};

	private _handleSignalChanges() {
		let itemsInitialized = false;
		effect(
			() => {
				const items = this.items();

				if (!itemsInitialized) {
					itemsInitialized = true;
					return;
				}

				untracked(() => {
					this._itemsAreUsed = true;
					this._setItems(items || []);
				});
			},
			{ injector: this._injector },
		);

		let multipleInitialized = false;
		effect(
			() => {
				this.multiple();

				if (!multipleInitialized) {
					multipleInitialized = true;
					return;
				}

				untracked(() => this.itemsList.clearSelected(false));
			},
			{ injector: this._injector },
		);

		let groupByInitialized = false;
		effect(
			() => {
				this.groupBy();

				if (!groupByInitialized) {
					groupByInitialized = true;
					return;
				}

				untracked(() => this._setItems([...this.items()]));
			},
			{ injector: this._injector },
		);

		effect(
			() => {
				this.inputAttrs();
				const input = this.searchInput();

				if (!input) {
					return;
				}

				untracked(() => this._setInputAttributes());
			},
			{ injector: this._injector },
		);

		// open()/close() sync the overlay imperatively; this effect covers the paths that
		// bypass them — an [isOpen] binding (manual mode), programmatic isOpen.set(), and
		// dropdownPosition changes while open
		effect(
			() => {
				this.isOpen();
				this.dropdownPosition();
				// Track the template query too: with [isOpen] pre-set, the first run can happen
				// before view children resolve, and this re-runs the effect once they do
				this._dropdownTemplate();

				untracked(() => this._syncDropdownOverlay());
			},
			{ injector: this._injector },
		);
	}

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
				// Wait until all ng-option inputs are initialized (avoids _groupBy crash when values load async)
				if (options.length > 0 && !options.every((opt) => opt.isInitialized())) {
					return;
				}

				this.bindLabel.set(this._defaultLabel);
				const items = options.map((option) => ({
					$ngOptionValue: option.value(),
					$ngOptionLabel: option.elementRef.nativeElement.innerHTML,
					$ngOptionClasses: option.classes(),
					disabled: option.disabled(),
				}));
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
						item.classes = option.classes();
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
				this._console.warn(`Setting object(${JSON.stringify(item)}) as your model with bindValue is not allowed unless [compareWith] is used.`);
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
				} else {
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
						if (!item.disabled) {
							this.itemsList.markItem(item);
							this._scrollToMarked();
							// Required under zoneless CD: this subscription fires from a debounce
							// timer, which schedules nothing by itself
							this._cd.markForCheck();
						}
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
				let value;
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

		// Required under zoneless CD: sole notifier for the programmatic selection
		// APIs (select/unselect/clearModel/clearItem) called from non-Angular contexts
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
		if (this.isOpen() && this.deselectOnClickValue()) {
			// Make sure items are rendered.
			this._cd.detectChanges();
			this.dropdownPanel()?.adjustPosition();
		}
	}

	/** Attaches or detaches the dropdown overlay to match the current open state. Idempotent. */
	private _syncDropdownOverlay() {
		if (!this._dropdownTemplate()) {
			return;
		}
		if (this.isOpen()) {
			this._openDropdownOverlay(this.dropdownPosition());
		} else {
			this.dropdownOverlayRef?.detach();
		}
	}

	/**
	 * Creates the overlay on first open and (re)attaches the dropdown template to it.
	 * The panel always renders in the CDK overlay; `dropdownPosition` maps onto connected
	 * positions, with `auto` falling back to the opposite side when space runs out.
	 */
	private _openDropdownOverlay(position: DropdownPosition) {
		const overlayRef = this._ensureDropdownOverlay();
		this._dropdownPositionStrategy.withPositions(DROPDOWN_POSITIONS[position] ?? DROPDOWN_POSITIONS.auto);
		// Direction is snapshotted per open, matching how the previous implementation read
		// `document.documentElement.dir` when positioning an appended panel
		overlayRef.setDirection(this._document?.documentElement?.dir === 'rtl' ? 'rtl' : 'ltr');
		// The panel tracks the width of the select; the panel keeps it in sync on host resize
		overlayRef.updateSize({ width: this._dropdownOrigin().getBoundingClientRect().width });
		if (overlayRef.hasAttached()) {
			// Only `dropdownPosition` changed while open — re-evaluate with the new positions
			overlayRef.updatePosition();
			return;
		}
		this._dropdownPortal ??= new TemplatePortal(this._dropdownTemplate(), this._dropdownOutlet());
		overlayRef.attach(this._dropdownPortal);
	}

	/**
	 * The dropdown anchors to the `.ng-select-container` box, not the host: themes may pad
	 * the host below the container (material reserves 1.25em of subscript space under the
	 * underline), and the panel must sit flush against the visible field — the same anchor
	 * the pre-overlay `appendTo` positioning used.
	 */
	private _dropdownOrigin(): HTMLElement {
		return this._selectContainer()?.nativeElement ?? this.element;
	}

	private _ensureDropdownOverlay(): OverlayRef {
		const appendTo = this.appendTo() ?? this.config.appendTo ?? null;
		if (this.dropdownOverlayRef && appendTo !== this._overlayAppendTo) {
			// `appendTo` changed since the overlay was created — rebuild against the new host
			this._destroyDropdownOverlay();
		}
		if (!this.dropdownOverlayRef) {
			let injector = this._injector;
			let appendToHost: HTMLElement | null = null;
			if (appendTo) {
				appendToHost = this._resolveAppendToHost(appendTo);
				this._appendToContainer = runInInjectionContext(this._injector, () => new NgSelectAppendToOverlayContainer(appendToHost));
				injector = Injector.create({
					parent: this._injector,
					providers: [{ provide: OverlayContainer, useValue: this._appendToContainer }],
				});
			}
			this._dropdownPositionStrategy = createFlexibleConnectedPositionStrategy(injector, this._dropdownOrigin()).withFlexibleDimensions(false).withPush(false);
			if (appendToHost) {
				// Popover-capable browsers paint the panel in the top layer regardless of where it
				// lives in the DOM, so the `appendTo` host only determines DOM containment —
				// ancestor-scoped styles and focus enclosure. Browsers without the Popover API fall
				// back to the NgSelectAppendToOverlayContainer provided above instead.
				this._dropdownPositionStrategy.withPopoverLocation({ type: 'parent', element: appendToHost });
			}
			this._overlayAppendTo = appendTo;
			this.dropdownOverlayRef = createOverlayRef(injector, {
				positionStrategy: this._dropdownPositionStrategy,
				// Ancestor-scroll repositioning is handled by the panel's capture-phase document
				// listener, which also covers plain scroll containers that CDK's ScrollDispatcher
				// cannot see without a `cdkScrollable` marker (#2788)
				scrollStrategy: createNoopScrollStrategy(),
				// Detach must remove the panel from the DOM synchronously (#2765); the panel has
				// no CDK-driven animations to wait for
				disableAnimations: true,
			});
		}
		return this.dropdownOverlayRef;
	}

	private _destroyDropdownOverlay() {
		this.dropdownOverlayRef?.dispose();
		this.dropdownOverlayRef = null;
		this._dropdownPositionStrategy = null;
		this._appendToContainer?.ngOnDestroy();
		this._appendToContainer = null;
	}

	/** Resolves the `appendTo` selector against the select's own root, so a select inside a shadow root finds hosts in that same root. */
	private _resolveAppendToHost(selector: string): HTMLElement {
		const root = this.element.getRootNode();
		const scope = typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot ? root : this._document;
		const host = scope.querySelector<HTMLElement>(selector);
		if (!host) {
			throw new Error(`appendTo selector ${selector} did not found any parent element`);
		}
		return host;
	}

	private _warnDeprecatedInputs() {
		if (!isDevMode()) {
			return;
		}
		if (this.popover()) {
			this._console.warn(
				'[ng-select] `popover` is deprecated and has no effect: the dropdown panel now renders in an Angular CDK overlay, which uses the native Popover API top layer automatically in supporting browsers.',
			);
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
		return this.addTag() && this.searchTerm && this.itemsList.markedItem && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length);
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
		return isDefined(this._virtualScroll()) ? this._virtualScroll()! : this.isVirtualScrollDisabled(config);
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
