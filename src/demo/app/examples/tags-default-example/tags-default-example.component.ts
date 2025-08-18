import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

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
