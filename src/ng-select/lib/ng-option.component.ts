import {
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	input,
} from '@angular/core';

type StateChange = {
	value: any;
	disabled: boolean;
	label?: string;
}

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
	public elementRef = inject(ElementRef<HTMLElement>);

	public readonly stateChange = computed<StateChange | undefined>(() => {
		return {
			value: this.value(),
			disabled: this.disabled(),
			label: this.elementRef.nativeElement.innerHTML,
		}
	});

	get label(): string {
		return (this.elementRef.nativeElement.textContent || '').trim();
	}
}
