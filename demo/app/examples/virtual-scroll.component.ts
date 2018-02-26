import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'select-tags',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <p>
            In this example we are loading many items but only ~30 of them are rendered in the dom. 
            This allows to load as big data as you want.
        </p>
        ---html,true
        <ng-select [items]="photosBuffer"
                   bindLabel="title"
                   bindValue="thumbnailUrl"
                   placeholder="Select photo"
                   (scrollToEnd)="fetchMore($event)">
            <ng-template ng-header-tmp>
                <small class="form-text text-muted">Loaded {{photosBuffer.length}} of {{photos.length}}</small>
            </ng-template>
            <ng-template ng-option-tmp let-item="item" let-index="index">
                <b>{{index}}</b> {{item.title}}
            </ng-template>
        </ng-select>
        ---
    `
})
export class VirtualScrollComponent {

    photos = [];
    photosBuffer = [];
    bufferSize = 50;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
            this.photos = photos;
            this.photosBuffer = this.photos.slice(0, this.bufferSize);
        });
    }

    fetchMore($event: {start: number; end: number}) {
        const len = this.photosBuffer.length;
        if ($event.end === len) {
            const more = this.photos.slice(len, this.bufferSize + len);
            this.photosBuffer = this.photosBuffer.concat(more);
        }
    }
}
