import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../data.service';

@Component({
  selector: 'search-editable-on-select',
  templateUrl: './search-editable-on-select.component.html',
  styleUrls: ['./search-editable-on-select.component.scss']
})
export class SearchEditableOnSelectComponent implements OnInit {

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
}
