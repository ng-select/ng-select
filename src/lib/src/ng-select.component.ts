import {
    Component,
    OnInit,
    OnDestroy,
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
export class NgSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

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
    @HostBinding('class.as-multiple') multiple = false;

    // output events
    @Output('blur') onBlur = new EventEmitter();
    @Output('focus') onFocus = new EventEmitter();
    @Output('change') onChange = new EventEmitter();
    @Output('open') onOpen = new EventEmitter();
    @Output('close') onClose = new EventEmitter();
    @Output('search') onSearch = new EventEmitter();

    @HostBinding('class.as-single')
    get single() {
        return !this.multiple;
    }

    @HostBinding('class.opened') isOpen = false;
    @HostBinding('class.focused') isFocused = false;
    @HostBinding('class.disabled') isDisabled = false;

    itemsList = new ItemsList([], false);
    viewPortItems: NgOption[] = [];
    isLoading = false;
    filterValue: string = null;

    private propagateChange = (_: NgOption) => {};
    private disposeDocumentClickListener = () => {};

    constructor(@Optional() config: NgSelectConfig,
                private changeDetectorRef: ChangeDetectorRef,
                private elementRef: ElementRef,
                private renderer: Renderer2
    ) {
        this.mergeConfig(config);
    }

    @Input()
    get items(): NgOption[] {
        return this.itemsList.items;
    }

    set items(items: NgOption[]) {
        this.itemsList = new ItemsList(items || [], this.multiple);

        if (this.isTypeahead()) {
            this.handleItemsChange();
        }
    }

    get value(): NgOption | NgOption[] {
        return this.itemsList.value;
    }

    ngOnInit() {
        this.handleDocumentClick();
        this.bindLabel = this.bindLabel || 'label';
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
    }

    writeValue(value: any): void {
        this.itemsList.clearSelected();
        if (value) {
            if (this.multiple) {
                value.forEach(item => {
                    this.selectWriteValue(item);
                });
            } else {
                this.selectWriteValue(value);
            }
        }
        this.detectChanges();
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        // TODO: touch event
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
        this.onOpen.emit();
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.clearSearch();
        this.onClose.emit();
    }

    getLabelValue(value: NgOption) {
        return value ? value[this.bindLabel] : '';
    }

    getDisplayTemplateContext() {
        return this.itemsList.value ? { item: this.itemsList.value } : { item: {} };
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
        return this.placeholder && !this.isValueSet(this.value) && !this.filterValue;
    }

    showValue() {
        return !this.filterValue && this.isValueSet(this.value);
    }

    showClear() {
        return this.clearable && (this.isValueSet(this.value) || this.filterValue) && !this.isDisabled;
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

    onInputFocus($event) {
        this.isFocused = true;
        this.onFocus.emit($event);
    }

    onInputBlur($event) {
        this.isFocused = false;
        this.onBlur.emit($event);
    }

    onItemHover(item: NgOption) {
        if (item.disabled) {
            return;
        }
        this.itemsList.markItem(item);
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
                this.onInputBlur($event);
            }

            if (this.isOpen) {
                this.close();
            }
        };

        this.disposeDocumentClickListener = this.renderer.listen('document', 'click', handler);
    }

    private validateWriteValue(value: any) {
        if (value instanceof Object && this.bindValue) {
            throw new Error('Binding object with bindValue is not allowed.')
        }
    }

    private handleItemsChange() {
        this.isLoading = false;
        this.itemsList.markItem();
    }

    private selectWriteValue(value: any) {
        this.validateWriteValue(value);
        let index = -1;
        if (this.bindValue) {
            index = this.itemsList.items.findIndex(x => x[this.bindValue] === value);
        } else {
            index = this.itemsList.items.indexOf(value);
            index = index > -1 ? index :
                this.itemsList.items.findIndex(x => x[this.bindLabel] === value[this.bindLabel])
        }
        if (index > -1) {
            this.itemsList.select(this.itemsList.items[index]);
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
        if (this.multiple) {
            this.itemsList.unselectLastItem();
            this.updateModel();
        } else {
            if (this.filterValue) {
                return;
            }
            this.clear();
        }
    }

    private notifyModelChanged() {
        const value = this.itemsList.value;
        if (!value) {
            this.propagateChange(null);
        } else if (this.bindValue) {
            const bindValue = Array.isArray(value) ?
                value.map(x => x[this.bindValue]) :
                value[this.bindValue];
            this.propagateChange(bindValue);
        } else {
            this.propagateChange(value);
        }
        this.onChange.emit(value);
    }

    private getDropdownMenu() {
        if (!this.isOpen || !this.dropdownList) {
            return null;
        }
        return <HTMLElement>this.elementRef.nativeElement.querySelector('.as-menu-outer');
    }

    private isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }

    private detectChanges() {
        if (!(<any>this.changeDetectorRef).destroyed) {
            this.changeDetectorRef.detectChanges();
        }
    }

    private isValueSet(value: any): boolean {
        if (this.multiple) {
            return !!value && value.length > 0;
        }
        return !!value;
    }

    private mergeConfig(config: NgSelectConfig) {
        if (!config) {
            return;
        }
        this.notFoundText = config.notFoundText || this.notFoundText;
        this.typeToSearchText = config.typeToSearchText || this.typeToSearchText;
    }
}
