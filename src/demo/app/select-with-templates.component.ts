import {Component} from '@angular/core';

@Component({
    selector: 'select-with-templates',
    template: `
        <ang-select [items]="cities" [(ngModel)]="selectedCity">
            <ng-template ang-display-tmp let-item="item">
                <span class="badge badge-primary custom-id-label">{{item.id}}</span>
                {{item.name}}
            </ng-template>
            <ng-template ang-option-tmp let-item="item" let-index="index">
                <i class="fa fa-check" aria-hidden="true"></i>
                <b>{{item.name}}</b>
            </ng-template>
        </ang-select>
    `
})
export class SelectWithTemplatesComponent {

    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys'}
    ];

    selectedCity = this.cities[0];

    ngOnInit() {
    }
}

