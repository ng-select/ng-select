import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgOption} from '@ng-select/ng-select';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'reactive-forms',
    template: `
        <form [formGroup]="heroForm" novalidate>

            <div class="form-group">
                <label for="name">Name</label>
                <input formControlName="name" class="form-control" id="name" placeholder="Enter name">
            </div>

            <div class="form-group">
                <label for="street">Street</label>
                <input formControlName="street" class="form-control" id="street" placeholder="Enter street">
            </div>

            <div class="form-group">
                <label for="state">City</label>
                <ng-select [items]="cities"
                           bindLabel="name"
                           bindValue="id"
                           placeholder="Select city"
                           formControlName="city">
                </ng-select>
            </div>

            <div class="form-group">
                <label for="state">Age</label>
                <ng-select [items]="ages"
                           bindValue="value"
                           placeholder="Select age"
                           formControlName="age">
                </ng-select>
                <br>
                <button class="btn btn-secondary btn-sm" (click)="toggleAgeDisable()">Toggle disabled</button>
            </div>

            <div class="form-group">
                <label for="album">Favorite album</label>
                <ng-select [items]="albums"
                           bindLabel="title"
                           bindValue="id"
                           placeholder="Select album"
                           formControlName="album">
                    <ng-template ng-option-tmp let-item="item">
                        <div>Title: {{item.title}}</div>
                        <small><b>Id:</b> {{item.id}} | <b>UserId:</b> {{item.userId}}</small>
                    </ng-template>
                </ng-select>
                <small class="form-text text-muted">Albums data from backend using HttpClient.</small>
            </div>

            <div class="form-group">
                <label for="album">Favorite photo</label>
                <ng-select [items]="photos"
                           bindLabel="title"
                           bindValue="thumbnailUrl"
                           placeholder="Select photo"
                           formControlName="photo">
                    <ng-template ng-display-tmp let-item="item">
                        <img height="15" width="15" [src]="item.thumbnailUrl"/>
                        <span>{{item.title}}</span>
                    </ng-template>
                    <ng-template ng-option-tmp let-item="item" let-index="index">
                        <img height="15" width="15" [src]="item.thumbnailUrl"/>
                        <span>{{item.title}}</span>
                    </ng-template>
                </ng-select>
                <small class="form-text text-muted">5000 items with virtual scroll</small>
            </div>
        </form>

        <p>Form value: {{ heroForm.value | json }}</p>
    `
})
export class ReactiveFormsComponent {

    heroForm: FormGroup;

    cities: NgOption[] = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true}
    ];

    ages: NgOption[] = [
        {value: '<18', label: 'Under 18'},
        {value: '18', label: '18'},
        {value: '>18', label: 'More than 18'},
    ];

    albums = [];
    photos = [];

    constructor(private fb: FormBuilder, private http: HttpClient) {
    }

    ngOnInit() {

        this.loadAlbums();
        this.loadPhotos();

        this.heroForm = this.fb.group({
            name: ['', Validators.required],
            street: '',
            city: '',
            age: '',
            album: '',
            photo: ''
        });
    }

    toggleAgeDisable() {
        if (this.heroForm.controls.age.disabled) {
            this.heroForm.controls.age.enable();
        } else {
            this.heroForm.controls.age.disable();
        }
    }

    private loadAlbums() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums').subscribe(rsp => {
            this.albums = rsp;
        });
    }

    private loadPhotos() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(rsp => {
             this.photos = rsp;
            console.log('loaded photos:', this.photos.length);
        });
    }
}

