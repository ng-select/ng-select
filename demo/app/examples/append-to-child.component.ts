import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'append-to-child',
    template: `
       <p>By default ng-select appends dropdown to it's child, but you can append dropdown to any element using <b>appendTo</b> input.</p>
        ---html,true
        <ng-select [items]="people | async"
                bindLabel="company"
                placeholder="Select item"
                appendTo="body"
                [(ngModel)]="selected">
        </ng-select>
        ---
    `
})

export class AppendToChildComponent implements OnInit {

    people: any = [];
    constructor(private dataService: DataService) { }

    ngOnInit() { 
        this.people = this.dataService.getPeople();
    }
}
