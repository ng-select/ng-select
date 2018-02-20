import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'select-tags',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p>
            By default ng-select enables virtual scroll for more 40 items. You can turn it off by setting disableVirtualScroll to true. 
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


        <p>
            Using <b>scrollEnd</b> event you can implement lazy loading and load extra chunk of your data when scroll end is reached.
        </p>
        ---html,true
        <ng-select [items]="photosLazy"
                   bindLabel="title"
                   bindValue="thumbnailUrl"
                   placeholder="Select photo"
                   (scrollEnd)="onScrollEnd($event)"
                   [(ngModel)]="photoLazy">
        </ng-select>
        ---
    `
})
export class VirtualScrollComponent {

    photos = [];
    photosLazy = [];
    disableVirtualScroll = false;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
            this.photos = photos;
            this.photosLazy = photos.slice(0, 50);
        });
    }

    toggleVirtualScroll() {
        this.disableVirtualScroll = !this.disableVirtualScroll;
    }

    onScrollEnd(scroll) {
        this.photosLazy.push(...this.photos.slice(scroll.end, scroll.end + 50));
        this.photosLazy = [...this.photosLazy];
    }
}
