import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'template-placeholder-example',
    templateUrl: './template-placeholder-example.component.html',
    styleUrls: ['./template-placeholder-example.component.scss']
})
export class TemplatePlaceholderExampleComponent implements OnInit {

    people = [];
    selectedPeople = [];

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.getPeople().subscribe(items => {
            this.people = items;
        });
    }

    selectAll() {
        this.selectedPeople = this.people.map(x => x.name);
    }

    unselectAll() {
        this.selectedPeople = [];
    }

}
