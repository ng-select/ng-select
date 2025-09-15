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
	DestroyRef,
} from '@angular/core';
import { toObservable, takeUntilDestroyed, } from '@angular/core/rxjs-interop';

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

	private readonly _destroyRef = inject(DestroyRef);
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

	public readonly stateChange = computed<StateChange>(() => ({
		value: this.value(),
		disabled: this.disabled(),
		label: this.label(),
	}), {
		equal: (a, b) => a?.value === b?.value
			&& a?.disabled === b?.disabled
			&& a?.label === b?.label,
	});

	public readonly stateChange$ = toObservable(this.stateChange).pipe(
		takeUntilDestroyed(this._destroyRef),
	);

	private get _label() {
		return (this.elementRef.nativeElement.innerHTML || '').trim();
	}
}
