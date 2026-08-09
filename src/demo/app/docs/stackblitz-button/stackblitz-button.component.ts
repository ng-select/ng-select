import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { StackblitzService } from './stackblitz.service';

@Component({
	selector: 'stackblitz-button',
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<a (click)="openExample()" class="stackblitz-link" title="Edit in StackBlitz">
			<svg width="14px" height="20px" viewBox="0 0 23 34" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g fill="#1389FD" fill-rule="nonzero">
						<polygon points="0 19.9187087 9.87007874 19.9187087 4.12007874 34 23 13.9612393 13.0846457 13.9612393 18.7893701 0"></polygon>
					</g>
				</g>
			</svg>
			Edit in StackBlitz
		</a>
	`,
	styles: [
		`
			:host {
				display: block;
				margin: 4px 0 24px;
			}

			.stackblitz-link {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				font-size: 13px;
				cursor: pointer;
				text-decoration: none;
			}

			svg {
				vertical-align: sub;
			}
		`,
	],
})
export class StackblitzButtonComponent {
	private stackblitz = inject(StackblitzService);

	readonly example = input<string>(undefined);

	async openExample() {
		await this.stackblitz.openNewProject(this.example());
	}
}
