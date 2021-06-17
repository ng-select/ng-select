import { AfterViewInit, ElementRef, OnChanges, Renderer2 } from '@angular/core';
export declare class NgOptionHighlightDirective implements OnChanges, AfterViewInit {
    private elementRef;
    private renderer;
    term: string;
    private element;
    private label;
    constructor(elementRef: ElementRef, renderer: Renderer2);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    private _escapeRegExp;
    private _highlightLabel;
    private get _canHighlight();
    private _setInnerHtml;
    private _isDefined;
}
