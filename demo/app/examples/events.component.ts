import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../shared/data.service';


interface AngSelectEvent {
    name: string;
    value: any;
}

@Component({
    selector: 'select-events',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        ---html,true
        <ng-select placeholder="Select some items"
                   [items]="items"
                   [(ngModel)]="selectedItems"
                   bindLabel="title"
                   [multiple]="true"
                   (open)="onOpen()"
                   (close)="onClose()"
                   (focus)="onFocus($event)"
                   (blur)="onBlur($event)"
                   (clear)="onClear()"
                   (add)="onAdd($event)"
                   (remove)="onRemove($event)"
                   (scrollEnd)="onScrolledToEnd($event)"
                   (change)="onChange($event)">
        </ng-select>
        ---

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

    selectedItems: any;
    items = [];

    events: AngSelectEvent[] = [];

    constructor(private dataService: DataService) {
        this.dataService.getAlbums().subscribe(items => {
            this.items = items;
        });
    }

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

    onAdd($event) {
        this.events.push({name: '(add)', value: $event});
    }

    onRemove($event) {
        this.events.push({name: '(remove)', value: $event});
    }

    onClear() {
        this.events.push({name: '(clear)', value: null});
    }

    onScrolledToEnd($event) {
        this.events.push({name: '(scrollEnd)', value: $event});
    }
}


