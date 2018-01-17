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
        '[class.top]': 'dropdownPosition === "top"',
        '[class.bottom]': 'dropdownPosition === "bottom"',
    }
})
export class NgSelectComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit, ControlValueAccessor {

    @ContentChild(NgOptionTemplateDirective, { read: TemplateRef }) optionTemplate: TemplateRef<any>;
    @ContentChild(NgLabelTemplateDirective, { read: TemplateRef }) labelTemplate: TemplateRef<any>;
    @ContentChild(NgHeaderTemplateDirective, { read: TemplateRef }) headerTemplate: TemplateRef<any>;
    @ContentChild(NgFooterTemplateDirective, { read: TemplateRef }) footerTemplate: TemplateRef<any>;

    @ViewChild(VirtualScrollComponent) dropdownList: VirtualScrollComponent;
    @ViewChild('dropdownPanel') dropdownPanel: ElementRef;
    @ContentChildren(NgOptionComponent, { descendants: true }) ngOptions: QueryList<NgOptionComponent>;
    @ViewChild('filterInput') filterInput: ElementRef;

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
    @Input() dropdownPosition: 'bottom' | 'top' = 'bottom';
    @Input() appendTo: string;

    @Input()
    @HostBinding('class.typeahead') typeahead: Subject<string>;

    @Input()
    @HostBinding('class.ng-multiple') multiple = false;

    @Input()
    @HostBinding('class.taggable') addTag: boolean | ((term: string) => NgOption) = false;

    @Input()
    @HostBinding('class.searchable') searchable = true;

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

    private _ngModel: any = null;
    private _simple = false;
    private _defaultLabel = 'label';
    private _defaultValue = 'value';

    private onChange = (_: NgOption) => { };
    private onTouched = () => { };
    private disposeDocumentClickListener = () => { };
    private disposeDocumentResizeListener = () => { };

    clearItem = (item: any) => {
        const option = this.itemsList.items.find(x => x.value === item);
        this.unselect(option);
    };

    get selectedItems(): NgOption[] {
        return this.itemsList.value;
    }

    constructor(@Inject(NG_SELECT_DEFAULT_CONFIG) config: NgSelectConfig,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        this.mergeGlobalConfig(config);
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
        if (this._simple) {
            this.bindValue = this._defaultLabel;
        }
    }

    ngAfterViewInit() {
        if (this.ngOptions.length > 0 && this.items.length === 0) {
            this.setItemsFromNgOptions();
        }

        if (this.appendTo) {
            this.handleAppendTo();
        }
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.disposeDocumentClickListener();
        this.disposeDocumentResizeListener();
        if (this.appendTo) {
            this.elementRef.nativeElement.appendChild(this.dropdownPanel.nativeElement);
        }
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
        if (this.isValueSet) {
            this.clearModel();
        }
        this.clearSearch();
        this.focusSearchInput();
        if (this.isTypeahead) {
            this.typeahead.next(null);
        }
        this.clearEvent.emit();
    }

    // TODO: make private 
    clearModel() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this.notifyModelChanged();
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

    toggle() {
        if (!this.isOpen) {
            this.open();
        } else {
            this.close();
        }
    }

    open() {
        if (this.isDisabled || this.isOpen) {
            return;
        }
        this.isOpen = true;
        this.itemsList.markSelectedOrDefault(this.markFirst);
        this.scrollToMarked();
        this.focusSearchInput();
        this.openEvent.emit();
        if (this.appendTo) {
            this.updateDropdownPosition();
        }
    }

    close() {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.clearSearch();
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
            this.clearSearch();
            this.updateModel();
            this.addEvent.emit(item.value);
        }

