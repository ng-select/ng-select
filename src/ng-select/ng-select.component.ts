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
    Optional,
    SimpleChanges,
    Renderer2, ContentChildren, QueryList
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { NgOption, KeyCode, NgSelectConfig } from './ng-select.types';
import { ItemsList } from './items-list';
import { Subject } from 'rxjs/Subject';
import { NgOptionComponent } from './ng-option.component';

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
        'role': 'dropdown'
    }
})
export class NgSelectComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor {

    @ContentChild(NgOptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;
    @ContentChild(NgLabelTemplateDirective, { read: TemplateRef }) labelTemplate: TemplateRef<any>;

    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ContentChildren(NgOptionComponent, { descendants: true }) ngOptions: QueryList<NgOptionComponent>;
    @ViewChild('filterInput') filterInput;

    // inputs
    @Input() items = [];
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() clearable = true;
    @Input() placeholder: string;
    @Input() notFoundText = 'No items found';
    @Input() typeToSearchText = 'Type to search';
    @Input() addTagText = 'Add item';

    @Input()
    @HostBinding('class.typeahead') typeahead: Subject<string>;

    @Input()
    @HostBinding('class.ng-multiple') multiple = false;

    @Input()
    @HostBinding('class.taggable') addTag: boolean | ((term) => NgOption) = false;

    @Input()
    @HostBinding('class.searchable') searchable = true;

    // output events
    @Output('blur') blurEvent = new EventEmitter();
    @Output('focus') focusEvent = new EventEmitter();
    @Output('change') changeEvent = new EventEmitter();
    @Output('open') openEvent = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();
    @Output('search') searchEvent = new EventEmitter();

    @HostBinding('class.ng-single')
    get single() {
        return !this.multiple;
    }

    @HostBinding('class.opened') isOpen = false;
    @HostBinding('class.focused') isFocused = false;
    @HostBinding('class.disabled') isDisabled = false;
    @HostBinding('class.filtered') get filtered() { return !!this.filterValue };

    itemsList = new ItemsList();
    viewPortItems: NgOption[] = [];
    isLoading = false;
    filterValue: string = null;

    private _ngModel = null;
    private _simple = false;
    private _defaultLabel = 'label';
    private _defaultValue = 'value';

    private onChange = (_: NgOption) => { };
    private onTouched = () => { };
    private disposeDocumentClickListener = () => { };

    clearItem = (item) => this.unselect(item);

    get selectedItems(): NgOption[] {
        return this.itemsList.value;
    }

    constructor( @Optional() config: NgSelectConfig,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        this.mergeConfig(config);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.multiple) {
            this.itemsList.setMultiple(changes.multiple.currentValue);
        }
        if (changes.items) {
            this.setItems(changes.items.currentValue || []);
        }
    }

    ngOnInit() {
        this.handleDocumentClick();
        this.bindLabel = this.bindLabel || this._defaultLabel;
        if (this._simple) {
            this.bindValue = this._defaultLabel;
        }
    }

