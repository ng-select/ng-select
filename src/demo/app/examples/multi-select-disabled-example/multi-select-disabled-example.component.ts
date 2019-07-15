import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'multi-select-disabled-example',
    templateUrl: './multi-select-disabled-example.component.html',
    styleUrls: ['./multi-select-disabled-example.component.scss']
})
export class MultiSelectDisabledExampleComponent implements OnInit {

    people$: Observable<any[]>;
    selectedPeople = [];
    disable = true;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people$ = this.dataService.getPeople();
        this.setSelectedPeople();
    }

    toggleModel() {
        if (this.selectedPeople.length > 0) {
            this.selectedPeople = [];
        } else {
            this.setSelectedPeople();
        }
    }

    setSelectedPeople() {
        this.selectedPeople = [
            { id: '5a15b13c2340978ec3d2c0ea', name: 'Rochelle Estes', disabled: true },
            { id: '5a15b13c663ea0af9ad0dae8', name: 'Mendoza Ruiz' },
            { id: '5a15b13c728cd3f43cc0fe8a', name: 'Marquez Nolan', disabled: true }
        ];
    }
}
