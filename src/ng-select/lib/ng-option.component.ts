import {
	afterEveryRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	input,
	OnInit,
	signal,
} from '@angular/core';

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

	/** Emits true when this component's inputs are initialized */
	public readonly isInitialized = signal<boolean>(false);

	constructor() {
		afterEveryRender(() => {
			// Update label signal after render (innerHTML updated by template bindings)
			const currentLabel = (this.elementRef.nativeElement.innerHTML || '').trim();
			if (currentLabel !== this.label()) {
				this.label.set(currentLabel);
			}
		});
	}

	ngOnInit() {
		this.isInitialized.set(true);
	}
}
