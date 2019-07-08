import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    selector: 'append-to-example',
    templateUrl: './append-to-example.component.html',
    styleUrls: ['./append-to-example.component.scss']
})
export class AppendToExampleComponent implements OnInit {

    people: any = [];
    selected: any;
    selected2: any;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people = this.dataService.getPeople();
    }

}
