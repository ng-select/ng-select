import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngOption} from 'ang-select';
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
                <ang-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            placeholder="Select city"
                            formControlName="city">
                </ang-select>
            </div>

            <div class="form-group">
                <label for="state">Age</label>
                <ang-select [items]="ages"
                            placeholder="Select age"
                            formControlName="age">
                </ang-select>
                <br>
                <button class="btn btn-secondary btn-sm" (click)="toggleAgeDisable()">Toggle disabled</button>
            </div>

            <div class="form-group">
                <label for="album">Favorite album</label>
                <ang-select [items]="albums"
                            bindLabel="title"
                            bindValue="id"
                            placeholder="Select album"
                            formControlName="album">
                    <ng-template ang-option-tmp let-item="item">
                        <div>Title: {{item.title}}</div>
                        <small><b>Id:</b> {{item.id}} | <b>UserId:</b> {{item.userId}}</small>
                    </ng-template>
                </ang-select>
                <small id="fileHelp" class="form-text text-muted">Albums data from backend using HttpClient.</small>
            </div>
        </form>

        <p>Form value: {{ heroForm.value | json }}</p>
    `
})
export class ReactiveFormsComponent {

    heroForm: FormGroup;

    cities: AngOption[] = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys', disabled: true}
    ];

    ages: AngOption[] = [
        {value: '<18', label: 'Under 18'},
        {value: '18', label: '18'},
        {value: '>18', label: 'More than 18'},
    ];

    albums = [];

    constructor(private fb: FormBuilder, private http: HttpClient) {
    }

    ngOnInit() {

        this.loadAlbums();

        this.heroForm = this.fb.group({
            name: ['', Validators.required],
            street: '',
            city: '',
            age: '',
            album: ''
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
        this.http.get<any[]>('http://jsonplaceholder.typicode.com/albums').subscribe(rsp => {
            this.albums = rsp;
            console.log(this.albums[0]);
        });
    }
}

