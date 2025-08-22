import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';
import { NgMultiLabelTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { AsyncPipe, SlicePipe } from '@angular/common';

@Component({
	selector: 'ng-multi-select-custom-example',
	templateUrl: './multi-select-custom-example.component.html',
	styleUrls: ['./multi-select-custom-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgMultiLabelTemplateDirective, AsyncPipe, SlicePipe],
})
export class MultiSelectCustomExampleComponent implements OnInit {
	private dataService = inject(DataService);

	githubUsers$: Observable<any[]>;
	selectedUsers = ['anjmao', 'anjmittu', 'anjmendoza'];

	ngOnInit() {
		this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
	}
}
