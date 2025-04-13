import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { NgMultiLabelTemplateDirective } from '../../../../ng-select/lib/ng-templates.directive';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-multi-select-custom-example',
	templateUrl: './multi-select-custom-example.component.html',
	styleUrls: ['./multi-select-custom-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgMultiLabelTemplateDirective, AsyncPipe, SlicePipe],
})
export class MultiSelectCustomExampleComponent implements OnInit {
	githubUsers$: Observable<any[]>;
	selectedUsers = ['anjmao', 'anjmittu', 'anjmendoza'];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
	}
}
