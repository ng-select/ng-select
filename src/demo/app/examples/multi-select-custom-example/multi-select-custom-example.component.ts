import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';

@Component({
	selector: 'multi-select-custom-example',
	templateUrl: './multi-select-custom-example.component.html',
	styleUrls: ['./multi-select-custom-example.component.scss'],
})
export class MultiSelectCustomExampleComponent implements OnInit {
	private dataService = inject(DataService);
	githubUsers$: Observable<any[]>;
	selectedUsers = ['anjmao', 'anjmittu', 'anjmendoza'];

	ngOnInit() {
		this.githubUsers$ = this.dataService.getGithubAccounts('anjm');
	}
}
