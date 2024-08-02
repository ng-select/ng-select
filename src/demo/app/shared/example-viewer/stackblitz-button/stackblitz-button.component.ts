import { Component, inject, input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StackblitzService } from './stackblitz.service';

@Component({
	selector: 'stackblitz-button',
	templateUrl: './stackblitz-button.component.html',
	styles: [
		`
			svg {
				height: 18px;
				vertical-align: sub;
			}
		`,
	],
})
export class StackblitzButtonComponent {
	private stackblitz = inject(StackblitzService);
	example = input<string>();

	async openExample() {
		if (!environment.production) {
			return;
		}

		await this.stackblitz.openNewProject(this.example());
	}
}
