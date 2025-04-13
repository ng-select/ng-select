import { AfterViewInit, Directive, ElementRef, OnChanges, Renderer2, input, inject } from '@angular/core';

@Directive({
	selector: '[ngOptionHighlight]',
	standalone: true,
})
export class NgOptionHighlightDirective implements OnChanges, AfterViewInit {
	private elementRef = inject(ElementRef);
	private renderer = inject(Renderer2);

	readonly term = input<string>(undefined, { alias: "ngOptionHighlight" });

	private element: HTMLElement;
	private label: string;

	constructor() {
		this.element = this.elementRef.nativeElement;
	}

	private get _canHighlight() {
		return this._isDefined(this.term()) && this._isDefined(this.label);
	}

	ngOnChanges() {
		if (this._canHighlight) {
			this._highlightLabel();
		}
	}

	ngAfterViewInit() {
		this.label = this.element.innerHTML;
		if (this._canHighlight) {
			this._highlightLabel();
		}
	}

	private _escapeRegExp(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	private _highlightLabel() {
		const label = this.label;
		const term = this.term();
		if (!term) {
			this._setInnerHtml(label);
			return;
		}

		const alternationString = this._escapeRegExp(term).replace(' ', '|');
		const termRegex = new RegExp(alternationString, 'gi');
		this._setInnerHtml(label.replace(termRegex, `<span class=\"highlighted\">$&</span>`));
	}

	private _setInnerHtml(html) {
		this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
	}

	private _isDefined(value: any) {
		return value !== undefined && value !== null;
	}
}
