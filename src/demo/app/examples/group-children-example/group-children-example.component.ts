import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgOptgroupTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-group-children-example',
	templateUrl: './group-children-example.component.html',
	styleUrls: ['./group-children-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgOptgroupTemplateDirective, NgOptionTemplateDirective, JsonPipe],
})
export class GroupChildrenExampleComponent implements OnInit {
	selectedProjects = [];
	projects = [
		{
			id: 'p1',
			title: 'Project A',
			subprojects: [
				{ title: 'Subproject 1 of A', id: 's1p1' },
				{ title: 'Subproject 2 of A', id: 's2p1' },
			],
		},
		{
			id: 'p2',
			title: 'Project B',
			subprojects: [
				{ title: 'Subproject 1 of B', id: 's1p2' },
				{ title: 'Subproject 2 of B', id: 's2p2' },
			],
		},
	];

	constructor() {}

	ngOnInit() {}
}
