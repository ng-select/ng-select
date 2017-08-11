import {
    Component,
    OnInit,
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
    ElementRef
} from '@angular/core';


import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AngOptionDirective, AngDisplayDirective} from './ang-templates.directive';
import {AngOption} from './ang-option';
import * as domHelper from './dom-helper';
import * as searchHelper from './search-helper';
import {VirtualScrollComponent} from './virtual-scroll';

const NGB_ANG_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngSelectComponent),
    multi: true
};

export type FilterFunc = (term: string) => (val: AngOption) => boolean;

export enum Key {
    Tab = 9,
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40
}

@Component({
    selector: 'ang-select',
    templateUrl: './ang-select.component.html',
    styleUrls: ['./ang-select.component.scss'],
    providers: [NGB_ANG_SELECT_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None,
    host: {
        'role': 'dropdown'
    }
})
export class AngSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

    @ContentChild(AngOptionDirective) optionTemplateRef: TemplateRef<any>;
    @ContentChild(AngDisplayDirective) displayTemplateRef: TemplateRef<any>;
    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ViewChild('filterInput') filterInput;

    // inputs
    @Input() items: AngOption[] = [];
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() allowClear = true;
    @Input() placeholder: string;
    @Input() filterFunc: FilterFunc;

    // output events
    @Output() blur = new EventEmitter();

    @HostBinding('class.as-single') single = true;
    @HostBinding('class.opened') isOpen = false;
    @HostBinding('class.focused') isFocused = false;
    @HostBinding('class.disabled') isDisabled = false;

    // model value
    selectedItem: AngOption = null;

    // search term value
    filterValue: string = null;

    // used for keyboard selection;
    private tempSelectedItem: AngOption = null;
    private selectedItemIndex = -1;
    private filteredItems: AngOption[] = [];
    private propagateChange = (_: AngOption) => {};

    constructor(private changeDetectorRef: ChangeDetectorRef, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.filteredItems = [...this.items];

        this.bindLabel = this.bindLabel || 'label';
        this.bindValue = this.bindValue || 'value';
        if (this.bindValue === 'this') {
            this.bindValue = undefined;
        }
    }

    ngOnChanges(changes: any) {
        if (changes.items && changes.items.currentValue) {
            this.items = changes.items.currentValue;
            this.filteredItems = [...this.items];
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown($event: KeyboardEvent) {
        if (Key[$event.which]) {
            switch ($event.which) {
                case Key.ArrowDown:
                    this.selectNextItem();
                    this.notifyModelChanged();
                    this.scrollToSelected();
                    $event.preventDefault();
                    break;
                case Key.ArrowUp:
                    this.selectPreviousItem();
                    this.notifyModelChanged();
                    this.scrollToSelected();
                    $event.preventDefault();
                    break;
                case Key.Space:
                    if (this.isOpen) {
                        return;
                    }
                    this.open();
                    $event.preventDefault();
                    break;
                case Key.Enter:
                    this.close();
                    $event.preventDefault();
                    break;
                case Key.Tab:
                case Key.Esc:
                    this.close();
                    break;
            }
        }
    }

    @HostListener('document:click', ['$event'])
    handleDocumentClick($event) {
        const dropdown = this.getDropdownMenu();
        if (this.elementRef.nativeElement.contains($event.target) ||
            dropdown && dropdown.contains($event.target)) {
            return;
        }

        this.isFocused = false;
        if (this.isOpen) {
            this.close();
            console.log('document click close');
        }
    }

    clear() {
        if (!this.allowClear) {
            return;
        }
        this.selectedItem = null;
        this.selectedItemIndex = -1;
        this.clearSearch();
        this.notifyModelChanged();
    }

    writeValue(obj: any): void {
        if (obj) {
            if (this.bindValue) {
                this.selectedItemIndex = this.items.findIndex(x => x[this.bindValue] === obj);
            } else {
                this.selectedItemIndex = this.items.indexOf(obj);
            }

            this.selectedItem = this.items[this.selectedItemIndex];
        } else {
            this.selectedItem = null;
        }

        this.changeDetectorRef.detectChanges();
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    open() {
        if (this.isDisabled) {
            return;
        }
        this.isOpen = true;
        this.focusSearchInput();
    }

    getTextValue() {
        return this.selectedItem ? this.selectedItem[this.bindLabel] : '';
    }

    getDisplayTemplateContext() {
        return this.selectedItem ? {item: this.selectedItem} : {item: {}};
    }

    getOptionTemplateContext(item: any, index: number, first: boolean, last: boolean, even: boolean, odd: boolean) {
        return {
            item: item || {},
            index: index,
            first: first,
            last: last,
            even: even,
            odd: odd
        };
    }

    select(item: AngOption) {
        if (item.disabled) {
            return;
        }
        this.selectedItem = item;
        this.close();
        this.notifyModelChanged();
        console.log('select', this.selectedItem);
    }

    showPlaceholder() {
        return this.placeholder && !this.selectedItem && !this.filterValue;
    }

    onFilter($event) {
        this.selectedItemIndex = -1;

        const term = $event.target.value;
        this.filterValue = term;

        const filterFuncVal = this.filterFunc ? this.filterFunc(this.filterValue) : this.getDefaultFilterFunc(this.filterValue);
        this.filteredItems = term ? this.items.filter(val => filterFuncVal(val)) : this.items;
    }

    onInputFocus() {
        console.log('focus');
        this.isFocused = true;
    }

    onInputBlur() {
        console.log('blur');
        this.isFocused = false;
    }

    private getDefaultFilterFunc(term) {
        return (val: AngOption) => {
            return searchHelper.stripSpecialChars(val[this.bindLabel])
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) === 0;
        };
    }

    private clearSearch() {
        this.filterValue = null;
        this.filteredItems = this.items;
    }

    private close() {
        this.isOpen = false;
        this.clearSearch();
    }

    private focusSearchInput() {
        setTimeout(() => {
            this.filterInput.nativeElement.focus();
        });
    }

    private scrollToSelected() {
        this.dropdownList.scrollInto(this.selectedItem);
    }

    private writeSelectedItem() {

    }

    private selectNextItem() {
        if (this.selectedItemIndex === this.filteredItems.length - 1) {
            this.selectedItemIndex = 0;
        } else {
            this.selectedItemIndex++;
        }
        this.selectedItem = this.filteredItems[this.selectedItemIndex];
        while (this.selectedItem.disabled) {
            this.selectNextItem();
        }
    }

    private selectPreviousItem() {
        if (this.selectedItemIndex === 0) {
            this.selectedItemIndex = this.filteredItems.length - 1;
        } else {
            this.selectedItemIndex--;
        }
        this.selectedItem = this.filteredItems[this.selectedItemIndex];
        while (this.selectedItem.disabled) {
            this.selectPreviousItem();
        }
    }

    private notifyModelChanged() {
        if (!this.selectedItem) {
            this.propagateChange(null);
        } else if (this.bindValue) {
            this.propagateChange(this.selectedItem[this.bindValue]);
        } else {
            this.propagateChange(this.selectedItem);
        }
    }

    private getDropdownMenu() {
        if (!this.isOpen || !this.dropdownList) {
            return null;
        }
        return <HTMLElement>this.elementRef.nativeElement.querySelector('.as-menu-outer');
    }
}

