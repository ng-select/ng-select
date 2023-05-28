import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    inject
} from '@angular/core';

@Directive({
    selector: '[ngOptionHighlight]',
    standalone: true
})
export class NgOptionHighlightDirective implements OnChanges, AfterViewInit {

    @Input('ngOptionHighlight') term: string;

    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);

    private element: HTMLElement = this.elementRef.nativeElement;;
    private label: string;

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
        if (!this.term) {
            this._setInnerHtml(label);
            return;
        }

        const alternationString = this._escapeRegExp(this.term).replace(' ', '|');
        const termRegex = new RegExp(alternationString, 'gi');
        this._setInnerHtml(label.replace(termRegex, `<span class=\"highlighted\">$&</span>`))
    }

    private get _canHighlight() {
        return this._isDefined(this.term) && this._isDefined(this.label);
    }

    private _setInnerHtml(html) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
    }

    private _isDefined(value: any) {
        return value !== undefined && value !== null;
    }
}
