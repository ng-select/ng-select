import { afterEveryRender, booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal } from '@angular/core';

/**
 * Declares an option for ng-select declared via HTML. Use the value input to bind the option's value and the element content as its label.
 *
 * @since 3.0.0
 */
@Component({
	selector: 'ng-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content />`,
})
export class NgOptionComponent implements OnInit {
	/** Value bound to the option. The projected element content is used as the option's label. */
	public readonly value = input<any>();
	/** Whether the option is disabled and cannot be selected. */
	public readonly disabled = input(false, {
		transform: booleanAttribute,
	});
	public readonly elementRef = inject(ElementRef<HTMLElement>);

	public readonly label = signal<string>('');
	public readonly classes = signal<string>('');

	/** True when this component's inputs are initialized (after first change detection). */
	public readonly isInitialized = signal<boolean>(false);

	/**
	 * Creates an instance of NgOptionComponent.
	 *
	 * @since 3.0.0
	 */
	constructor() {
		afterEveryRender(() => {
			const element = this.elementRef.nativeElement;
			// textContent (not innerHTML): default labels are plain text, like Material viewValue.
			const currentLabel = (element.textContent || '').trim();
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

	/**
	 * Initializes the instance after Angular has assigned its inputs.
	 *
	 * @since 21.5.2
	 */
	ngOnInit(): void {
		this.isInitialized.set(true);
	}
}
