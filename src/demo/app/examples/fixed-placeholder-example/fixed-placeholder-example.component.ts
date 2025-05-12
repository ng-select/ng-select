import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-fixed-placeholder-example',
	templateUrl: './fixed-placeholder-example.component.html',
	styleUrls: ['./fixed-placeholder-example.component.scss'],
	imports: [FormsModule, NgSelectComponent, NgOptionComponent],
})
export class FixedPlaceholderExampleComponent {
	isPlaceholderFixed: boolean = false;
}
