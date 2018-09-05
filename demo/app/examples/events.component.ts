import { ChangeDetectionStrategy, Component } from '@angular/core';
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
                   bindLabel="name"
                   bindValue="id"
                   [multiple]="true"
                   (open)="onOpen()"
                   (close)="onClose()"
                   (focus)="onFocus($event)"
                   (search)="onSearch($event)"
                   (blur)="onBlur($event)"
                   (clear)="onClear()"
                   (add)="onAdd($event)"
                   (scrollToEnd)="onScrollToEnd($event)"
                   (remove)="onRemove($event)"
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
        this.dataService.getPeople().subscribe(items => {
            this.items = items;
        });
    }

    onChange($event) {
        this.events.push({ name: '(change)', value: $event });
    }

    onFocus($event: Event) {
        this.events.push({ name: '(focus)', value: $event });
    }

    onBlur($event: Event) {
        this.events.push({ name: '(blur)', value: $event });
    }

    onOpen() {
        this.events.push({ name: '(open)', value: null });
    }

    onClose() {
        this.events.push({ name: '(close)', value: null });
    }

    onAdd($event) {
        this.events.push({ name: '(add)', value: $event });
    }

    onRemove($event) {
        this.events.push({ name: '(remove)', value: $event });
    }

    onClear() {
        this.events.push({ name: '(clear)', value: null });
    }

    onScrollToEnd($event) {
        this.events.push({ name: '(scrollToEnd)', value: $event });
    }

    onSearch($event) {
        this.events.push({ name: '(search)', value: $event })
    }
}


