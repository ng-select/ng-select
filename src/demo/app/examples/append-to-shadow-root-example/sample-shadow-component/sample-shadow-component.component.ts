import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    encapsulation: ViewEncapsulation.ShadowDom,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'sample-shadow-component',
    templateUrl: './sample-shadow-component.component.html',
    styleUrls: ['./sample-shadow-component.component.scss']
})
export class SampleShadowComponentComponent {
    constructor() { }
}
