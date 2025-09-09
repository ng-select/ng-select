import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	input,
	signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export type StateChange = {
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
	public readonly elementRef = inject(ElementRef<HTMLElement>);
	public readonly label = signal<string>('');
	private _previousLabel = '';

	constructor() {
		afterNextRender(() => {
			if (this._previousLabel !== this._label) {
				this._previousLabel = this.label();
				this.label.set(this._label);
			}
		});
	}

	public readonly stateChange = computed<StateChange | undefined>(() => ({
		value: this.value(),
		disabled: this.disabled(),
		label: this.label(),
	}));

	public readonly stateChange$ = toObservable(this.stateChange).pipe(
		filter(() => this._previousLabel !== undefined),
	);

	private get _label() {
		return (this.elementRef.nativeElement.innerHTML || '').trim();
	}
}
