import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EXAMPLE_COMPONENTS } from '../../examples/examples';

@Component({
	selector: 'ng-route-viewer',
	templateUrl: './route-viewer.component.html',
})
export class RouteViewerComponent implements OnInit {
	examples: string[];

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.data.subscribe((data: { examples: string }) => {
			console.log(data)
			this.examples = Object.keys(EXAMPLE_COMPONENTS).filter((x) => x.startsWith(data.examples));
		});
	}
}
