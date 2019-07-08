import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'forms-single-select-example',
    templateUrl: './forms-single-select-example.component.html',
    styleUrls: ['./forms-single-select-example.component.scss']
})
export class FormsSingleSelectExampleComponent implements OnInit {

    heroForm: FormGroup;
    ages: any[] = [
        { value: '<18', label: 'Under 18' },
        { value: '18', label: '18' },
        { value: '>18', label: 'More than 18' },
    ];

    constructor(private fb: FormBuilder, private modalService: NgbModal) {
    }

    ngOnInit() {
        this.heroForm = this.fb.group({
            age: [null, Validators.required],
        });
    }

    toggleAgeDisable() {
        if (this.heroForm.controls.age.disabled) {
            this.heroForm.controls.age.enable();
        } else {
            this.heroForm.controls.age.disable();
        }
    }

    showConfirm(content) {
        this.modalService.open(content);
    }
}
