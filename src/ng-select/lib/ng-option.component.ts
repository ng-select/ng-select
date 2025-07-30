import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	input,
	OnDestroy,
	signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgOptionRegistry } from './ng-option-registry.service';

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
export class NgOptionComponent implements OnDestroy {
	public readonly value = input<any>();
	public readonly disabled = input(false, {
		transform: booleanAttribute,
	});
	public readonly elementRef = inject(ElementRef<HTMLElement>);
	public readonly label = signal<string>('');
	private readonly _registry = inject(NgOptionRegistry);

	constructor() {
		// Register this option with the global registry
		this._registry.register(this);

		afterNextRender(() => {
			if (this._label !== this.label()) {
				this.label.set(this._label);
			}
		});
	}

	ngOnDestroy(): void {
		// Unregister this option from the global registry
		this._registry.unregister(this);
	}

	public readonly stateChange = computed<StateChange | undefined>(() => ({
		value: this.value(),
		disabled: this.disabled(),
		label: this.label(),
	}));
	public readonly stateChange$ = toObservable(this.stateChange);

	private get _label() {
		return (this.elementRef.nativeElement.innerHTML || '').trim();
	}
}
