import { Directive, ElementRef, Renderer2, Input, NgModule } from '@angular/core';

class NgOptionHighlightDirective {
    constructor(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.element = this.elementRef.nativeElement;
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
    _escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    _highlightLabel() {
        const label = this.label;
        if (!this.term) {
            this._setInnerHtml(label);
            return;
        }
        const alternationString = this._escapeRegExp(this.term).replace(' ', '|');
        const termRegex = new RegExp(alternationString, 'gi');
        this._setInnerHtml(label.replace(termRegex, `<span class=\"highlighted\">$&</span>`));
    }
    get _canHighlight() {
        return this._isDefined(this.term) && this._isDefined(this.label);
    }
    _setInnerHtml(html) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
    }
    _isDefined(value) {
        return value !== undefined && value !== null;
    }
}
NgOptionHighlightDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngOptionHighlight]'
            },] }
];
NgOptionHighlightDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
NgOptionHighlightDirective.propDecorators = {
    term: [{ type: Input, args: ['ngOptionHighlight',] }]
};

class NgOptionHighlightModule {
}
NgOptionHighlightModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgOptionHighlightDirective],
                exports: [NgOptionHighlightDirective]
            },] }
];

/*
 * Public API Surface of ng-option-highlight
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgOptionHighlightDirective, NgOptionHighlightModule };
//# sourceMappingURL=ng-select-ng-option-highlight.js.map
