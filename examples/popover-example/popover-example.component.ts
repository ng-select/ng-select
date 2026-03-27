import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataService, Person } from '../data.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'ng-popover-example',
	templateUrl: './popover-example.component.html',
	styleUrls: ['./popover-example.component.scss'],
	imports: [NgSelectComponent, FormsModule],
})
export class PopoverExampleComponent {
	private dataService = inject(DataService);

	people = toSignal<Person[]>(this.dataService.getPeople());
	selected1: Person;
	selected2: Person;
}
