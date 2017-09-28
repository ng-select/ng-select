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
    AfterContentInit
} from '@angular/core';


import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgOptionDirective, NgDisplayDirective } from './ng-templates.directive';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { NgOption, KeyCode } from './ng-select.types';
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
export class NgSelectComponent implements OnInit, OnDestroy, AfterContentInit, ControlValueAccessor {

    @ContentChild(NgOptionDirective) optionDirective: NgOptionDirective;
    @ContentChild(NgDisplayDirective) displayDirective: NgDisplayDirective;
    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ViewChild('filterInput') filterInput;

    // inputs
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() clearable = true;
    @Input() placeholder: string;
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

    optionTemplate: TemplateRef<any>;
    labelTemplate: TemplateRef<any>;

    itemsList = new ItemsList([], false);
    viewPortItems: NgOption[] = [];
    isLoading = false;
    filterValue: string = null;

    private _openClicked = false;
    private propagateChange = (_: NgOption) => { };

    constructor(private changeDetectorRef: ChangeDetectorRef, private elementRef: ElementRef) {
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
        this.bindLabel = this.bindLabel || 'label';
    }

    ngAfterContentInit() {
        if (this.optionDirective) {
            this.optionTemplate = this.optionDirective.template;
        }
        if (this.displayDirective) {
            this.labelTemplate = this.displayDirective.template;
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
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
            }
        }
    }

    @HostListener('document:click', ['$event'])
    handleDocumentClick($event) {
        // prevent closing dropdown on first open click
        if (this._openClicked) {
            this._openClicked = false;
            return;
        }

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
        this._openClicked = true;
        this.isOpen = true;
        this.itemsList.markSelection();
        this.focusSearchInput();
        this.onOpen.emit();
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.clearSearch();
        this.itemsList.unmarkCurrentItem();
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
            this.unSelect(item);
        } else {
            this.select(item);
        }
    }

    select(item: NgOption) {
        if (item.selected) {
            return;
        }

        this.itemsList.select(item);
        this.updateModel();
        if (!this.multiple) {
            this.close();
        }
    }

    unSelect(item: NgOption) {
        this.itemsList.unSelect(item);
        this.updateModel();
    }

    showPlaceholder() {
        return this.placeholder && !this.isValueSet(this.value) && !this.filterValue;
    }

    showValue() {
        return !this.filterValue && this.isValueSet(this.value);
    }

    showClear() {
        return this.clearable && this.isValueSet(this.value) && !this.isDisabled;
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

    private validateWriteValue(value: any) {
        if (value instanceof Object && this.bindValue) {
            throw new Error('Binding object with bindValue is not allowed.')
        }
    }

    private handleItemsChange() {
        this.isLoading = false;
        this.itemsList.markSelection();
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
            this.filterInput.nativeElement.focus();
        });
    }

    private scrollToMarked() {
        this.dropdownList.scrollInto(this.itemsList.markedItem);
    }

    private handleTab($event: KeyboardEvent) {
        if (this.isOpen) {
            this.toggle(this.itemsList.markedItem);
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
}
