import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
    selector: 'multi-select-default-example',
    templateUrl: './multi-select-default-example.component.html',
    styleUrls: ['./multi-select-default-example.component.scss']
})
export class MultiSelectDefaultExampleComponent implements OnInit {

    people$: Observable<any[]>;
    selectedPeople = [{ name: 'Karyn Wright' }];

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people$ = this.dataService.getPeople();
    }

    clearModel() {
        this.selectedPeople = [];
    }

    changeModel() {
        this.selectedPeople = [{ name: 'New person' }];
    }
}
