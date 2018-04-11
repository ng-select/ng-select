import * as searchHelper from './search-helper';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import { isDefined } from './value-utils';

@Directive({
    selector: '[ngOptionHighlight]'
})
export class NgOptionHighlightDirective implements OnChanges, AfterViewInit {

    @Input('ngOptionHighlight') term: string;

    private element: HTMLElement;
    private label: string;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2) {
        this.element = this.elementRef.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (isDefined(changes.term.currentValue) && isDefined(this.label)) {
            this._highlightLabelWithSearchTerm();
        }
    }

    ngAfterViewInit() {
        this.label = this.element.innerHTML;
    }

    private _highlightLabelWithSearchTerm() {
        const label = this.label;
        if (!this.term) {
            this._setInnerHtml(label);
            return;
        }

        const indexOfTerm = searchHelper.stripSpecialChars(label)
            .toLowerCase()
            .indexOf(searchHelper.stripSpecialChars(this.term).toLowerCase());
        if (indexOfTerm > -1) {
            this._setInnerHtml(
                label.substring(0, indexOfTerm)
                + `<span class="highlighted">${label.substr(indexOfTerm, this.term.length)}</span>`
                + label.substring(indexOfTerm + this.term.length, label.length));
        } else {
            this._setInnerHtml(label);
        }
    }

    private _setInnerHtml(html) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
    }
}   
