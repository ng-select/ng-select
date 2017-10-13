import {
    Component,
    OnInit,
    OnDestroy,
    OnChanges,
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
    Renderer2
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { NgOption, KeyCode, NgSelectConfig } from './ng-select.types';
import { ItemsList } from './items-list';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/operator/withLatestFrom';

const NGB_ANG_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgSelectComponent),
    multi: true
};

@Component({
    selector: 'ng-select',
    templateUrl: './ng-select.component.html',
    styleUrls: ['./ng-select.component.scss'],
    providers: [NGB_ANG_SELECT_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'role': 'dropdown'
    }
})
export class NgSelectComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {

    @ContentChild(NgOptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;
    @ContentChild(NgLabelTemplateDirective, { read: TemplateRef }) labelTemplate: TemplateRef<any>;

    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ViewChild('filterInput') filterInput;

    // inputs
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() clearable = true;
    @Input() placeholder: string;
    @Input() notFoundText = 'No items found';
    @Input() typeToSearchText = 'Type to search';
    @Input() typeahead: Subject<string>;

    @Input()
    @HostBinding('class.ng-multiple') multiple = false;

    // output events
    @Output('blur') blurEvent = new EventEmitter();
    @Output('focus') focusEvent = new EventEmitter();
    @Output('change') changeEvent = new EventEmitter();
    @Output('open') openEvent = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();
    @Output('search') searchEvent = new EventEmitter();

    clearEvent = new EventEmitter<NgOption>();

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

    private _items$ = new Subject<boolean>();
    private _writeValue$ = new Subject<NgOption | NgOption[]>();
    private _checkWriteValue = false;
    private _writeValueHandler$ = null;

    private onChange = (_: NgOption) => { };
    private onTouched = () => { };
    private disposeDocumentClickListener = () => { };

    constructor( @Optional() config: NgSelectConfig,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        this.mergeConfig(config);
        this.handleWriteValue();
        this.handleClearEvent();
    }

    @Input()
    get items(): NgOption[] {
        return this.itemsList.items;
    }

    set items(items: NgOption[]) {
        this.setItems(items || []);
        this._items$.next(true);
    }

    get selectedItems(): NgOption[] {
        return this.itemsList.value;
    }

    ngOnInit() {
        this.handleDocumentClick();
        this.bindLabel = this.bindLabel || 'label';
    }

    ngOnChanges(changes) {
        if (changes.multiple) {
            this.itemsList.setMultiple(changes.multiple.currentValue);
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.disposeDocumentClickListener();
        this._writeValueHandler$.unsubscribe();
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

    handleSelectClick($event: Event) {
        $event.stopPropagation();
        this.open();
    }

    handleClearClick($event: Event) {
        $event.stopPropagation();
        this.clear();
    }

    clear() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this.clearSearch();
        this.notifyModelChanged();
        if (this.isTypeahead()) {
            this.typeahead.next(this.filterValue);
        }
    }

    writeValue(value: any): void {
        this._checkWriteValue = true;
        this._writeValue$.next(value);
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
        this._checkWriteValue = false;
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

    showPlaceholder() {
        return this.placeholder && !this.isValueSet(this.selectedItems) && !this.filterValue;
    }

    showClear() {
        return this.clearable && (this.isValueSet(this.selectedItems) || this.filterValue) && !this.isDisabled;
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

    private handleWriteValue() {
        // combineLatest ensures that write value is always set after latest items are loaded
        this._writeValueHandler$ = Observable.combineLatest(this._items$, this._writeValue$).subscribe((result) => {
            if (!this._checkWriteValue) {
                return;
            }
            const value = result[1];
            this.validateWriteValue(value);
            this.itemsList.clearSelected();
            if (value) {
                if (this.multiple) {
                    (<NgOption[]>value).forEach(item => {
                        this.selectWriteValue(item);
                    });
                } else {
                    this.selectWriteValue(value);
                }
            }
            this.detectChanges();
        });
    }

    private setItems(items: NgOption[]) {
        this.itemsList.setItems(items);
        if (this.isTypeahead()) {
            this.isLoading = false;
            this.itemsList.markItem();
        }
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

    private selectWriteValue(value: any) {
        let item = this.itemsList.findItem(value, this.bindLabel, this.bindValue);
        if (item) {
            this.itemsList.select(item);
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
            this.filterInput.nativeElement.focus(); // TODO: this won't work on mobile
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
            this.toggle(this.itemsList.markedItem);
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
        if (this.filterValue) {
            return;
        }

        if (this.multiple) {
            this.itemsList.unselectLastItem();
            this.updateModel();
        } else {
            this.clear();
        }
    }

    private handleClearEvent() {
        this.clearEvent.subscribe(item => {
            this.unselect(item);
        });
    }

    private notifyModelChanged() {
        const value = this.value;
        if (!value) {
            this.onChange(null);
        } else if (this.bindValue) {
            const bindValue = Array.isArray(value) ?
                value.map(x => x[this.bindValue]) :
                value[this.bindValue];
            this.onChange(bindValue);
        } else {
            this.onChange(value);
        }
        this.changeEvent.emit(value);
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

    private isValueSet(value: any): boolean {
        return !!value && value.length > 0;
    }

    private mergeConfig(config: NgSelectConfig) {
        if (!config) {
            return;
        }
        this.notFoundText = config.notFoundText || this.notFoundText;
        this.typeToSearchText = config.typeToSearchText || this.typeToSearchText;
    }
}
