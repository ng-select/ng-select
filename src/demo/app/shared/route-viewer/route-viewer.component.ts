import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EXAMPLE_COMPONENTS } from '../../examples/examples';

@Component({
	selector: 'route-viewer',
	templateUrl: './route-viewer.component.html',
})
export class RouteViewerComponent implements OnInit {
	private route = inject(ActivatedRoute);
	examples: string[];

	ngOnInit() {
		this.route.data.subscribe((data: { examples: string }) => {
			this.examples = Object.keys(EXAMPLE_COMPONENTS).filter((x) => x.startsWith(data.examples));
		});
	}
}
