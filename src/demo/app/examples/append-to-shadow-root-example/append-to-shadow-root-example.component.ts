import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'append-to-shadow-root-example',
    templateUrl: './append-to-shadow-root-example.component.html',
    styleUrls: ['./append-to-shadow-root-example.component.scss']
})
export class AppendToShadowRootExampleComponent implements OnInit {

    people: any = [];
    selected: any;
    selected2: any;
    selected3: any;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.people = this.dataService.getPeople();
    }

}
