import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'select-tags',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p>
            In this example we are loading 5000 items but only ~30 of them are rendered in the dom. 
            This allows to load as big data as you want.
        </p>
        ---html,true
        <ng-select [items]="photos"
                   bindLabel="title"
                   bindValue="thumbnailUrl"
                   placeholder="Select photo"
                   [(ngModel)]="photo">
        </ng-select>
        ---
        <small class="form-text text-muted">5000 items with virtual scroll</small>
    `
})
export class VirtualScrollComponent {

    photos = [];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
            this.photos = photos;
        });
    }
}
