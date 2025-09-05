import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';

@Component({
	selector: 'ng-forms-custom-template-example',
	templateUrl: './forms-custom-template-example.component.html',
	styleUrls: ['./forms-custom-template-example.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		NgSelectComponent,
		NgLabelTemplateDirective,
		NgOptionTemplateDirective,
		NgOptionHighlightDirective,
	],
})
export class FormsCustomTemplateExampleComponent implements OnInit {
	private fb = inject(FormBuilder);
	private modalService = inject(NgbModal);
	private dataService = inject(DataService);

	heroForm: FormGroup;
	photos = [];

	ngOnInit() {
		this.loadPhotos();

		this.heroForm = this.fb.group({
			photo: '',
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
		this.dataService.getPhotos().subscribe((photos) => {
			this.photos = photos;
			this.selectFirstPhoto();
		});
	}
}
