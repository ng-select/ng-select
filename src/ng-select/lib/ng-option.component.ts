import { afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, input, signal } from '@angular/core';

@Component({
	selector: 'ng-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content />`,
})
export class NgOptionComponent {
	public readonly value = input<any>();
	public readonly disabled = input(false, {
		transform: booleanAttribute,
	});
	public readonly elementRef = inject(ElementRef<HTMLElement>);
	public readonly label = signal<string>('');

	constructor() {
		afterNextRender(() => {
			const label = (this.elementRef.nativeElement.innerHTML || '').trim();
			if (label !== this.label()) {
				this.label.set(label);
			}
		});
	}
}
