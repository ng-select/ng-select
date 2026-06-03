import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StackblitzService } from './stackblitz.service';

@Component({
	selector: 'stackblitz-button',
	templateUrl: './stackblitz-button.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
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

	readonly example = input<string>(undefined);

	async openExample() {
		if (!environment.production) {
			return;
		}

		await this.stackblitz.openNewProject(this.example());
	}
}
