import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../shared/data.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label>Select multiple elements</label>
        ---html,true
        <ng-select
                [items]="people$1 | async"
                [multiple]="true"
                [closeOnSelect]="false"
                [searchable]="false"
                bindLabel="name"
                placeholder="Select people"
                [(ngModel)]="selectedPeople1">
        </ng-select>
        ---
        <div class="mt-3">
            Selected value: <br />
            <ul>
                <li *ngFor="let item of selectedPeople1">{{item.name}}</li>
            </ul>
            <button (click)="clearModel1()" class="btn btn-secondary btn-sm">Clear model</button>
            <button (click)="changeModel1()" class="btn btn-secondary btn-sm">Change model</button>
        </div>
        <hr/>

        <label>Hide selected elements</label>
        ---html,true
        <ng-select
                [items]="people$1 | async"
                [multiple]="true"
                [closeOnSelect]="false"
                [hideSelected]="true"
                bindLabel="name"
                placeholder="Select people"
                [(ngModel)]="selectedPeople4">
        </ng-select>
        ---
        <hr/>

        <label>Keep selected elements on backspace</label>
        ---html,true
        <ng-select
                [items]="people$1 | async"
                [multiple]="true"
                [closeOnSelect]="false"
                [clearOnBackspace]="false"
                bindLabel="name"
                placeholder="Select people"
                [(ngModel)]="selectedPeople5">
        </ng-select>
        ---
        <hr/>


        <label>Select multiple elements with a limit number of selections (e.g 3)</label>
        ---html,true
        <div class="alert alert-warning mb-2" *ngIf="selectedPeople2.length === 3 && select.focused">
            <small >Max selection reached</small>
        </div>
        <ng-select
                #select
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
                <li *ngFor="let item of selectedPeople2">{{item.name}}</li>
            </ul>
            <button (click)="clearModel2()" class="btn btn-secondary btn-sm">Clear model</button>
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
        <button class="btn btn-secondary btn-sm" (click)="toggleModel()">Toggle model</button>
        <hr/>
        <label>Custom template for each selected item</label>
        ---html,true
        <ng-select
            [items]="githubUsers$ | async"
            [multiple]="true"
            bindLabel="login"
            [(ngModel)]="selectedUsers1">

            <ng-template ng-label-tmp let-item="item" let-clear="clear">
                <span class="ng-value-label"><img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}</span>
                <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
            </ng-template>

            <ng-template ng-option-tmp let-item="item">
                <img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}
            </ng-template>
        </ng-select>
        ---
        <hr/>

        <label>Custom template for all selected items</label>
        ---html,true
        <ng-select
            [items]="githubUsers$ | async"
            [multiple]="true"
            bindLabel="login"
            placeholder="Select items"
            [(ngModel)]="selectedUsers2">
            <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
                <div class="ng-value" *ngFor="let item of (items ? items.slice(0,2): [])">
                    <span class="ng-value-label"><img [src]="item.avatar_url" width="20px" height="20px"> {{item.login}}</span>
                    <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
                </div>
                <div class="ng-value" *ngIf="items.length > 2" >
                    <span class="ng-value-label">{{items.length - 2}} more...</span>
                </div>
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
    selectedPeople5 = [];
    selectedPeople4 = [];
    disable = true;

    githubUsers$: Observable<any[]>;
    selectedUsers1 = [];
    selectedUsers2 = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.people$1 = this.dataService.getPeople();
        this.people$2 = this.dataService.getPeople();
        this.people$3 = this.dataService.getPeople();
        this.githubUsers$ = this.dataService.getGithubAccounts('anjm');

        this.setSelectedPeople3();
    }

    clearModel1() {
        this.selectedPeople1 = [];
    }

    changeModel1() {
        this.selectedPeople1 = [{ name: 'New person' }];
    }

    clearModel2() {
        this.selectedPeople2 = [];
    }

    toggleModel() {
        if (this.selectedPeople3.length > 0) {
            this.selectedPeople3 = [];
        } else {
            this.setSelectedPeople3();
        }
    }

    setSelectedPeople3() {
        this.selectedPeople3 = [
            { id: '5a15b13c2340978ec3d2c0ea', name: 'Rochelle Estes', disabled: true },
            { id: '5a15b13c663ea0af9ad0dae8', name: 'Mendoza Ruiz' },
            { id: '5a15b13c728cd3f43cc0fe8a', name: 'Marquez Nolan', disabled: true }
        ];
    }
}


