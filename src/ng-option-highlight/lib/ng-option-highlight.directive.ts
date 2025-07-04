import { afterNextRender, computed, effect, inject, input, signal, Directive, ElementRef, Renderer2 } from '@angular/core';

function isDefined(value: any) {
	return value !== undefined && value !== null;
}

function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Directive({
	selector: '[ngOptionHighlight]',
	standalone: true,
})
export class NgOptionHighlightDirective {

	// Dependencies
	private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
	private readonly renderer = inject(Renderer2);

	// Signals
	private readonly label = signal<string>('');

	// Inputs
	public readonly term = input<string>('', { alias: 'ngOptionHighlight' });

	// Computed properties
	private readonly canHighlight = computed(
		() => isDefined(this.term()) && isDefined(this.label()));

	// Update innerHTML using effect
	_effectUpdateInnerHtml = effect(() => {
		if (!this.canHighlight()) {
			return;
		}
		this._highlightLabel();
	});

	_ = afterNextRender(() => {
		this.label.set(this.element?.innerHTML ?? '');
	});

	private _highlightLabel() {
		const label = this.label();
		if (!this.term()) {
			this._setInnerHtml(label);
			return;
		}

		const alternationString = escapeRegExp(this.term()).replace(' ', '|');
		const termRegex = new RegExp(alternationString, 'gi');
		this._setInnerHtml(label.replace(termRegex, `<span class=\"highlighted\">$&</span>`));
	}

	private _setInnerHtml(html) {
		this.renderer.setProperty(this.element, 'innerHTML', html);
	}
}