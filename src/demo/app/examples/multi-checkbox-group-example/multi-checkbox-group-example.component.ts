import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../data.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'multi-checkbox-group-example',
    templateUrl: './multi-checkbox-group-example.component.html',
    styleUrls: ['./multi-checkbox-group-example.component.scss']
})
export class MultiCheckboxGroupExampleComponent implements OnInit {

    people: Person[] = [];
    selectedPeople = [];

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.getPeople()
            .pipe(map(x => x.filter(y => !y.disabled)))
            .subscribe((res) => {
                this.people = res;
                this.selectedPeople = [this.people[0].id];
            });
    }
}