        if (this.single) {
            this.close();
        }
    }

    unselect(item: NgOption) {
        this.itemsList.unselect(item);
        this.updateModel();
        this.removeEvent.emit(item);
    }

    selectTag() {
        let tag = {}
        if (this.addTag instanceof Function) {
            tag = this.addTag(this.filterValue)
        } else {
            tag[this.bindLabel] = this.filterValue;
        }

        const item = this.itemsList.addItem(tag);
        this.select(item);
    }

    showPlaceholder() {
        return this.placeholder && !this.isValueSet && !this.filterValue;
    }

    showClear() {
        return this.clearable && (this.isValueSet || this.filterValue) && !this.isDisabled;
    }

    showAddTag() {
        return this.addTag &&
            this.filterValue &&
            this.itemsList.filteredItems.length === 0 &&
            !this.isLoading;
    }

    showFilter() {
        return !this.isDisabled;
    }

    showNoItemsFound() {
        const empty = this.itemsList.filteredItems.length === 0;
        return (empty && !this.isTypeahead) ||
            (empty && this.isTypeahead && this.filterValue && !this.isLoading);
    }

    showTypeToSearch() {
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this.isTypeahead && !this.filterValue && !this.isLoading;
    }

    onFilter(term: string) {
        if (!this.searchable) {
            return;
        }

        if (!this.isOpen) {
            this.open();
        }

        this.filterValue = term;

        if (this.isTypeahead) {
            this.isLoading = true;
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
            this.onTouched();
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

    private setItems(items: NgOption[]) {
        const firstItem = items[0];
        this.bindLabel = this.bindLabel || this._defaultLabel;
        this._simple = firstItem && !(firstItem instanceof Object);
        this.itemsList.setItems(items, this.bindLabel, this._simple);
        if (this._ngModel && items.length > 0) {
            this.itemsList.clearSelected();
            this.selectWriteValue(this._ngModel);
        }

        if (this.isTypeahead) {
            this.isLoading = false;
            this.itemsList.markSelectedOrDefault(this.markFirst);
        }
    }

    private setItemsFromNgOptions() {
        this.bindLabel = this.bindLabel || this._defaultLabel;
        this.bindValue = this.bindValue || this._defaultValue;
        const handleNgOptions = (options: QueryList<NgOptionComponent>) => {
            this.items = options.map(option => ({
                value: option.value,
                label: option.elementRef.nativeElement.innerHTML
            }));
            this.itemsList.setItems(this.items, this.bindLabel);

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
        const handler = ($event: any) => {
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
                this.changeDetectorRef.markForCheck();
            }

            if (this.isOpen) {
                this.close();
                this.changeDetectorRef.markForCheck();
            }
        };

        this.disposeDocumentClickListener = this.renderer.listen('document', 'click', handler);
    }

    private handleDocumentResize() {
        const handler = () => {
            if (this.appendTo && this.isOpen) {
                this.updateDropdownPosition();
            }
        };

        this.disposeDocumentResizeListener = this.renderer.listen('window', 'resize', handler);
    }

    private handleAppendTo() {
        if (this.appendTo === 'body') {
            document.body.appendChild(this.dropdownPanel.nativeElement);
        } else {
            const parent = document.querySelector(this.appendTo);
            if (!parent) {
                throw new Error(`appendTo selector ${this.appendTo} did not found any parent element`)
            }
            parent.appendChild(this.dropdownPanel.nativeElement);
        }
        this.handleDocumentResize();
        this.updateDropdownPosition();
    }

    private updateDropdownPosition() {
        const select: HTMLElement = this.elementRef.nativeElement;
        const dropdownPanel: HTMLElement = this.dropdownPanel.nativeElement;
        const bodyRect = document.body.getBoundingClientRect();
        const selectRect = select.getBoundingClientRect();
        const offsetTop = selectRect.top - bodyRect.top;
        const offsetLeft = selectRect.left - bodyRect.left;
        const topDelta = this.dropdownPosition === 'bottom' ? selectRect.height : -dropdownPanel.clientHeight;
        dropdownPanel.style.top = offsetTop + topDelta + 'px';
        dropdownPanel.style.bottom = 'auto';
        dropdownPanel.style.left = offsetLeft + 'px';
        dropdownPanel.style.width = selectRect.width + 'px';
    }

    private validateWriteValue(value: any) {
        if (!value) {
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

    private selectWriteValue(value: any | any[]) {
        if (!value) {
            return;
        }

        const select = (val: any) => {
            const item = this.itemsList.findItem(val, this.bindValue);
            if (item) {
                this.itemsList.select(item);
            } else if (val instanceof Object) {
                const newItem = this.itemsList.addItem(val);
                this.itemsList.select(newItem);
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

    private handleTab(_: KeyboardEvent) {
        if (this.isOpen) {
            this.close();
        }
    }

    private handleEnter($event: KeyboardEvent) {
        if (this.isOpen) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
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
            this.itemsList.unselectLast();
            this.updateModel();
        } else {
            this.clearModel();
        }
    }

    private notifyModelChanged() {
        let ngModel = this.value;
        if (!ngModel) {
            this.onChange(null);
        } else if (this.bindValue) {
            ngModel = Array.isArray(ngModel) ?
                ngModel.map(option => option[this.bindValue]) :
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

    private get isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }

    private get value() {
        if (this.multiple) {
            return this.selectedItems.map(option => option.value);
        }
        const selectedItem = this.selectedItems[0];
        return selectedItem ? selectedItem.value : null;
    }

    private get isValueSet() {
        return this.selectedItems.length > 0;
    }

    private mergeGlobalConfig(config: NgSelectConfig) {
        this.notFoundText = this.notFoundText || config.notFoundText;
        this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
        this.addTagText = this.addTagText || config.addTagText;
        this.loadingText = this.loadingText || config.loadingText;
        this.clearAllText = this.clearAllText || config.clearAllText;
        this.disableVirtualScroll = this.disableVirtualScroll || config.disableVirtualScroll;
    }
}
