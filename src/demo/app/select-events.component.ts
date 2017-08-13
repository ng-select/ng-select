import {Component} from '@angular/core';
import {AngOption} from 'ang-select';


interface AngSelectEvent {
    name: string;
    value: any;
}

@Component({
    selector: 'select-events',
    template: `
        <label>Focus, Blur, Change, Filter</label>
        <ang-select [items]="cities"
                    [(ngModel)]="selectedCity"
                    bindLabel="name"
                    bindValue="id"
                    (change)="onChange($event)">
        </ang-select>
        <br>
        <div *ngFor="let event of events">
            {{event.name}} - {{event.value | json}}
        </div>
        
    `
})
export class SelectEventsComponent {

    selectedCity: any;
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true}
    ];

    events: AngSelectEvent[] = [];

    onChange($event) {
        this.events.push({name:'(change)', value:$event});
    }

}


