import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'accessibility-custom-label-example',
    templateUrl: './accessibility-custom-label-example.component.html',
    styleUrls: ['./accessibility-custom-label-example.component.scss']
})
export class AccessibilityCustomLabelExampleComponent implements OnInit  {

    people$: Observable<any[]>;
    selectedPeople = [];

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people$ = this.dataService.getPeople();
    }



}
