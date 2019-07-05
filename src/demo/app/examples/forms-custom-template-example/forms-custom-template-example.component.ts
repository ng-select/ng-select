import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';

@Component({
    selector: 'forms-custom-template-example',
    templateUrl: './forms-custom-template-example.component.html',
    styleUrls: ['./forms-custom-template-example.component.scss']
})
export class FormsCustomTemplateExampleComponent implements OnInit {

    heroForm: FormGroup;
    photos = [];

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private dataService: DataService) {
    }

    ngOnInit() {
        this.loadPhotos();

        this.heroForm = this.fb.group({
            photo: ''
        });
    }

    selectFirstPhoto() {
        this.heroForm.get('photo').patchValue(this.photos[0].thumbnailUrl);
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

    private loadPhotos() {
        this.dataService.getPhotos().subscribe(photos => {
            this.photos = photos;
            this.selectFirstPhoto();
        });
    }

}
