import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgOptgroupTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';

@Component({
	selector: 'ng-group-default-example',
	templateUrl: './group-default-example.component.html',
	styleUrls: ['./group-default-example.component.scss'],
	imports: [NgSelectComponent, FormsModule, NgOptgroupTemplateDirective, JsonPipe],
})
export class GroupDefaultExampleComponent implements OnInit {
	selectedAccount = 'Adam';
	accounts = [
		{ name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States', child: { state: 'Active' } },
		{ name: 'Homer', email: 'homer@email.com', age: 47, country: '', child: { state: 'Active' } },
		{ name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States', child: { state: 'Active' } },
		{ name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina', child: { state: 'Active' } },
		{ name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina', child: { state: 'Active' } },
		{ name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador', child: { state: 'Active' } },
		{ name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador', child: { state: 'Inactive' } },
		{ name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador', child: { state: 'Inactive' } },
		{ name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { state: 'Inactive' } },
		{ name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia', child: { state: 'Inactive' } },
		{ name: 'Nicolás', email: 'nicole@email.com', age: 43, country: 'Colombia', child: { state: 'Inactive' } },
	];

	constructor() {}

	ngOnInit() {}
}
