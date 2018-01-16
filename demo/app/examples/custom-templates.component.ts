import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgSelectComponent } from '../../../src/ng-select/ng-select.component';

@Component({
    selector: 'select-with-templates',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <label>Custom label</label>
        ---html,true
        <ng-select [items]="cities" [(ngModel)]="selectedCity" bindLabel="name" bindValue="name">
            <ng-template ng-label-tmp let-item="item">
                <img height="15" width="15" [src]="item.avatar"/>
                {{item.name}}
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected city name: {{selectedCity}}
        </p>
        <hr>

        <label>Custom option</label>
        ---html,true
        <ng-select [items]="cities2" [(ngModel)]="selectedCity2" bindLabel="name" bindValue="name">
            <ng-template ng-option-tmp let-item="item" let-index="index">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected city name: {{selectedCity2}}
        </p>
        <hr>

        <label>Custom label and option</label>
        ---html,true
        <ng-select [items]="cities3" [(ngModel)]="selectedCity3" bindLabel="name" bindValue="name">
            <ng-template ng-label-tmp let-item="item">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-index="index">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected city name: {{selectedCity3}}
        </p>
        <hr>

        <label>Custom header and footer</label>
        ---html,true
        <ng-select #ctx
            [multiple]="true"
            [items]="cities4"
            [(ngModel)]="selectedCities"
            bindLabel="name"
            bindValue="name">
            <ng-template ng-header-tmp>
                <button (click)="selectAll(ctx)" class="btn btn-sm btn-secondary">Select all</button>
                <button (click)="selectNone(ctx)" class="btn btn-sm btn-secondary">Select none</button>
            </ng-template>
            <ng-template ng-footer-tmp>
                Selected items: {{selectedCities.length}}
            </ng-template>
        </ng-select>
        ---
        <p>
            Selected cities: {{selectedCities}}
        </p>
    `
})
export class SelectWithTemplatesComponent {

    cities = [
        {id: 1, name: 'Vilnius', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
        {id: 2, name: 'Kaunas', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
        {id: 3, name: 'Pavilnys', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'}
    ];

    cities2 = JSON.parse(JSON.stringify(this.cities));
    cities3 = JSON.parse(JSON.stringify(this.cities));
    cities4 = JSON.parse(JSON.stringify(this.cities));

    selectedCity = this.cities[0].name;
    selectedCity2 = this.cities2[1].name;
    selectedCity3 = this.cities3[2].name;
    selectedCities = [this.cities3[2].name];

    ngOnInit() {
    }

    selectAll(ctx: NgSelectComponent) {
        ctx.itemsList.items.forEach(item => ctx.select(item));
        ctx.detectChanges();
    }

    selectNone(ctx: NgSelectComponent) {
        ctx.itemsList.items.forEach(item => ctx.unselect(item));
        ctx.detectChanges();
    }
}

