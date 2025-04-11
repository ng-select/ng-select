import { Component, OnInit } from '@angular/core';
import { NgSelectComponent } from '../../../../ng-select/lib/ng-select.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
	selector: 'ng-tags-default-example',
	templateUrl: './tags-default-example.component.html',
	styleUrls: ['./tags-default-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, JsonPipe],
})
export class TagsDefaultExampleComponent implements OnInit {
	selectedCompany;

	ngOnInit() {}
}
