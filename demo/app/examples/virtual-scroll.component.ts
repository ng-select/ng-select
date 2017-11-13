import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'select-tags',
    template: `
        <p>
            By default ng-select enables virtual scroll for more 20 items. You can turn it off by setting disableVirtualScroll to true. 
            In this example we are loading 5000 items but only ~30 of them are rendered in the dom. 
            This allows to load as big data as you want.
        </p>
        ---html,true
        <ng-select [items]="photos"
                   [disableVirtualScroll]="disableVirtualScroll"
                   bindLabel="title"
                   bindValue="thumbnailUrl"
                   placeholder="Select photo"
                   [(ngModel)]="photo">
        </ng-select>
        ---
        <small class="form-text text-muted">5000 items with virtual scroll</small>
        <br>
        <button class="btn btn-secondary btn-sm" (click)="toggleVirtualScroll()">Toggle virtual scroll</button>
    `
})
export class VirtualScrollComponent {

    photos = [];
    disableVirtualScroll = false;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
            this.photos = photos;
        });
    }

    toggleVirtualScroll() {
        this.disableVirtualScroll = !this.disableVirtualScroll;
    }
}
