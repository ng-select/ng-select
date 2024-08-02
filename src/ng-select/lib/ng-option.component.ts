import {
	AfterViewChecked,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	inject,
	input,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'ng-option',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content />`,
})
export class NgOptionComponent implements OnChanges, AfterViewChecked, OnDestroy {
	public elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
	value = input<any>();
	disabled = input<boolean, boolean | string>(booleanAttribute(false), { transform: booleanAttribute });

	readonly stateChange$ = new Subject<{ value: any; disabled: boolean; label?: string }>();

	private _previousLabel: string;

	get label(): string {
		return (this.elementRef.nativeElement.textContent || '').trim();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.disabled) {
			this.stateChange$.next({
				value: this.value(),
				disabled: this.disabled(),
			});
		}
	}

	ngAfterViewChecked() {
		if (this.label !== this._previousLabel) {
			this._previousLabel = this.label;
			this.stateChange$.next({
				value: this.value(),
				disabled: this.disabled(),
				label: this.elementRef.nativeElement.innerHTML,
			});
		}
	}

	ngOnDestroy() {
		this.stateChange$.complete();
	}
}
