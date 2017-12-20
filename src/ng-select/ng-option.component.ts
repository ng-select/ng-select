import { Component, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'ng-option',
    template: `<ng-content></ng-content>`
})
export class NgOptionComponent {
    @Input() value: any;

    constructor(public elementRef: ElementRef) {
    }
}
