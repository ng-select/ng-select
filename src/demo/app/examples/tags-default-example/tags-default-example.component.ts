import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-tags-default-example',
	standalone: true,
	templateUrl: './tags-default-example.component.html',
	styleUrls: ['./tags-default-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, JsonPipe],
})
export class TagsDefaultExampleComponent implements OnInit {
	selectedCompany;

	ngOnInit() {}
}
