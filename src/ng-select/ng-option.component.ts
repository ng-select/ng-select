import { Component, Input, Host, ElementRef } from '@angular/core';
import { NgOption } from './ng-select.types';

@Component({
    selector: 'ng-option',
    template: `<ng-content></ng-content>`
})
export class NgOptionComponent {
    @Input() value: any;

    constructor(public elementRef: ElementRef) {
    }
}
