import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'forms-with-options-example',
    templateUrl: './forms-with-options-example.component.html',
    styleUrls: ['./forms-with-options-example.component.scss']
})
export class FormsWithOptionsExampleComponent implements OnInit {

    basePath;
    heroForm: UntypedFormGroup;

    constructor(
        private fb: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.basePath = window.location.host.includes('localhost') ? '' : '/ng-select';
        this.heroForm = this.fb.group({
            heroId: 'batman',
            agree: null
        });
    }
}
