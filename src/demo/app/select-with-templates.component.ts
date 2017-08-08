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
                <img height="15" width="15" [src]="item.avatar" />
                <b>{{item.name}}</b>
            </ng-template>
        </ang-select>
    `
})
export class SelectWithTemplatesComponent {

    cities = [
        {id: 1, name: 'Vilnius', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
        {id: 2, name: 'Kaunas', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
        {id: 3, name: 'Pavilnys', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'}
    ];

    selectedCity = this.cities[0];

    ngOnInit() {
    }
}

