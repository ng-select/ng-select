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
    ElementRef,
    ChangeDetectionStrategy,
    SimpleChange
} from '@angular/core';


import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgOptionDirective, NgDisplayDirective } from './ng-templates.directive';
import * as searchHelper from './search-helper';
import { VirtualScrollComponent } from './virtual-scroll.component';
import { NgOption, FilterFunc, KeyCode, ItemsFunc } from './ng-select.types';
import { ItemsList } from './items-list';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
export class NgSelectComponent implements OnInit, ControlValueAccessor {

    @ContentChild(NgOptionDirective) optionTemplateRef: TemplateRef<any>;
    @ContentChild(NgDisplayDirective) displayTemplateRef: TemplateRef<any>;
    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ViewChild('filterInput') filterInput;

    // inputs
    @Input() itemsFunc: ItemsFunc;
    @Input() bindLabel: string;
    @Input() bindValue: string;
    @Input() clearable = true;
    @Input() placeholder: string;
    @Input() filterFunc: FilterFunc;
    @Input() debounceTime = 200;

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

    _items: NgOption[];
    itemsList = new ItemsList([], false);
    viewPortItems: NgOption[] = [];
    isLoading = false;
    isErrorLoading = false;

    private _filterValue: string = null;
    private _filterValueStream = new Subject<string>();
    private _value: NgOption | NgOption[] = null;

    private _openClicked = false;
    private propagateChange = (_: NgOption) => { };

    constructor(private changeDetectorRef: ChangeDetectorRef, private elementRef: ElementRef) {
    }

    @Input() get items(): any[] {
        return this._items;
    }

    set items(items: any[]) {
        this._items = items || [];
        this.itemsList = new ItemsList(this._items, this.multiple);

        // TODO: since items changed, it means user request has completed
        this.isLoading = false;
    }

    get value(): NgOption {
        return this._value;
    }

    set value(value: NgOption) {
        this._value = value;
    }

    get filterValue() {
        return this._filterValue;
    };

    set filterValue(val: string) {
        this._filterValue = val;
        this._filterValueStream.next(val);
    }

    ngOnInit() {
        this.bindLabel = this.bindLabel || 'label';
        this.bindValue = this.bindValue || 'value';
        if (this.bindValue === 'this') {
            // bind to whole object
            this.bindValue = undefined;
        }

        // this.handleFilterChanges();
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
        this._value = null;
        this.itemsList.clearSelected();

        this.clearSearch();
        this.notifyModelChanged();
    }

    writeValue(obj: any): void {
        if (obj) {
            let index = -1;
            if (this.bindValue) {
                index = this.itemsList.items.findIndex(x => x[this.bindValue] === obj);
            } else {
                index = this.itemsList.items.indexOf(obj);
            }
            this._value = this.itemsList.items[index];
            this.itemsList.select(this._value);
        } else {
            this._value = null;
        }

        this.changeDetectorRef.detectChanges();
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
        if (this.isDisabled) {
            return;
        }
        this._openClicked = true;
        this.isOpen = true;
        this.itemsList.markLastSelection();
        this.focusSearchInput();
        this.onOpen.emit();
    }

    getLabelValue(value: NgOption) {
        return value ? value[this.bindLabel] : '';
    }

    getDisplayTemplateContext() {
        return this._value ? { item: this._value } : { item: {} };
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

    toggle(item: NgOption) {
        if (item.disabled || this.isDisabled) {
            return;
        }

        if (this.multiple && item.selected) {
            this.unselect(item);
        } else {
            this.select(item);
        }
    }

    select(item: NgOption) {
        this.itemsList.select(item);
        this.updateModel();
        if (!this.multiple) {
            this.close();
        }
    }

    unselect(item: NgOption) {
        this.itemsList.unselect(item);
        this.updateModel();
    }

    showPlaceholder() {
        return this.placeholder && !isDefined(this.value) && !this.filterValue;
    }

    showValue() {
        return !this.filterValue && isDefined(this.value);
    }

    showClear() {
        return this.clearable && isDefined(this.value) && !this.isDisabled;
    }

    showFilter() {
        return !this.isDisabled;
    }

    showNoItemsFound() {
        const empty = this.itemsList.filteredItems.length === 0;
        return (empty && !this.itemsFunc) ||
            (empty && this.itemsFunc && this.filterValue && !this.isLoading && !this.isErrorLoading);
    }

    showTypeToSearch() {
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this.itemsFunc && !this.filterValue && !this.isLoading && !this.isErrorLoading;
    }

    onFilter($event) {
        if (!this.isOpen) {
            this.open();
        }

        if (!$event.target.value) {
            return;
        }

        this.filterValue = $event.target.value;
        this.isLoading = true;
        // TODO: handle debounce here
        this.onSearch.emit({ term: this.filterValue });
    }

    onInputFocus($event) {
        this.isFocused = true;
        this.onFocus.emit($event);
    }

    onInputBlur($event) {
        this.isFocused = false;
        this.onBlur.emit($event);
    }

    private updateModel() {
        this._value = this.itemsList.value;
        this.notifyModelChanged();
        this.changeDetectorRef.markForCheck();
    }

    private getDefaultFilterFunc(term) {
        return (val: NgOption) => {
            return searchHelper.stripSpecialChars(val[this.bindLabel])
                .toUpperCase()
                .indexOf(searchHelper.stripSpecialChars(term).toUpperCase()) > -1;
        };
    }

    private clearSearch() {
        this.filterValue = null;
        this.itemsList.clearFilter();
    }

    private close() {
        this.isOpen = false;
        this.clearSearch();
        this.itemsList.unmarkCurrentItem();
        this.onClose.emit();
    }

    private focusSearchInput() {
        setTimeout(() => {
            this.filterInput.nativeElement.focus();
        });
    }

    private scrollToMarked() {
        this.dropdownList.scrollInto(this.itemsList.markedItem);
    }

    private handleEnter($event: KeyboardEvent) {
        this.toggle(this.itemsList.markedItem);
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
        if (!this._value) {
            this.propagateChange(null);
        } else if (this.bindValue) {
            const bindValue = Array.isArray(this._value) ?
                this._value.map(x => x[this.bindValue]) :
                this._value[this.bindValue];
            this.propagateChange(bindValue);
        } else {
            this.propagateChange(this._value);
        }
        this.onChange.emit(this._value);
    }

    private getDropdownMenu() {
        if (!this.isOpen || !this.dropdownList) {
            return null;
        }
        return <HTMLElement>this.elementRef.nativeElement.querySelector('.as-menu-outer');
    }

    private handleFilterChanges() {
        let filter: (term: string) => Observable<any>;
        if (this.itemsFunc) {
            filter = (term: string) => this.itemsList.filterServer(term, this.itemsFunc);
        } else {
            filter = (term: string) => {
                const filterFuncVal = this.filterFunc ? this.filterFunc : this.getDefaultFilterFunc.bind(this);
                return this.itemsList.filterClient(term, filterFuncVal);
            };
        }

        this._filterValueStream
            .distinctUntilChanged()
            .debounceTime(this.debounceTime)
            .subscribe(term => {
                this.isLoading = true;
                this.isErrorLoading = false;
                filter(term).subscribe(() => {
                    this.isLoading = false;
                    this.changeDetectorRef.markForCheck();
                }, () => {
                    this.isLoading = false;
                    this.isErrorLoading = true;
                });
            });
    }
}

function isDefined(value: any): boolean {
    return !!value;
}
