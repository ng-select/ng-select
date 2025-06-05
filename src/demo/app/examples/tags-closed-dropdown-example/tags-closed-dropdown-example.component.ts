import { Component } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-tags-closed-dropdown-example',
	standalone: true,
	templateUrl: './tags-closed-dropdown-example.component.html',
	styleUrls: ['./tags-closed-dropdown-example.component.scss'],
	imports: [NgSelectComponent],
})
export class TagsClosedDropdownExampleComponent {}
