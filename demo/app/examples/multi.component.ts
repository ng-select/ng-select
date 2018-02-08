import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../shared/data.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label>Select multiple elements</label>
        ---html,true
        <ng-select
                [items]="people$1 | async"
                [multiple]="true"
                bindLabel="name"
                [(ngModel)]="selectedPeople1">
        </ng-select>
        ---
        <div class="mt-3">
            Selected value: <br />
            <ul>
                <li *ngFor="let item of selectedPeople1">{{item.name}}</li>
            </ul>
            <button (click)="clearModel()" class="btn btn-secondary btn-sm">Clear model</button>
        </div>
        <hr/>

        <label>Select multiple elements with a limit number of selections (e.g 3)</label>
        ---html,true
        <ng-select
                [items]="people$2 | async"
                [multiple]="true"
                [maxSelectedItems]="3"
                bindLabel="name"
                [(ngModel)]="selectedPeople2">
        </ng-select>
        ---
        <div class="mt-3">
            Selected value: <br />
            <ul>
                <li *ngFor="let item of selectedPeople1">{{item.name}}</li>
            </ul>
            <button (click)="clearModel()" class="btn btn-secondary btn-sm">Clear model</button>
        </div>
        <hr/>

        <label>Disabled multiple elements</label>
        ---html,true
        <ng-select
                [items]="people$3 | async"
                bindLabel="name"
                [multiple]="true"
                [disabled]="disable"
                [(ngModel)]="selectedPeople3">
        </ng-select>
        ---
        <br>
        <button class="btn btn-secondary btn-sm" (click)="disable = !disable">Toggle disabled</button>
        <hr/>
        <label>Custom label templates</label>
        ---html,true
        <ng-select
            [items]="githubUsers$ | async"
            [multiple]="true"
            [(ngModel)]="selectedUsers">

            <ng-template ng-label-tmp let-item="item" let-clear="clear">
                <div class="ng-value-wrapper default">
                    <span class="ng-value-label"><img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}</span>
                    <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                </div>
            </ng-template>

            <ng-template ng-option-tmp let-item="item">
                <img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}
            </ng-template>
        </ng-select>
        ---
    `
})
export class SelectMultiComponent {

    people$1: Observable<any[]>;
    selectedPeople1 = [];

    people$2: Observable<any[]>;
    selectedPeople2 = [];

    people$3: Observable<any[]>;
    selectedPeople3 = [];
    disable = true;

    githubUsers$: Observable<any[]>;
    selectedUsers = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.people$1 = this.dataService.getPeople();
        this.people$2 = this.dataService.getPeople();
        this.people$3 = this.dataService.getPeople();
        this.githubUsers$ = this.dataService.getGithubAccounts('anjm');

        this.selectedPeople3 = [
            { id: '5a15b13c2340978ec3d2c0ea', name: 'Rochelle Estes' },
            { id: '5a15b13c728cd3f43cc0fe8a', name: 'Marquez Nolan' }
        ];
    }

    clearModel1() {
        this.selectedPeople1 = [];
    }

    clearModel2() {
        this.selectedPeople2 = [];
    }

}


