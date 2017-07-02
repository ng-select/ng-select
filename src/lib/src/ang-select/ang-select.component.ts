import {
    Component,
    ContentChildren,
    QueryList,
    OnInit,
    forwardRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Input,
    ContentChild,
    TemplateRef,
    ViewEncapsulation,
    HostListener,
    HostBinding
} from '@angular/core';


import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AngOptionDirective, AngDisplayDirective} from './ang-templates.directive';


const NGB_ANG_SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngSelectComponent),
    multi: true
};

export enum Key {
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40
}

@Component({
    selector: 'ang-select',
    templateUrl: './ang-select.component.html',
    styleUrls: ['./ang-select.component.css'],
    providers: [NGB_ANG_SELECT_VALUE_ACCESSOR],
    encapsulation: ViewEncapsulation.None,
    host: {
        'tabindex': '0',
        'role': 'dropdown',
        '(blur)': 'handleBlur()',
        '(keydown)': 'handleKeyDown($event)'
    },
})
export class AngSelectComponent implements OnInit, ControlValueAccessor {

    @ContentChild(AngOptionDirective) optionTemplateRef: TemplateRef<any>;
    @ContentChild(AngDisplayDirective) displayTemplateRef: TemplateRef<any>;

    @Input() items: any[] = [];
    @Input() bindText: string;
    @Input() bindValue: string;
    @Input() allowClear: boolean;
    @Input() allowSearch: boolean;

    isOpen = false;
    selectedItem: any = null;
    private selectedItemIndex = -1;
    private propagateChange = (_: any) => {
    }

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    handleKeyDown(event: KeyboardEvent) {
        if (Key[event.which]) {
            event.preventDefault();

            switch (event.which) {
                case Key.ArrowDown:
                    this.selectNextItem();
                    break;
                case Key.ArrowUp:
                    this.selectPreviousItem();
                    break;
                case Key.Space:
                    this.open();
                    break;
                case Key.Enter:
                case Key.Esc:
                    this.close();
                    break;
            }
        }
    }

    handleBlur() {
        // this.close();
    }

    clear() {
        if (!this.allowClear) {
            return;
        }
        this.selectedItem = null;
        this.selectedItemIndex = -1;
        this.notifyModelChanged(null);
    }

    writeValue(obj: any): void {
        this.selectedItem = obj;
        if (obj) {
            if (this.bindValue) {
                this.selectedItemIndex = this.items.findIndex(x => x[this.bindValue] === obj[this.bindValue]);
            } else {
                this.selectedItemIndex = this.items.indexOf(obj);
            }
        }
        this.changeDetectorRef.markForCheck();
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
    }

    toggle() {
        this.isOpen = !this.isOpen;
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

    private close() {
        this.isOpen = false;
    }

    select(item: any) {
        this.selectedItem = item;
        this.notifyModelChanged(item);
        this.close();
    }

    private selectNextItem() {
        if (this.selectedItemIndex === this.items.length - 1) {
            this.selectedItemIndex = 0;
        } else {
            this.selectedItemIndex++;
        }
        this.selectedItem = this.items[this.selectedItemIndex];
        this.notifyModelChanged(this.selectedItem);
    }

    private selectPreviousItem() {
        if (this.selectedItemIndex === 0) {
            this.selectedItemIndex = this.items.length - 1;
        } else {
            this.selectedItemIndex--;
        }
        this.selectedItem = this.items[this.selectedItemIndex];
        this.notifyModelChanged(this.selectedItem);
    }

    private notifyModelChanged(selectedValue: any) {
        if (!selectedValue) {
            this.propagateChange(null);
        } else if (this.bindValue) {
            this.propagateChange(selectedValue[this.bindValue]);
        } else {
            this.propagateChange(selectedValue);
        }
    }
}
