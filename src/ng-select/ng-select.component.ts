import {
    Component,
    OnInit,
    OnDestroy,
    OnChanges,
    AfterViewInit,
    forwardRef,
    ChangeDetectorRef,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    TemplateRef,
    ViewEncapsulation,
    HostListener,
    HostBinding,
    ViewChild,
    ElementRef,
    ChangeDetectionStrategy,
    Inject,
    SimpleChanges,
    Renderer2, ContentChildren, QueryList,
    InjectionToken
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgHeaderTemplateDirective,
    NgFooterTemplateDirective
} from './ng-templates.directive';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { NgOption, KeyCode, NgSelectConfig } from './ng-select.types';
import { ItemsList } from './items-list';
import { Subject } from 'rxjs/Subject';
import { NgOptionComponent } from './ng-option.component';

export const NG_SELECT_DEFAULT_CONFIG = new InjectionToken<NgSelectConfig>('ng-select-default-options');

const NG_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectComponent),
    multi: true
};

@Component({
    selector: 'ng-select',
    templateUrl: './ng-select.component.html',
    styleUrls: ['./ng-select.component.scss'],
    providers: [NG_SELECT_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'role': 'dropdown',
        'class': 'ng-select',
        '[class.top]': 'currentDropdownPosition === "top"',
        '[class.bottom]': 'currentDropdownPosition === "bottom"',
        '[class.ng-single]': '!this.multiple',
        '[class.ng-selected]': '_hasValue'
    }
})
export class NgSelectComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor {

    // inputs
    @Input() items: any[] = [];
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() clearable = true;
    @Input() markFirst = true;
    @Input() disableVirtualScroll = false;
    @Input() placeholder: string;
    @Input() notFoundText: string;
    @Input() typeToSearchText: string;
    @Input() addTagText: string;
    @Input() loadingText: string;
    @Input() clearAllText: string;
    @Input() dropdownPosition: 'bottom' | 'top' | 'auto';
    @Input() appendTo: string;
    @Input() loading = false;
    @Input() closeOnSelect = true;
    @Input() maxSelectedItems: number;
    @Input() groupBy: string;
    @Input() @HostBinding('class.typeahead') typeahead: Subject<string>;
    @Input() @HostBinding('class.ng-multiple') multiple = false;
    @Input() @HostBinding('class.taggable') addTag: boolean | ((term: string) => NgOption) = false;
    @Input() @HostBinding('class.searchable') searchable = true;

    // output events
    @Output('blur') blurEvent = new EventEmitter();
    @Output('focus') focusEvent = new EventEmitter();
    @Output('change') changeEvent = new EventEmitter();
    @Output('open') openEvent = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();
    @Output('search') searchEvent = new EventEmitter();
    @Output('clear') clearEvent = new EventEmitter();
    @Output('add') addEvent = new EventEmitter();
    @Output('remove') removeEvent = new EventEmitter();

    // custom templates
    @ContentChild(NgOptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;
    @ContentChild(NgLabelTemplateDirective, { read: TemplateRef }) labelTemplate: TemplateRef<any>;
    @ContentChild(NgHeaderTemplateDirective, { read: TemplateRef }) headerTemplate: TemplateRef<any>;
    @ContentChild(NgFooterTemplateDirective, { read: TemplateRef }) footerTemplate: TemplateRef<any>;

    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ViewChild('dropdownPanel') dropdownPanel: ElementRef;
    @ContentChildren(NgOptionComponent, { descendants: true }) ngOptions: QueryList<NgOptionComponent>;
    @ViewChild('filterInput') filterInput: ElementRef;

    @HostBinding('class.opened') isOpen = false;
    @HostBinding('class.focused') isFocused = false;
    @HostBinding('class.disabled') isDisabled = false;
    @HostBinding('class.filtered') get filtered() { return !!this.filterValue };

    itemsList = new ItemsList(this);
    viewPortItems: NgOption[] = [];
    filterValue: string = null;
    currentDropdownPosition: 'bottom' | 'top' | 'auto' = 'bottom';

    private _ngModel: any = null;
    private _defaultLabel = 'label';
    private _defaultValue = 'value';
    private _typeaheadLoading = false;

    private _onChange = (_: NgOption) => { };
    private _onTouched = () => { };
    private _disposeDocumentClickListener = () => { };
    private _disposeDocumentResizeListener = () => { };

    clearItem = (item: any) => {
        const option = this.selectedItems.find(x => x.value === item);
        this.unselect(option);
    };

    constructor( @Inject(NG_SELECT_DEFAULT_CONFIG) config: NgSelectConfig,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        this._mergeGlobalConfig(config);
    }

    get selectedItems(): NgOption[] {
        return this.itemsList.value;
    }

    get isLoading() {
        return this.loading || this._typeaheadLoading;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.multiple) {
            this.itemsList.clearSelected();
        }
        if (changes.items) {
            this._setItems(changes.items.currentValue || []);
        }
        if (changes.dropdownPosition) {
            this.currentDropdownPosition = changes.dropdownPosition.currentValue;
        }
    }

