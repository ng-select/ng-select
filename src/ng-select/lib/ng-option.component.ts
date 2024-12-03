import {
	AfterViewChecked,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
	selector: 'ng-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<ng-content />`,
})
export class NgOptionComponent implements OnChanges, AfterViewChecked, OnDestroy {
	@Input() value: any;
	@Input({ transform: booleanAttribute }) disabled: boolean = false;

	readonly stateChange$ = new Subject<{ value: any; disabled: boolean; label?: string }>();

	private _previousLabel: string;

	constructor(public elementRef: ElementRef<HTMLElement>) {}

	get label(): string {
		return (this.elementRef.nativeElement.textContent || '').trim();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.disabled) {
			this.stateChange$.next({
				value: this.value,
				disabled: this.disabled,
			});
		}
	}

	ngAfterViewChecked() {
		if (this.label !== this._previousLabel) {
			this._previousLabel = this.label;
			this.stateChange$.next({
				value: this.value,
				disabled: this.disabled,
				label: this.elementRef.nativeElement.innerHTML,
			});
		}
	}

	ngOnDestroy() {
		this.stateChange$.complete();
	}
}
