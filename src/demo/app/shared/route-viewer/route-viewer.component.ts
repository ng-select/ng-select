import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EXAMPLE_COMPONENTS } from '../../examples/examples';
import { ExampleViewerComponent } from '../example-viewer/example-viewer.component';

@Component({
	selector: 'ng-route-viewer',
	templateUrl: './route-viewer.component.html',
	imports: [ExampleViewerComponent],
})
export class RouteViewerComponent implements OnInit {
	private route = inject(ActivatedRoute);

	examples: string[];

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {}

	ngOnInit() {
		this.route.data.subscribe((data: { examples: string }) => {
			this.examples = Object.keys(EXAMPLE_COMPONENTS).filter((x) => x.startsWith(data.examples));
		});
	}
}
