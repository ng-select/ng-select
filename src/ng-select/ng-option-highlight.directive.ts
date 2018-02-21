import * as searchHelper from './search-helper';
import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2
} from '@angular/core';

@Directive({
    selector: '[ngOptionHighlight]'
})
export class NgOptionHighlightDirective implements OnChanges {

    @Input('ngOptionHighlight') term: string;
    @Input('innerHTML') label: any;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngOnChanges(): void {
        this._highlightLabelWithSearchTerm();
    }

    private _highlightLabelWithSearchTerm(): void {
        const label: string = this.label ? this.label.toString() : '';
        if (!label || !this.term) {
            this._setInnerHtml(label);
            return;
        }
        
        const indexOfTerm = searchHelper.stripSpecialChars(label)
            .toUpperCase()
            .indexOf(searchHelper.stripSpecialChars(this.term).toUpperCase());
        if (indexOfTerm > -1) {
            this._setInnerHtml(
                label.substring(0, indexOfTerm)
                + '<span class=\'highlighted\'>' + label.substr(indexOfTerm, this.term.length) + '</span>'
                + label.substring(indexOfTerm + this.term.length, label.length));
        } else {
            this._setInnerHtml(label);
        }
    }

    private _setInnerHtml(html): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
    }
}   
