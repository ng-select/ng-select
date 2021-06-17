(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('@ng-select/ng-option-highlight', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-select'] = global['ng-select'] || {}, global['ng-select']['ng-option-highlight'] = {}), global.ng.core));
}(this, (function (exports, core) { 'use strict';

    var NgOptionHighlightDirective = /** @class */ (function () {
        function NgOptionHighlightDirective(elementRef, renderer) {
            this.elementRef = elementRef;
            this.renderer = renderer;
            this.element = this.elementRef.nativeElement;
        }
        NgOptionHighlightDirective.prototype.ngOnChanges = function () {
            if (this._canHighlight) {
                this._highlightLabel();
            }
        };
        NgOptionHighlightDirective.prototype.ngAfterViewInit = function () {
            this.label = this.element.innerHTML;
            if (this._canHighlight) {
                this._highlightLabel();
            }
        };
        NgOptionHighlightDirective.prototype._escapeRegExp = function (str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        NgOptionHighlightDirective.prototype._highlightLabel = function () {
            var label = this.label;
            if (!this.term) {
                this._setInnerHtml(label);
                return;
            }
            var alternationString = this._escapeRegExp(this.term).replace(' ', '|');
            var termRegex = new RegExp(alternationString, 'gi');
            this._setInnerHtml(label.replace(termRegex, "<span class=\"highlighted\">$&</span>"));
        };
        Object.defineProperty(NgOptionHighlightDirective.prototype, "_canHighlight", {
            get: function () {
                return this._isDefined(this.term) && this._isDefined(this.label);
            },
            enumerable: false,
            configurable: true
        });
        NgOptionHighlightDirective.prototype._setInnerHtml = function (html) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', html);
        };
        NgOptionHighlightDirective.prototype._isDefined = function (value) {
            return value !== undefined && value !== null;
        };
        return NgOptionHighlightDirective;
    }());
    NgOptionHighlightDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[ngOptionHighlight]'
                },] }
    ];
    NgOptionHighlightDirective.ctorParameters = function () { return [
        { type: core.ElementRef },
        { type: core.Renderer2 }
    ]; };
    NgOptionHighlightDirective.propDecorators = {
        term: [{ type: core.Input, args: ['ngOptionHighlight',] }]
    };

    var NgOptionHighlightModule = /** @class */ (function () {
        function NgOptionHighlightModule() {
        }
        return NgOptionHighlightModule;
    }());
    NgOptionHighlightModule.decorators = [
        { type: core.NgModule, args: [{
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

    exports.NgOptionHighlightDirective = NgOptionHighlightDirective;
    exports.NgOptionHighlightModule = NgOptionHighlightModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-select-ng-option-highlight.umd.js.map
