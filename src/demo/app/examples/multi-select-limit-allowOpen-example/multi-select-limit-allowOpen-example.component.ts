import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'multi-select-limit-allowOpen-example',
    templateUrl: './multi-select-limit-allowOpen-example.component.html',
    styleUrls: ['./multi-select-limit-allowOpen-example.component.scss']
})
export class MultiSelectLimitAllowOpenExampleComponent implements OnInit {

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
