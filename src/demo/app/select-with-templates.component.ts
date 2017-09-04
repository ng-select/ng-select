import { Component } from '@angular/core';

@Component({
    selector: 'select-with-templates',
    template: `
        <label>Custom label</label>
        <ng-select [items]="cities" [(ngModel)]="selectedCity" labelKey="name" valueKey="name">
            <ng-template ng-display-tmp let-item="item">
                <img height="15" width="15" [src]="item.avatar"/>
                {{item.name}}
            </ng-template>
        </ng-select>
        <p>
            Selected city name: {{selectedCity}}
        </p>
        <hr>

        <label>Custom option</label>
        <ng-select [items]="cities2" [(ngModel)]="selectedCity2" labelKey="name" valueKey="name">
            <ng-template ng-option-tmp let-item="item" let-index="index">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
        </ng-select>
        <p>
            Selected city name: {{selectedCity2}}
        </p>
        <hr>

        <label>Custom label and option</label>
        <ng-select [items]="cities3" [(ngModel)]="selectedCity3" labelKey="name" valueKey="name">
            <ng-template ng-display-tmp let-item="item">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-index="index">
                <img height="15" width="15" [src]="item.avatar"/>
                <b>{{item.name}}</b>
            </ng-template>
        </ng-select>
        <p>
            Selected city name: {{selectedCity3}}
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

    selectedCity = this.cities[0].name;
    selectedCity2 = this.cities2[1].name;
    selectedCity3 = this.cities3[2].name;

    ngOnInit() {
    }
}

