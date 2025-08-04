import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
    selector: 'ng-accessibility-custom-label-example',
    templateUrl: './accessibility-custom-label-example.component.html',
    styleUrls: ['./accessibility-custom-label-example.component.scss'],
    imports: [NgSelectComponent, FormsModule, AsyncPipe]
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
