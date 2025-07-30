import { Component, ComponentFactoryResolver, Directive, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { EXAMPLE_COMPONENTS } from '../../examples/examples';
import { StackblitzButtonComponent } from './stackblitz-button/stackblitz-button.component';

@Directive({ selector: '[example-host]' })
export class ExampleHostDirective {
	constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
	selector: 'example-viewer',
	templateUrl: './example-viewer.component.html',
	styles: [
		`
			.card-header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.54);
			}

			a.btn {
				color: rgba(0, 0, 0, 0.54);
			}

			.card {
				margin-bottom: 20px;
			}
		`,
	],
	imports: [StackblitzButtonComponent, ExampleHostDirective],
})
export class ExampleViewerComponent implements OnInit {
	@Input() example: string;

	@ViewChild(ExampleHostDirective, { static: true }) exampleHost: ExampleHostDirective;

	title: string;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	get sourcePath() {
		return `https://github.com/ng-select/ng-select/tree/master/src/demo/app/examples/${this.example}`;
	}

	ngOnInit() {
		this.loadComponent();
	}

	private loadComponent() {
		const example = EXAMPLE_COMPONENTS[this.example];
		this.title = example.title;
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(example.component);

		const viewContainerRef = this.exampleHost.viewContainerRef;
		viewContainerRef.clear();
		viewContainerRef.createComponent(componentFactory);
	}
}
