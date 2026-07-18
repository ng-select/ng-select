import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal } from '@angular/core';

@Component({
	selector: 'ng-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content />`,
})
export class NgOptionComponent implements OnInit {
	public readonly value = input<any>();
	public readonly disabled = input(false, {
		transform: booleanAttribute,
	});
	public readonly elementRef = inject(ElementRef<HTMLElement>);

	public readonly label = signal<string>('');
	public readonly classes = signal<string>('');

	/** True when this component's inputs are initialized (after first change detection). */
	public readonly isInitialized = signal<boolean>(false);

	constructor() {
		afterEveryRender(() => {
			const element = this.elementRef.nativeElement;
			// Update signals after render (host classes and innerHTML can be updated by bindings).
			const currentLabel = (element.innerHTML || '').trim();
			if (currentLabel !== this.label()) {
				this.label.set(currentLabel);
			}

			const currentClasses = Array.from(element.classList)
				.filter((className) => className !== 'ng-star-inserted')
				.join(' ');
			if (currentClasses !== this.classes()) {
				this.classes.set(currentClasses);
			}
		});
	}

	ngOnInit(): void {
		this.isInitialized.set(true);
	}
}
