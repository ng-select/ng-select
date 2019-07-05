import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

interface Event {
    name: string;
    value: any;
}

@Component({
    selector: 'output-events-example',
    templateUrl: './output-events-example.component.html',
    styleUrls: ['./output-events-example.component.scss']
})
export class OutputEventsExampleComponent implements OnInit {

    selectedItems: any;
    items = [];

    events: Event[] = [];

    constructor(private dataService: DataService) {
        this.dataService.getPeople().subscribe(items => {
            this.items = items;
        });
    }

    ngOnInit() {
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
        this.events.push({ name: '(search)', value: $event });
    }
}
