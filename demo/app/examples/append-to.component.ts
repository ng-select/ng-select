import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'append-to',
    template: `
       <p>By default ng-select appends dropdown to it's child, but you can append dropdown to any element using <b>appendTo</b> input.</p>

       <p>If you place ng-select to container with fixed height and hidden overflow then dropdown will not be fully visible.</p>
        ---html,true
        <div class="overflow-box">
            <ng-select [items]="people | async"
                bindLabel="company"
                placeholder="Select item"
                [(ngModel)]="selected">
            </ng-select>
        </div>
        ---

        <p>It can be fixed by appending dropdown to body or other parent element.</p>
        ---html,true
        <div class="overflow-box">
            <ng-select [items]="people | async"
                bindLabel="company"
                placeholder="Select item"
                appendTo="body"
                [(ngModel)]="selected">
            </ng-select>
        </div>
        ---
    `,
    styles: [
        `
           .overflow-box {
               widht: 300px;
               padding: 5px;
               height: 100px;
               border: 1px solid #999;
               overflow: hidden;
           }
        `
    ]
})

export class AppendToComponent implements OnInit {

    people: any = [];
    selected: any;
    constructor(private dataService: DataService) { }

    ngOnInit() { 
        this.people = this.dataService.getPeople();
    }
}
