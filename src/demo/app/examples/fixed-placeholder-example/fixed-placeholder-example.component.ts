import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '../../../../ng-select/lib/ng-select.component';
import { NgOptionComponent } from '../../../../ng-select/lib/ng-option.component';

@Component({
	selector: 'ng-fixed-placeholder-example',
	templateUrl: './fixed-placeholder-example.component.html',
	styleUrls: ['./fixed-placeholder-example.component.scss'],
	imports: [FormsModule, NgSelectComponent, NgOptionComponent],
})
export class FixedPlaceholderExampleComponent {
	isPlaceholderFixed: boolean = false;
}
