import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgOption} from '@ng-select/ng-select';
import {HttpClient} from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'reactive-forms',
    template: `
        <form [formGroup]="heroForm" novalidate>

            ---html
            <ng-select formControlName="agree">
                <ng-option [value]="true">Yes</ng-option>
                <ng-option [value]="false">No</ng-option>
            </ng-select>
            ---
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="heroId">Basic select</label>
                    <ng-select formControlName="heroId">
                        <ng-option value="hero1">
                            <img src="{{basePath}}/assets/batman.png" width="20px" height="20px" /> Batman
                        </ng-option>
                        <ng-option value="hero2">
                            <img src="{{basePath}}/assets/spidey.png" width="20px" height="20px" /> Spider-Man
                        </ng-option>
                        <ng-option value="hero3">
                            <img src="{{basePath}}/assets/thor.png" width="20px" height="20px" /> Thor
                        </ng-option>
                    </ng-select>
                </div>
                <div class="form-group col-md-6">
                    <label for="yesno">Yes/No</label>
                    <ng-select formControlName="agree">
                        <ng-option [value]="true">Yes</ng-option>
                        <ng-option [value]="false">No</ng-option>
                    </ng-select>
                </div>
            </div>
            <hr>
            
            <div class="form-group">
                <label for="state">Multi select</label>
                ---html,true
                <ng-select *ngIf="isCitiesControlVisible"
                           [items]="cities"
                           bindLabel="name"
                           bindValue="id"
                           [multiple]="true"
                           placeholder="Select cities"
                           formControlName="selectedCitiesIds">
                </ng-select>
                ---
                <br>
                <button (click)="toggleCitiesControl()" class="btn btn-sm btn-secondary">Show/Hide</button>
                <button (click)="clearCities()" class="btn btn-sm btn-secondary">Clear</button>
            </div>
            <hr>
            <div class="form-group">
                <label for="state">Single select</label>
                ---html,true
                <ng-select [items]="ages"
                           bindValue="value"
                           placeholder="Select age"
                           formControlName="age">
                </ng-select>
                ---
                <br>
                <button class="btn btn-secondary btn-sm" (click)="toggleAgeDisable()">Toggle disabled</button>
            </div>
            <hr>
            <div class="form-group">
                <label for="album">Loading async data</label>
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
                <br>
                <button class="btn btn-secondary btn-sm" (click)="selectFirstAlbum()">Select first album</button>
                <button class="btn btn-secondary btn-sm" (click)="selectAlbumsRange(0, 10)">Set 0-10 albums</button>
                <button class="btn btn-secondary btn-sm" (click)="selectAlbumsRange(10, 20)">Set 10-20 albums</button>
            </div>
            <hr>
            
            <div class="form-group">
                <label for="album">Custom templates</label>
                <ng-select [items]="photos"
                           bindLabel="title"
                           bindValue="thumbnailUrl"
                           placeholder="Select photo"
                           formControlName="photo">
                    <ng-template ng-label-tmp let-item="item">
                        <img height="15" width="15" [src]="item.thumbnailUrl"/>
                        <span>{{item.title}}</span>
                    </ng-template>
                    <ng-template ng-option-tmp let-item="item" let-index="index">
                        <img height="15" width="15" [src]="item.thumbnailUrl"/>
                        <span>{{item.title}}</span>
                    </ng-template>
                </ng-select>
                <small class="form-text text-muted">5000 items with virtual scroll</small>
                <br>
                <button class="btn btn-secondary btn-sm" (click)="selectFirstPhoto()">Select first photo</button>
                <button class="btn btn-secondary btn-sm" (click)="openModel(content)">Open in model</button>
                <button class="btn btn-secondary btn-sm" (click)="togglePhotoDisabled()">Toggle disabled</button>
            </div>
            
            <ng-template #content let-c="close" let-d="dismiss">
                <div class="modal-header">
                    <h4 class="modal-title">Select in modal</h4>
                    <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="album">Favorite photo</label>
                        <ng-select [items]="photos"
                                   (change)="changePhoto($event)"
                                   bindLabel="title"
                                   bindValue="thumbnailUrl"
                                   placeholder="Select photo"
                                   formControlName="photo">
                            <ng-template ng-label-tmp let-item="item">
                                <img height="15" width="15" [src]="item.thumbnailUrl"/>
                                <span>{{item.title}}</span>
                            </ng-template>
                            <ng-template ng-option-tmp let-item="item" let-index="index">
                                <img height="15" width="15" [src]="item.thumbnailUrl"/>
                                <span>{{item.title}}</span>
                            </ng-template>
                        </ng-select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark" (click)="c('Close click')">Close</button>
                </div>
            </ng-template>

        </form>

        <p>Form value: {{ heroForm.value | json }}</p>
    `
})
export class ReactiveFormsComponent {

    basePath = window['basePath'] === '/' ? '' : window['basePath'];
    heroForm: FormGroup;

    isCitiesControlVisible = true;
    cities: NgOption[] = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pavilnys (Disabled)', disabled: true},
        {id: 4, name: 'Pabradė'},
    ];

    ages: NgOption[] = [
        {value: '<18', label: 'Under 18'},
        {value: '18', label: '18'},
        {value: '>18', label: 'More than 18'},
    ];

    albums = [];
    allAlbums = [];
    photos = [];

    constructor(private fb: FormBuilder, private http: HttpClient, private modalService: NgbModal) {
    }

    ngOnInit() {

        this.loadAlbums();
        this.loadPhotos();

        this.heroForm = this.fb.group({
            heroId: 'hero1',
            agree: '',
            selectedCitiesIds: [],
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

    toggleCitiesControl() {
        this.isCitiesControlVisible = !this.isCitiesControlVisible;
    }

    clearCities() {
        this.heroForm.get('selectedCitiesIds').patchValue([]);
    }

    selectFirstPhoto() {
        this.heroForm.get('photo').patchValue(this.photos[0].thumbnailUrl);
    }

    selectFirstAlbum() {
        this.heroForm.get('album').patchValue(this.albums[0].id);
    }

    selectAlbumsRange(from, to) {
        this.albums = this.allAlbums.slice(from, to);
        this.selectFirstAlbum();
    }

    openModel(content) {
        this.modalService.open(content);
    }

    changePhoto(photo) {
        this.heroForm.get('photo').patchValue(photo ? photo.thumbnailUrl : null);
    }

    togglePhotoDisabled() {
        const photo = this.heroForm.get('photo');
        if (photo.disabled) {
            photo.enable();
        } else {
            photo.disable();
        }
    }

    private loadAlbums() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/albums').subscribe(albums => {
            this.allAlbums = albums;
            this.albums = [...this.allAlbums];
            this.selectFirstAlbum();
        });
    }

    private loadPhotos() {
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/photos').subscribe(photos => {
             this.photos = photos;
             this.selectFirstPhoto();
        });
    }
}

