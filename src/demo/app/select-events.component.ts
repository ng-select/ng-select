import {Component} from '@angular/core';


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
                    (open)="onOpen()"
                    (close)="onClose()"
                    (focus)="onFocus($event)"
                    (blur)="onBlur($event)"
                    (change)="onChange($event)">
        </ang-select>
        
        <div *ngIf="events.length > 0">
            <br>
            <button (click)="events = []" class="btn btn-secondary btn-sm">Clear events</button>
            <br>
            <br>
        </div>
        
        <div *ngFor="let event of events">
            <small>{{event.name}} - {{event.value | json}}</small>
            <hr>
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
        this.events.push({name: '(change)', value: $event});
    }

    onFocus($event: Event) {
        this.events.push({name: '(focus)', value: $event});
    }

    onBlur($event: Event) {
        this.events.push({name: '(blur)', value: $event});
    }

    onOpen() {
        this.events.push({name: '(open)', value: null});
    }

    onClose() {
        this.events.push({name: '(close)', value: null});
    }
}


