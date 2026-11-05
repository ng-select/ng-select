import { afterNextRender, computed, DestroyRef, effect, inject, input, signal, Directive, ElementRef, Renderer2 } from '@angular/core';
import { escapeRegExp, isDefined } from './utils';

/** Highlights the search term in an option's text. Accepts the search term; should be used on the option element. */
@Directive({
	selector: '[ngOptionHighlight]',
	standalone: true,
})
export class NgOptionHighlightDirective {
	// Dependencies
	private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
	private readonly renderer = inject(Renderer2);
	private readonly destroyRef = inject(DestroyRef);

	// Signals
	private readonly label = signal<string>('');
	private readonly originalNodes: Node[] = [];
	private labelObserver?: MutationObserver;

	// Inputs
	public readonly term = input<string>('', { alias: 'ngOptionHighlight' });

	// Computed properties
	private readonly canHighlight = computed(() => isDefined(this.term()) && isDefined(this.label()) && this.label() !== '');

	// Update innerHTML using effect
	_effectUpdateInnerHtml = effect(() => {
		if (!this.canHighlight()) {
			return;
		}
		this._highlightLabel();
	});

	_ = afterNextRender(() => {
		this.originalNodes.push(...(Array.from(this.element.childNodes) as Node[]));
		this._observeLabelChanges();
		this.label.set(this._readLabel());
		// 1st label highlight triggers from here
		this._highlightLabel();
	});

	private _observeLabelChanges(): void {
		if (this.originalNodes.length === 0) {
			return;
		}

		this.labelObserver = new MutationObserver(() => {
			const label = this._readLabel();
			if (label === this.label()) {
				return;
			}
			this.label.set(label);
			this._highlightLabel();
		});

		for (const node of this.originalNodes) {
			this.labelObserver.observe(node, { characterData: true, childList: true, subtree: true });
		}

		this.destroyRef.onDestroy(() => this.labelObserver?.disconnect());
	}

	private _readLabel(): string {
		if (this.originalNodes.length === 0) {
			return this.element.innerHTML;
		}

		const container = this.element.ownerDocument.createElement('div');
		for (const node of this.originalNodes) {
			container.appendChild(node.cloneNode(true));
		}
		return container.innerHTML;
	}

	private _highlightLabel() {
		const label = this._readLabel();
		if (!this.term()) {
			this._setInnerHtml(label);
			return;
		}

		const alternationString = escapeRegExp(this.term()).replace(/\s+/g, '|');
		const termRegex = new RegExp(alternationString, 'gi');
		this._setInnerHtml(label.replace(termRegex, `<span class=\"highlighted\">$&</span>`));
	}

	private _setInnerHtml(html) {
		this.renderer.setProperty(this.element, 'innerHTML', html);
	}
}
