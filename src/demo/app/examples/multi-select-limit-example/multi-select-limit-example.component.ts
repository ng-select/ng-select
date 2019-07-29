import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'multi-select-limit-example',
    templateUrl: './multi-select-limit-example.component.html',
    styleUrls: ['./multi-select-limit-example.component.scss']
})
export class MultiSelectLimitExampleComponent implements OnInit {

    people$: Observable<any[]>;
    selectedPeople = [];

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people$ = this.dataService.getPeople();
    }

    clearModel() {
        this.selectedPeople = [];
    }
}