    ngAfterViewInit() {
        if (this.ngOptions.length > 0 && this.items.length === 0) {
            this.setItemsFromNgOptions();
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.disposeDocumentClickListener();
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown($event: KeyboardEvent) {
        if (KeyCode[$event.which]) {
            switch ($event.which) {
                case KeyCode.ArrowDown:
                    this.handleArrowDown($event);
                    break;
                case KeyCode.ArrowUp:
                    this.handleArrowUp($event);
                    break;
                case KeyCode.Space:
                    this.handleSpace($event);
                    break;
                case KeyCode.Enter:
                    this.handleEnter($event);
                    break;
                case KeyCode.Tab:
                    this.handleTab($event);
                    break;
                case KeyCode.Esc:
                    this.close();
                    break;
                case KeyCode.Backspace:
                    this.handleBackspace();
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
        this.clear();
        this.focusSearchInput();
    }

    clear() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this.clearSearch();
        this.notifyModelChanged();
        if (this.isTypeahead()) {
            this.typeahead.next(null);
        }
    }

    writeValue(value: any | any[]): void {
        this._ngModel = value;
        this.validateWriteValue(value);
        this.itemsList.clearSelected();
        this.selectWriteValue(value);
        this.detectChanges();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    open() {
        if (this.isDisabled || this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.itemsList.markItem();
        this.scrollToMarked();
        this.focusSearchInput();
        this.openEvent.emit();
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.clearSearch();
        this.closeEvent.emit();
    }

    toggle(item: NgOption) {
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
            this.clearSearch();
            this.updateModel();
        }

        if (this.single) {
            this.close();
        }
    }

    unselect(item: NgOption) {
        this.itemsList.unselect(item);
        this.updateModel();
    }

    selectTag() {
        let tag = {}
        if (this.addTag instanceof Function) {
            tag = this.addTag(this.filterValue);
        } else {
            tag[this.bindLabel] = this.filterValue;
        }

        this.itemsList.addItem(tag);
        this.select(tag);
    }

    showPlaceholder() {
        return this.placeholder && !this.isValueSet && !this.filterValue;
    }

    showClear() {
        return this.clearable && (this.isValueSet || this.filterValue) && !this.isDisabled;
    }

    showFilter() {
        return !this.isDisabled;
    }

    showNoItemsFound() {
        const empty = this.itemsList.filteredItems.length === 0;
        return (empty && !this.isTypeahead()) ||
            (empty && this.isTypeahead() && this.filterValue && !this.isLoading);
    }

    showTypeToSearch() {
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this.isTypeahead() && !this.filterValue && !this.isLoading;
    }

    onFilter($event) {
        if (!this.searchable) {
            return;
        }

        if (!this.isOpen) {
            this.open();
        }

        this.filterValue = $event.target.value;

        if (this.isTypeahead()) {
            this.isLoading = true;
            this.typeahead.next(this.filterValue);
        } else {
            this.itemsList.filter(this.filterValue, this.bindLabel);
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
            this.onTouched();
        }
    }

    onItemHover(item: NgOption) {
        if (item.disabled) {
            return;
        }
        this.itemsList.markItem(item);
    }

    private setItems(items: NgOption[]) {
        const firstItem = items[0];
        this._simple = firstItem && !(firstItem instanceof Object);
        this.itemsList.setItems(items, this._simple);
        if (this._ngModel) {
            this.itemsList.clearSelected();
            this.selectWriteValue(this._ngModel);
        }
        if (this.isTypeahead()) {
            this.isLoading = false;
            this.itemsList.markItem();
        }
    }

    private setItemsFromNgOptions() {
        if (!this.bindValue) {
            this.bindValue = 'value';
        }

        const handleNgOptions = (options) => {
            this.items = options.map(option => ({
                value: option.value,
                label: option.elementRef.nativeElement.innerHTML
            }));
            this.itemsList.setItems(this.items);

            if (this._ngModel) {
                this.itemsList.clearSelected();
                this.selectWriteValue(this._ngModel);
            }
            this.detectChanges();
        };

        this.ngOptions.changes.subscribe(options => handleNgOptions(options));
        handleNgOptions(this.ngOptions);
    }

    private handleDocumentClick() {
        const handler = ($event) => {
            // prevent close if clicked on select
            if (this.elementRef.nativeElement.contains($event.target)) {
                return;
            }

            // prevent close if clicked on dropdown menu
            const dropdown = this.getDropdownMenu();
            if (dropdown && dropdown.contains($event.target)
            ) {
                return;
            }

            if (this.isFocused) {
                this.onInputBlur();
            }

            if (this.isOpen) {
                this.close();
            }
        };

        this.disposeDocumentClickListener = this.renderer.listen('document', 'click', handler);
    }

    private validateWriteValue(value: any) {
        if (!value) {
            return;
        }

        const validateBinding = (item) => {
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

    private selectWriteValue(value: any | any[]) {
        if (!value) {
            return;
        }

        const select = (val: any) => {
            let item = this.itemsList.findItem(val, this.bindValue, this.bindLabel);
            if (item) {
                this.itemsList.select(item);
            } else {
                if (val instanceof Object) {
                    this.itemsList.addItem(val);
                    this.itemsList.select(val);
                }
            }
        };

        if (this.multiple) {
            (<any[]>value).forEach(item => {
                select(item);
            });
        } else {
            select(value);
        }
    }

    private updateModel() {
        this.notifyModelChanged();
        this.changeDetectorRef.markForCheck();
    }

    private clearSearch() {
        this.filterValue = null;
        this.itemsList.clearFilter();
    }

    private focusSearchInput() {
        setTimeout(() => {
            this.filterInput.nativeElement.focus();
            this.filterInput.nativeElement.select();
        });
    }

    private scrollToMarked() {
        this.dropdownList.scrollInto(this.itemsList.markedItem);
    }

    private handleTab($event: KeyboardEvent) {
        if (this.isOpen) {
            this.close();
        }
    }

    private handleEnter($event: KeyboardEvent) {
        if (this.isOpen) {
            if (this.itemsList.markedItem) {
                this.toggle(this.itemsList.markedItem);
            } else if (this.addTag) {
                this.selectTag();
            }
        }
        $event.preventDefault();
    }

    private handleSpace($event: KeyboardEvent) {
        if (this.isOpen) {
            return;
        }
        this.open();
        $event.preventDefault();
    }

    private handleArrowDown($event: KeyboardEvent) {
        if (!this.isOpen) {
            this.open();
        } else {
            this.itemsList.markNextItem();
            this.scrollToMarked();
        }
        $event.preventDefault();
    }

    private handleArrowUp($event: KeyboardEvent) {
        this.itemsList.markPreviousItem();
        this.scrollToMarked();
        $event.preventDefault();
    }

    private handleBackspace() {
        if (this.filterValue || !this.clearable || !this.isValueSet) {
            return;
        }

        if (this.multiple) {
            this.itemsList.unselectLastItem();
            this.updateModel();
        } else {
            this.clear();
        }
    }

    private notifyModelChanged() {
        let ngModel = this.value;
        if (!ngModel) {
            this.onChange(null);
        } else if (this.bindValue) {
            ngModel = Array.isArray(ngModel) ?
                ngModel.map(x => x[this.bindValue]) :
                ngModel[this.bindValue];
            this.onChange(ngModel);
        } else {
            this.onChange(ngModel);
        }
        this._ngModel = ngModel;
        this.changeEvent.emit(this.value);
    }

    private getDropdownMenu() {
        if (!this.isOpen || !this.dropdownList) {
            return null;
        }
        return <HTMLElement>this.elementRef.nativeElement.querySelector('.ng-menu-outer');
    }

    private isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }

    private detectChanges() {
        if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }

    private get value() {
        if (this.multiple) {
            return this.selectedItems;
        }
        return this.selectedItems[0] || null;
    }

    private get isValueSet() {
        return this.selectedItems.length > 0;
    }

    private mergeConfig(config: NgSelectConfig) {
        if (!config) {
            return;
        }
        this.notFoundText = config.notFoundText || this.notFoundText;
        this.typeToSearchText = config.typeToSearchText || this.typeToSearchText;
        this.addTagText = config.addTagText || this.addTagText;
    }
}
