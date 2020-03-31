import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../data.service';

@Component({
    selector: 'search-custom-example',
    templateUrl: './search-custom-example.component.html',
    styleUrls: ['./search-custom-example.component.scss']
})
export class SearchCustomExampleComponent implements OnInit {

    people: Person[] = [];
    peopleLoading = false;

    constructor(
        private dataService: DataService) {
    }

    ngOnInit() {
        this.loadPeople();
    }

    private loadPeople() {
        this.peopleLoading = true;
        this.dataService.getPeople().subscribe(x => {
            this.people = x;
            this.peopleLoading = false;
        });
    }

    customSearchFn(term: string, item: Person) {
        term = term.toLowerCase();
        return item.name.toLowerCase().indexOf(term) > -1 || item.gender.toLowerCase() === term;
    }
}
