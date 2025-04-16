import { Directive, ElementRef, input, inject, computed } from '@angular/core';

function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Directive({
	selector: '[ngOptionHighlight]',
	standalone: true,
	host: {
		'innerHTML': 'innerHTML()'
	}
})
export class NgOptionHighlightDirective {
	private readonly elementRef = inject(ElementRef);

	readonly term = input<string>(undefined, { alias: "ngOptionHighlight" });

	private element = this.elementRef.nativeElement;;
	private label: string;

	private get _canHighlight() {
		return this._isDefined(this.term()) && this._isDefined(this.label);
	}

	innerHTML = computed(() => {
		const label = this.element.innerHTML;

		if (this._canHighlight) {
			return this._highlightLabel();
		}
		return label;
	})

	private _highlightLabel() {
		const label = this.label;
		const term = this.term();
		if (!term) {
			return label;
		}

		const alternationString = escapeRegExp(term).replace(' ', '|');
		const termRegex = new RegExp(alternationString, 'gi');
		return label.replace(termRegex, `<span class=\"highlighted\">$&</span>`);
	}

	private _isDefined(value: any) {
		return value !== undefined && value !== null;
	}
}
