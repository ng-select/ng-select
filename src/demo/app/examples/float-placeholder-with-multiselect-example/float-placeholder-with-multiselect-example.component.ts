import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from "../../../../ng-select/lib/ng-select.module";
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../data.service';

@Component({
  selector: 'ng-float-placeholder-with-multiselect-example',
  standalone: true,
  imports: [NgSelectModule, FormsModule, AsyncPipe],
  templateUrl: './float-placeholder-with-multiselect-example.component.html',
  styleUrl: './float-placeholder-with-multiselect-example.component.scss'
})
export class FloatPlaceholderWithMultiselectExampleComponent implements OnInit {
  people$: Observable<any[]>;
	selectedPeople = [{ name: 'Karyn Wright' }];

	constructor(private dataService: DataService) {}

	ngOnInit() {
		this.people$ = this.dataService.getPeople();
	}
}