    ngOnInit() {
        this._handleDocumentClick();
    }

    ngAfterViewInit() {
        if (this.ngOptions.length > 0 && this.items.length === 0) {
            this._setItemsFromNgOptions();
        }

        if (this.appendTo) {
            this._handleAppendTo();
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this._disposeDocumentClickListener();
        this._disposeDocumentResizeListener();
        if (this.appendTo) {
            this.elementRef.nativeElement.appendChild(this.dropdownPanel.nativeElement);
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown($event: KeyboardEvent) {
        if (KeyCode[$event.which]) {
            switch ($event.which) {
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
                    break;
                case KeyCode.Backspace:
                    this._handleBackspace();
                    break;
            }
        }
    }

    handleArrowClick($event: Event) {
        $event.stopPropagation();
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    handleClearClick($event: Event) {
        $event.stopPropagation();
        if (this._hasValue) {
            this.clearModel();
        }
        this._clearSearch();
        this._focusSearchInput();
        if (this._isTypeahead) {
            this.typeahead.next(null);
        }
        this.clearEvent.emit();
    }

    clearModel() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this._updateNgModel();
    }

    writeValue(value: any | any[]): void {
        this._ngModel = value;
        this._validateWriteValue(value);
        this.itemsList.clearSelected();
        this._selectWriteValue(value);
        this.detectChanges();
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    toggle() {
        if (!this.isOpen) {
            this.open();
        } else {
            this.close();
        }
    }

    open() {
        if (this.isDisabled || this.isOpen || this.itemsList.maxItemsSelected()) {
            return;
        }
        this.isOpen = true;
        this.itemsList.markSelectedOrDefault(this.markFirst);
        this._scrollToMarked();
        this.openEvent.emit();
        if (!this.filterValue) {
            this._focusSearchInput();
        }
        if (this.dropdownPosition === 'auto') {
            this._autoPositionDropdown();
        }
        if (this.appendTo) {
            this._updateAppendedDropdownPosition();
        }
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this._clearSearch();
        this._onTouched();
        this.closeEvent.emit();
    }

    toggleItem(item: NgOption) {
        if (!item || item.disabled || this.isDisabled) {
            return;
        }

        if (this.multiple && item.selected) {
            this.unselect(item);
        } else {
            this.select(item);
        }
    }

    select(item: NgOption) {
        if (!item.selected) {
            this.itemsList.select(item);
            this._clearSearch();
            this._updateNgModel();
            this.addEvent.emit(item.value);
        }

        if (this.closeOnSelect) {
            this.close();
        }
    }

    unselect(item: NgOption) {
        this.itemsList.unselect(item);
        this._updateNgModel();
        this.removeEvent.emit(item);
    }

    selectTag() {
        let tag = {};
        if (this.addTag instanceof Function) {
            tag = this.addTag(this.filterValue)
        } else {
            tag[this.bindLabel] = this.filterValue;
        }

        const item = this.itemsList.addItem(tag);
        this.select(item);
    }

    showClear() {
        return this.clearable && (this._hasValue || this.filterValue) && !this.isDisabled;
    }

    showAddTag() {
        return this.addTag &&
            this.filterValue &&
            !this.itemsList.filteredItems.some(x => x.label.toLowerCase() === this.filterValue.toLowerCase()) &&
            !this.isLoading;
    }

    showFilter() {
        return !this.isDisabled;
    }

    showNoItemsFound() {
        const empty = this.itemsList.filteredItems.length === 0;
        return (empty && !this._isTypeahead && !this.loading) ||
            (empty && this._isTypeahead && this.filterValue && !this.isLoading);
    }

    showTypeToSearch() {
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this._isTypeahead && !this.filterValue && !this.isLoading;
    }

    filter(term: string) {
        if (!this.searchable) {
            return;
        }
        this.filterValue = term;
        this.open();

        if (this._isTypeahead) {
            this._typeaheadLoading = true;
            this.typeahead.next(this.filterValue);
        } else {
            this.itemsList.filter(this.filterValue);
            this.itemsList.markSelectedOrDefault(this.markFirst);
        }
    }

    onInputFocus() {
        this.isFocused = true;
        this.focusEvent.emit(null);
    }

    onInputBlur() {
        this.isFocused = false;
        this.blurEvent.emit(null);
        if (!this.isOpen && !this.isDisabled) {
            this._onTouched();
        }
    }

    onItemHover(item: NgOption) {
        if (item.disabled) {
            return;
        }
        this.itemsList.markItem(item);
    }

    detectChanges() {
        if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }

    private _setItems(items: any[]) {
        const firstItem = items[0];
        this.bindLabel = this.bindLabel || this._defaultLabel;
        const simple = firstItem && !(firstItem instanceof Object);
        this.itemsList.setItems(items, simple);
        if (this._isDefined(this._ngModel) && items.length > 0) {
            this.itemsList.clearSelected();
            this._selectWriteValue(this._ngModel);
        }

        if (this._isTypeahead) {
            this._typeaheadLoading = false;
            this.itemsList.markSelectedOrDefault(this.markFirst);
        }
    }

    private _setItemsFromNgOptions() {
        this.bindLabel = this.bindLabel || this._defaultLabel;
        this.bindValue = this.bindValue || this._defaultValue;
        const handleNgOptions = (options: QueryList<NgOptionComponent>) => {
            this.items = options.map(option => ({
                value: option.value,
                label: option.elementRef.nativeElement.innerHTML
            }));
            this.itemsList.setItems(this.items, false);

            if (this._isDefined(this._ngModel)) {
                this.itemsList.clearSelected();
                this._selectWriteValue(this._ngModel);
            }
            this.detectChanges();
        };

        this.ngOptions.changes.subscribe(options => handleNgOptions(options));
        handleNgOptions(this.ngOptions);
    }

    private _handleDocumentClick() {
        const handler = ($event: any) => {
            // prevent close if clicked on select
            if (this.elementRef.nativeElement.contains($event.target)) {
                return;
            }

            // prevent close if clicked on dropdown menu
            const dropdown = this._getDropdownMenu();
            if (dropdown && dropdown.contains($event.target)
            ) {
                return;
            }

            if (this.isFocused) {
                this.onInputBlur();
                this.changeDetectorRef.markForCheck();
            }

            if (this.isOpen) {
                this.close();
                this.changeDetectorRef.markForCheck();
            }
        };

        this._disposeDocumentClickListener = this.renderer.listen('document', 'click', handler);
    }

    private _handleDocumentResize() {
        const handler = () => {
            if (this.appendTo && this.isOpen) {
                this._updateAppendedDropdownPosition();
            }
        };

        this._disposeDocumentResizeListener = this.renderer.listen('window', 'resize', handler);
    }

    private _handleAppendTo() {
        if (this.appendTo === 'body') {
            document.body.appendChild(this.dropdownPanel.nativeElement);
        } else {
            const parent = document.querySelector(this.appendTo);
            if (!parent) {
                throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`)
            }
            parent.appendChild(this.dropdownPanel.nativeElement);
        }
        this._handleDocumentResize();
        this._updateAppendedDropdownPosition();
    }

    private _updateAppendedDropdownPosition() {
        const select: HTMLElement = this.elementRef.nativeElement;
        const dropdownPanel: HTMLElement = this.dropdownPanel.nativeElement;
        const bodyRect = document.body.getBoundingClientRect();
        const selectRect = select.getBoundingClientRect();
        const offsetTop = selectRect.top - bodyRect.top;
        const offsetLeft = selectRect.left - bodyRect.left;
        const topDelta = this.currentDropdownPosition === 'bottom' ? selectRect.height : -dropdownPanel.clientHeight;
        dropdownPanel.style.top = offsetTop + topDelta + 'px';
        dropdownPanel.style.bottom = 'auto';
        dropdownPanel.style.left = offsetLeft + 'px';
        dropdownPanel.style.width = selectRect.width + 'px';
    }

    private _autoPositionDropdown() {
        const selectRect = this.elementRef.nativeElement.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectRect.top + window.pageYOffset;
        const height = selectRect.height;
        const dropdownHeight = this.dropdownPanel.nativeElement.getBoundingClientRect().height;

        if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
            this.currentDropdownPosition = 'top';
        } else {
            this.currentDropdownPosition = 'bottom';
        }
    }

    private _validateWriteValue(value: any) {
        if (!this._isDefined(value)) {
            return;
        }

        const validateBinding = (item: any) => {
            if (item instanceof Object && this.bindValue) {
                throw new Error('Binding object with bindValue is not allowed.');
            }
        };

        if (this.multiple) {
            if (!Array.isArray(value)) {
                throw new Error('Multiple select model should be array.');
            }
            value.forEach(item => validateBinding(item));
        } else {
            validateBinding(value);
        }
    }

    private _selectWriteValue(ngModel: any | any[]) {
        if (!this._isDefined(ngModel)) {
            return;
        }

        const select = (val: any) => {
            const item = this.itemsList.findItem(val);
            if (item) {
                this.itemsList.select(item);
            } else {
                const isObject = val instanceof Object;
                const simpleValue = !isObject && !this.bindValue;
                if (isObject || simpleValue) {
                    this.itemsList.select(this.itemsList.mapItem(val, simpleValue, null));
                }
            }
        };

        if (this.multiple) {
            (<any[]>ngModel).forEach(item => {
                select(item);
            });
        } else {
            select(ngModel);
        }
    }

    private _updateNgModel() {
        let ngModel = this._value;
        if (!this._isDefined(ngModel)) {
            this._onChange(null);
        } else if (this.bindValue) {
            if (Array.isArray(ngModel)) {
                ngModel = ngModel.map(option => this.itemsList.resolveNested(option, this.bindValue))
            } else {
                ngModel = this.itemsList.resolveNested(ngModel, this.bindValue);
            }
            this._onChange(ngModel);
        } else {
            this._onChange(ngModel);
        }
        this._ngModel = ngModel;
        this.changeEvent.emit(this._value);
        this.changeDetectorRef.markForCheck();
    }

    private _clearSearch() {
        this.filterValue = null;
        this.itemsList.clearFilter();
    }

    private _focusSearchInput() {
        setTimeout(() => {
            this.filterInput.nativeElement.focus();
            this.filterInput.nativeElement.select();
        });
    }

    private _scrollToMarked() {
        this.dropdownList.scrollInto(this.itemsList.markedItem);
    }

    private _handleTab(_: KeyboardEvent) {
        if (this.isOpen) {
            this.close();
        }
    }

    private _handleEnter($event: KeyboardEvent) {
        if (this.isOpen) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
            } else if (this.addTag) {
                this.selectTag();
            }
        }
        $event.preventDefault();
    }

    private _handleSpace($event: KeyboardEvent) {
        if (this.isOpen) {
            return;
        }
        this.open();
        $event.preventDefault();
    }

    private _handleArrowDown($event: KeyboardEvent) {
        this.open();
        if (this.nextItemIsTag(+1)) {
            this.itemsList.unmarkItem();
            this.dropdownList.scrollIntoTag();
        } else {
            this.itemsList.markNextItem();
            this._scrollToMarked();
        }
        $event.preventDefault();
    }

    private _handleArrowUp($event: KeyboardEvent) {
        if (!this.isOpen) {
            return;
        }

        if (this.nextItemIsTag(-1)) {
            this.itemsList.unmarkItem();
            this.dropdownList.scrollIntoTag();
        } else {
            this.itemsList.markPreviousItem();
            this._scrollToMarked();
        }
        $event.preventDefault();
    }

    private nextItemIsTag(nextStep: number): boolean {
        const nextIndex = this.itemsList.markedIndex + nextStep;
        return this.addTag && this.filterValue
            && this.itemsList.markedItem
            && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length)
    }

    private _handleBackspace() {
        if (this.filterValue || !this.clearable || !this._hasValue) {
            return;
        }

        if (this.multiple) {
            this.itemsList.unselectLast();
            this._updateNgModel();
        } else {
            this.clearModel();
        }
    }

    private _getDropdownMenu() {
        if (!this.isOpen || !this.dropdownList) {
            return null;
        }
        return <HTMLElement>this.elementRef.nativeElement.querySelector('.ng-menu-outer');
    }

    private get _isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }

    private get _value() {
        if (this.multiple) {
            return this.selectedItems.map(option => option.value);
        }
        const selectedItem = this.selectedItems[0];
        return selectedItem ? selectedItem.value : null;
    }

    private get _hasValue() {
        return this.selectedItems.length > 0;
    }

    private _mergeGlobalConfig(config: NgSelectConfig) {
        this.notFoundText = this.notFoundText || config.notFoundText;
        this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
        this.addTagText = this.addTagText || config.addTagText;
        this.loadingText = this.loadingText || config.loadingText;
        this.clearAllText = this.clearAllText || config.clearAllText;
        this.disableVirtualScroll = this.disableVirtualScroll || config.disableVirtualScroll;
    }

    private _isDefined(value: any) {
        return value !== null && value !== undefined;
    }
}
