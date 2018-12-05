import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../shared/data.service';
import { NgSelectComponent } from '../../../src/ng-select/ng-select.component';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'reactive-forms',
    changeDetection: ChangeDetectionStrategy.Default,
    template: `
        <form [formGroup]="heroForm" novalidate>
            ---html
            <ng-select [searchable]="false" formControlName="agree">
                <ng-option [value]="true">Yes</ng-option>
                <ng-option [value]="false">No</ng-option>
            </ng-select>
            ---
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="yesno">Not searchable</label>
                    <ng-select #agreeSelect labelForId="yesno" [searchable]="false" formControlName="agree">
                        <ng-option [value]="true">Yes</ng-option>
                        <ng-option [value]="false">No</ng-option>
                    </ng-select>
                    <br />
                    <button (click)="agreeSelect.focus()" class="btn btn-sm btn-secondary">Focus select</button>
                </div>
                <div class="form-group col-md-6">
                    <label for="heroId">Basic select</label>
                    <ng-select [searchable]="false" labelForId="heroId" formControlName="heroId">
                        <ng-template ng-label-tmp let-item="item" let-label="label">
                            <img src="{{basePath}}/assets/{{item}}.png" width="20px" height="20px" /> {{label}}
                        </ng-template>
                        <ng-option value="batman">Batman</ng-option>
                        <ng-option value="spidey">Spider-Man</ng-option>
                        <ng-option value="thor">Thor</ng-option>
                    </ng-select>
                </div>
            </div>
            <hr>
            <div class="form-group">
                <label for="age">Single select</label>
                ---html,true
                <ng-select #agesSelect [items]="ages"
                        [selectOnTab]="true"
                        bindValue="value"
                        labelForId="age"
                        (ngModelChange)="showConfirm()"
                        placeholder="Select age"
                        formControlName="age">
                </ng-select>
                ---
                <small class="form-text text-muted">With required validation</small>
                <br>
                <button class="btn btn-secondary btn-sm" (click)="toggleAgeDisable()">Toggle disabled</button>
                <button (click)="agesSelect.focus()" class="btn btn-sm btn-secondary">Focus select</button>
            </div>
            <hr>
            <div class="form-group">
                <label for="state">Multi select</label>
                ---html,true
                <ng-select *ngIf="isCitiesControlVisible"
                           [items]="cities"
                           bindLabel="name"
                           bindValue="id"
                           labelForId="state"
                           [multiple]="true"
                           placeholder="Select cities"
                           clearAllText="Clear"
                           formControlName="selectedCitiesIds">
                </ng-select>
                ---
                <br>
                <button (click)="toggleCitiesControl()" class="btn btn-sm btn-secondary">Show/Hide</button>
                <button (click)="clearCities()" class="btn btn-sm btn-secondary">Clear</button>
            </div>
            <hr>

            <div class="form-group">
                <label for="album">Loading async data</label>
                <ng-select [items]="albums"
                           #select
                           bindLabel="title"
                           dropdownPosition="auto"
                           bindValue="id"
                           labelForId="album"
                           placeholder="Select album"
                           [virtualScroll]="true"
                           formControlName="album">
                    <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
                        <div><span>Title: </span><span [ngOptionHighlight]="search">{{item.title}}</span></div>
                        <small><b>Id:</b> {{item.id}} | <b>UserId:</b> {{item.userId}}</small>
                    </ng-template>
                </ng-select>
                <small class="form-text text-muted">Albums data from backend using HttpClient.</small>
                <br>
                <button class="btn btn-secondary btn-sm" (click)="selectFirstAlbum()">Select first album</button>
                <button class="btn btn-secondary btn-sm" (click)="selectAlbumsRange(0, 10)">Set 0-10 albums</button>
                <button class="btn btn-secondary btn-sm" (click)="selectAlbumsRange(10, 20)">Set 10-20 albums</button>
                <button (click)="openSelect(select)" class="btn btn-sm btn-secondary">Open</button>
                <button (click)="closeSelect(select)" class="btn btn-sm btn-secondary">Close</button>
            </div>
            <hr>

            <div class="form-group">
                <label for="photos">Custom templates</label>
                <ng-select [items]="photos"
                           bindLabel="title"
                           bindValue="thumbnailUrl"
                           placeholder="Select photo"
                           labelForId="photos"
                           [virtualScroll]="true"
                           formControlName="photo">
                    <ng-template ng-label-tmp let-item="item">
                        <img height="15" width="15" [src]="item.thumbnailUrl"/>
                        <span >{{item.title}}</span>
                    </ng-template>
                    <ng-template ng-option-tmp let-item="item" let-index="index" let-search="searchTerm">
                        <img height="15" width="15" [src]="item.thumbnailUrl"/>
                        <span [ngOptionHighlight]="search">{{item.title}}</span>
                    </ng-template>
                </ng-select>
                <small class="form-text text-muted">5000 items with virtual scroll</small>
                <br>
                <button class="btn btn-secondary btn-sm" (click)="selectFirstPhoto()">Select first photo</button>
                <button class="btn btn-secondary btn-sm" (click)="openModal(content)">Open in modal</button>
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
                                   #select
                                   bindLabel="title"
                                   bindValue="thumbnailUrl"
                                   placeholder="Select photo"
                                   (keyup.esc)="$event.preventDefault()"
                                   appendTo="body"
                                   [virtualScroll]="true"
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
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pavilnys (Disabled)', disabled: true },
        { id: 4, name: 'Pabradė' },
    ];

    ages: NgOption[] = [
        { value: '<18', label: 'Under 18' },
        { value: '18', label: '18' },
        { value: '>18', label: 'More than 18' },
    ];

    albums = [];
    allAlbums = [];
    photos = [];

    constructor(private fb: FormBuilder, private modalService: NgbModal, private dataService: DataService) {
    }

    ngOnInit() {

        this.loadAlbums();
        this.loadPhotos();

        this.heroForm = this.fb.group({
            heroId: 'batman',
            agree: null,
            selectedCitiesIds: [],
            age: [null, Validators.required],
            album: '',
            photo: ''
        });
    }

    openSelect(select: NgSelectComponent) {
        select.open();
    }

    closeSelect(select: NgSelectComponent) {
        select.close();
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
    }

    openModal(content) {
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

    showConfirm() {
        this.modalService.open(ConfirmationComponent, { size: 'lg', backdrop: 'static' });
    }

    private loadAlbums() {
        this.dataService.getAlbums().pipe(delay(500)).subscribe(albums => {
            this.allAlbums = albums;
            this.albums = [...this.allAlbums];
            this.selectFirstAlbum();
        });
    }

    private loadPhotos() {
        this.dataService.getPhotos().subscribe(photos => {
            this.photos = photos;
            this.selectFirstPhoto();
        });
    }
}

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirmation',
    template: `
        <div class="modal-header">Next Step</div>
        <div class="modal-body">Do you wish to continue?</div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" (click)="clear()">Cancel</button>
        <button type="button" class="btn btn-primary">Yes</button>
        </div>
`
})
export class ConfirmationComponent {

  constructor(
      public activeModal: NgbActiveModal,
  ) {}

  clear() {
    this.activeModal.close();
  }

}
