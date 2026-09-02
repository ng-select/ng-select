import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-forms-template-driven-example',
	templateUrl: './forms-template-driven-example.component.html',
	styleUrls: ['./forms-template-driven-example.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FormsModule, NgSelectComponent, JsonPipe],
})
export class FormsTemplateDrivenExampleComponent {
	readonly cities = [
		{ id: 1, name: 'New York' },
		{ id: 2, name: 'London' },
		{ id: 3, name: 'Beijing' },
		{ id: 4, name: 'New Delhi' },
		{ id: 5, name: 'Paris' },
	];
	readonly model = {
		cityId: 2 as number | null,
	};
}
