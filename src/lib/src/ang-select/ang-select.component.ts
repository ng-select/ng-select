import {
    Component,
    OnInit,
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

const NGB_ANG_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngSelectComponent),
    multi: true
};

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
    },
})
export class AngSelectComponent implements OnInit, ControlValueAccessor {

    @ContentChild(AngOptionDirective) optionTemplateRef: TemplateRef<any>;
    @ContentChild(AngDisplayDirective) displayTemplateRef: TemplateRef<any>;
    @ViewChild('dropdownList') dropdownList;
    @ViewChild('searchInput') searchInput;

    @Input() items: AngOption[] = [];
    @Input() bindText: string;
    @Input() bindValue: string;
    @Input() allowClear = true;
    @Input() placeholder: string;
    @Output() blur = new EventEmitter();
    @HostBinding('class.as-single') single = true;
    @HostBinding('class.opened') isOpen = false;
    @HostBinding('class.focused') isFocused = false;

    selectedItem: AngOption = null;
    searchValue: string = null;
    private filteredItems: AngOption[] = [];
    private selectedItemIndex = -1;
    private propagateChange = (_: any) => {
    }

    constructor(private changeDetectorRef: ChangeDetectorRef, private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.filteredItems = [...this.items];

        this.bindText = this.bindText || 'label';
        this.bindValue = this.bindValue || 'value';
        if (this.bindValue === 'this') {
            this.bindValue = undefined;
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
                    this.open();
                    $event.preventDefault();
                    break;
                case Key.Tab:
                case Key.Enter:
                case Key.Esc:
                    this.close();
                    break;
            }
        }
    }

    @HostListener('document:click', ['$event'])
    handleDocumentClick($event) {
        if (this.elementRef.nativeElement.contains($event.target) ||
            this.isOpen && this.dropdownList.nativeElement.contains($event.target)) {
            return;
        }

        this.isFocused = false;
        if (this.isOpen) {
            this.close();
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
    }

    open() {
        this.isOpen = true;
        this.scrollToSelected();
        this.focusSearchInput();
    }

    getTextValue() {
        return this.selectedItem ? this.selectedItem[this.bindText] : '';
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
        return this.placeholder && !this.selectedItem;
    }

    onSearch($event) {
        const term = $event.target.value;
        this.searchValue = term;
        const filterFunc = (val: AngOption) => {
            return searchHelper.stripSpecialChars(val[this.bindText])
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) === 0;
        };

        this.filteredItems = term ? this.items.filter(val => filterFunc(val)) : this.items;

        if (term && this.selectedItemIndex > -1) {
            this.selectedItemIndex = -1;
        }
    }

    onInputFocus() {
        console.log('focus');
        this.isFocused = true;
    }

    onInputBlur() {
        console.log('blur');
        this.isFocused = false;
    }

    private clearSearch() {
        this.searchValue = null;
        this.filteredItems = this.items;
    }

    private close() {
        this.isOpen = false;
        this.clearSearch();
    }

    private focusSearchInput() {
        setTimeout(() => {
            this.searchInput.nativeElement.focus();
        });
    }

    private scrollToSelected() {
        // TODO: is it possible to implement without using timeouts
        setTimeout(() => {
            if (!this.selectedItem) {
                return;
            }

            const selectedOption = <HTMLElement>this.dropdownList.nativeElement.querySelector('.as-option.selected');
            if (selectedOption) {
                domHelper.scrollToElement(this.dropdownList.nativeElement, selectedOption);
            }
        });
    }

    private selectNextItem() {
        console.log(this.selectedItemIndex);
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
}


function isObject(obj) {
    return obj === Object(obj);
}
