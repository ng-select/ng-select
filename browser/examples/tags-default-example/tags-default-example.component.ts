import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ng-tags-default-example',
    templateUrl: './tags-default-example.component.html',
    styleUrls: ['./tags-default-example.component.scss'],
    standalone: false
})
export class TagsDefaultExampleComponent implements OnInit {
	selectedCompany;

	ngOnInit() {}
}
