import {
	AfterContentChecked,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	input,
	signal,
} from '@angular/core';

@Component({
	selector: 'ng-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content />`,
})
export class NgOptionComponent implements AfterContentChecked {

	public readonly value = input<any>();
	public readonly disabled = input(false, {
		transform: booleanAttribute,
	});
	public readonly elementRef = inject(ElementRef<HTMLElement>);

	public readonly label = signal<string>('');

	// TODO: consider using new lifecycle hook instead
	// ideally afterEveryRender should work
	// somehow it breaks in unit test
	ngAfterContentChecked(): void {
		// Update label signal after content check (innerHTML updated by template bindings)
		const currentLabel = (this.elementRef.nativeElement.innerHTML || '').trim();
		if (currentLabel !== this.label()) {
			this.label.set(currentLabel);
		}
	}
}
