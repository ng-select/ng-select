import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { WindowService } from './window.service';
import { SearchPosition } from './ng-select.component';

@Component({
    selector: 'ng-input',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div *ngIf="searchable" class="ng-input">
            <input #filterInput
                type="text"
                autocomplete="off"
                [value]="value"
                (keydown)="onKeydown($event)"
                (input)="filter.emit(filterInput.value)"
                (focus)="onFocus()"
                (blur)="blur.emit()"
                (change)="$event.stopPropagation()"
                role="combobox"
                [attr.aria-expanded]="open"
                [attr.aria-owns]="ariaOwns"
                [attr.aria-activedescendant]="ariaActiveDescendant">
        </div>
    `
})

export class NgInputComponent {

    @Input() open;
    @Input() searchable;
    @Input() ownerId;
    @Input() descendantId;
    @Input() value;
    @Input() searchPosition: SearchPosition;
    @Input() appendTo: string;

    @Output() focus = new EventEmitter();
    @Output() blur = new EventEmitter();
    @Output() keyDown = new EventEmitter();
    @Output() filter = new EventEmitter();

    @ViewChild('filterInput') filterInput: ElementRef;

    constructor(private _window: WindowService) { }

    ngAfterViewInit() {
        if (this.searchPosition === 'dropdown') {
            this.setFocus();
        }
    }

    get ariaOwns() {
        return this.open ? this.ownerId : null;
    }

    get ariaActiveDescendant() {
        return open ? this.descendantId : null
    }

    setFocus() {
        if (!this.filterInput) {
            return;
        }
        this._window.setTimeout(() => {
            this.filterInput.nativeElement.focus();
        }, 5);
    }

    onFocus() {
        if (this.searchPosition === 'inline') {
            this.focus.emit();
        }
    }

    onKeydown($event) {
        if (this.searchPosition === 'dropdown' && this.appendTo) {
            this.keyDown.emit($event);
        }
    }
}
