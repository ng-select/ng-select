import { AsyncPipe } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { DataService, Person } from '../data.service';

@Component({
	selector: 'ng-modal-ng-bootstrap-example',
	templateUrl: './modal-ng-bootstrap-example.component.html',
	styleUrls: ['./modal-ng-bootstrap-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, AsyncPipe],
})
export class ModalNgBootstrapExampleComponent {
	private readonly modalService = inject(NgbModal);

	readonly people$ = inject(DataService).getPeople();
	selected: Person | null = null;

	openModal(content: TemplateRef<unknown>): void {
		this.modalService.open(content);
	}
}
