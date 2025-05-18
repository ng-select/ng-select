import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe } from '@angular/common';

@Component({
	selector: 'ng-multi-select-template-example',
	templateUrl: './multi-select-template-example.component.html',
	styleUrls: ['./multi-select-template-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgLabelTemplateDirective, NgOptionTemplateDirective, AsyncPipe],
})
export class MultiSelectTemplateExampleComponent implements OnInit {
	githubUsers$: Observable<any[]>;
	selectedUsers = ['anjmao'];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
	}
}
