import { Component, OnInit } from '@angular/core';
import { DataService, Person } from '../data.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'data-source-backend-example',
    templateUrl: './data-source-backend-example.component.html',
    styleUrls: ['./data-source-backend-example.component.scss']
})
export class DataSourceBackendExampleComponent implements OnInit {

    people$: Observable<Person[]>;
    selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people$ = this.dataService.getPeople();
    }

}
