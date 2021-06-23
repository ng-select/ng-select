(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('rxjs/operators'), require('rxjs'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@ng-select/ng-select', ['exports', '@angular/core', '@angular/forms', 'rxjs/operators', 'rxjs', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ng-select'] = global['ng-select'] || {}, global['ng-select']['ng-select'] = {}), global.ng.core, global.ng.forms, global.rxjs.operators, global.rxjs, global.ng.common));
}(this, (function (exports, i0, forms, operators, rxjs, common) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || from);
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var unescapedHTMLExp = /[&<>"']/g;
    var hasUnescapedHTMLExp = RegExp(unescapedHTMLExp.source);
    var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    };
    function escapeHTML(string) {
        return (string && hasUnescapedHTMLExp.test(string)) ?
            string.replace(unescapedHTMLExp, function (chr) { return htmlEscapes[chr]; }) :
            string;
    }
    function isDefined(value) {
        return value !== undefined && value !== null;
    }
    function isObject(value) {
        return typeof value === 'object' && isDefined(value);
    }
    function isPromise(value) {
        return value instanceof Promise;
    }
    function isFunction(value) {
        return value instanceof Function;
    }

    var NgItemLabelDirective = /** @class */ (function () {
        function NgItemLabelDirective(element) {
            this.element = element;
            this.escape = true;
        }
        NgItemLabelDirective.prototype.ngOnChanges = function (changes) {
            this.element.nativeElement.innerHTML = this.escape ?
                escapeHTML(this.ngItemLabel) :
                this.ngItemLabel;
        };
        return NgItemLabelDirective;
    }());
    NgItemLabelDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ngItemLabel]' },] }
    ];
    NgItemLabelDirective.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    NgItemLabelDirective.propDecorators = {
        ngItemLabel: [{ type: i0.Input }],
        escape: [{ type: i0.Input }]
    };
    var NgOptionTemplateDirective = /** @class */ (function () {
        function NgOptionTemplateDirective(template) {
            this.template = template;
        }
        return NgOptionTemplateDirective;
    }());
    NgOptionTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-option-tmp]' },] }
    ];
    NgOptionTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgOptgroupTemplateDirective = /** @class */ (function () {
        function NgOptgroupTemplateDirective(template) {
            this.template = template;
        }
        return NgOptgroupTemplateDirective;
    }());
    NgOptgroupTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-optgroup-tmp]' },] }
    ];
    NgOptgroupTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgLabelTemplateDirective = /** @class */ (function () {
        function NgLabelTemplateDirective(template) {
            this.template = template;
        }
        return NgLabelTemplateDirective;
    }());
    NgLabelTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-label-tmp]' },] }
    ];
    NgLabelTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgMultiLabelTemplateDirective = /** @class */ (function () {
        function NgMultiLabelTemplateDirective(template) {
            this.template = template;
        }
        return NgMultiLabelTemplateDirective;
    }());
    NgMultiLabelTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-multi-label-tmp]' },] }
    ];
    NgMultiLabelTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgHeaderTemplateDirective = /** @class */ (function () {
        function NgHeaderTemplateDirective(template) {
            this.template = template;
        }
        return NgHeaderTemplateDirective;
    }());
    NgHeaderTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-header-tmp]' },] }
    ];
    NgHeaderTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgFooterTemplateDirective = /** @class */ (function () {
        function NgFooterTemplateDirective(template) {
            this.template = template;
        }
        return NgFooterTemplateDirective;
    }());
    NgFooterTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-footer-tmp]' },] }
    ];
    NgFooterTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgNotFoundTemplateDirective = /** @class */ (function () {
        function NgNotFoundTemplateDirective(template) {
            this.template = template;
        }
        return NgNotFoundTemplateDirective;
    }());
    NgNotFoundTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-notfound-tmp]' },] }
    ];
    NgNotFoundTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgTypeToSearchTemplateDirective = /** @class */ (function () {
        function NgTypeToSearchTemplateDirective(template) {
            this.template = template;
        }
        return NgTypeToSearchTemplateDirective;
    }());
    NgTypeToSearchTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-typetosearch-tmp]' },] }
    ];
    NgTypeToSearchTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgLoadingTextTemplateDirective = /** @class */ (function () {
        function NgLoadingTextTemplateDirective(template) {
            this.template = template;
        }
        return NgLoadingTextTemplateDirective;
    }());
    NgLoadingTextTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-loadingtext-tmp]' },] }
    ];
    NgLoadingTextTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgTagTemplateDirective = /** @class */ (function () {
        function NgTagTemplateDirective(template) {
            this.template = template;
        }
        return NgTagTemplateDirective;
    }());
    NgTagTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-tag-tmp]' },] }
    ];
    NgTagTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };
    var NgLoadingSpinnerTemplateDirective = /** @class */ (function () {
        function NgLoadingSpinnerTemplateDirective(template) {
            this.template = template;
        }
        return NgLoadingSpinnerTemplateDirective;
    }());
    NgLoadingSpinnerTemplateDirective.decorators = [
        { type: i0.Directive, args: [{ selector: '[ng-loadingspinner-tmp]' },] }
    ];
    NgLoadingSpinnerTemplateDirective.ctorParameters = function () { return [
        { type: i0.TemplateRef }
    ]; };

    var ConsoleService = /** @class */ (function () {
        function ConsoleService() {
        }
        ConsoleService.prototype.warn = function (message) {
            console.warn(message);
        };
        return ConsoleService;
    }());
    ConsoleService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function ConsoleService_Factory() { return new ConsoleService(); }, token: ConsoleService, providedIn: "root" });
    ConsoleService.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];

    function newId() {
        // First character is an 'a', it's good practice to tag id to begin with a letter
        return 'axxxxxxxxxxx'.replace(/[x]/g, function (_) {
            // tslint:disable-next-line:no-bitwise
            var val = Math.random() * 16 | 0;
            return val.toString(16);
        });
    }

    var diacritics = {
        '\u24B6': 'A',
        '\uFF21': 'A',
        '\u00C0': 'A',
        '\u00C1': 'A',
        '\u00C2': 'A',
        '\u1EA6': 'A',
        '\u1EA4': 'A',
        '\u1EAA': 'A',
        '\u1EA8': 'A',
        '\u00C3': 'A',
        '\u0100': 'A',
        '\u0102': 'A',
        '\u1EB0': 'A',
        '\u1EAE': 'A',
        '\u1EB4': 'A',
        '\u1EB2': 'A',
        '\u0226': 'A',
        '\u01E0': 'A',
        '\u00C4': 'A',
        '\u01DE': 'A',
        '\u1EA2': 'A',
        '\u00C5': 'A',
        '\u01FA': 'A',
        '\u01CD': 'A',
        '\u0200': 'A',
        '\u0202': 'A',
        '\u1EA0': 'A',
        '\u1EAC': 'A',
        '\u1EB6': 'A',
        '\u1E00': 'A',
        '\u0104': 'A',
        '\u023A': 'A',
        '\u2C6F': 'A',
        '\uA732': 'AA',
        '\u00C6': 'AE',
        '\u01FC': 'AE',
        '\u01E2': 'AE',
        '\uA734': 'AO',
        '\uA736': 'AU',
        '\uA738': 'AV',
        '\uA73A': 'AV',
        '\uA73C': 'AY',
        '\u24B7': 'B',
        '\uFF22': 'B',
        '\u1E02': 'B',
        '\u1E04': 'B',
        '\u1E06': 'B',
        '\u0243': 'B',
        '\u0182': 'B',
        '\u0181': 'B',
        '\u24B8': 'C',
        '\uFF23': 'C',
        '\u0106': 'C',
        '\u0108': 'C',
        '\u010A': 'C',
        '\u010C': 'C',
        '\u00C7': 'C',
        '\u1E08': 'C',
        '\u0187': 'C',
        '\u023B': 'C',
        '\uA73E': 'C',
        '\u24B9': 'D',
        '\uFF24': 'D',
        '\u1E0A': 'D',
        '\u010E': 'D',
        '\u1E0C': 'D',
        '\u1E10': 'D',
        '\u1E12': 'D',
        '\u1E0E': 'D',
        '\u0110': 'D',
        '\u018B': 'D',
        '\u018A': 'D',
        '\u0189': 'D',
        '\uA779': 'D',
        '\u01F1': 'DZ',
        '\u01C4': 'DZ',
        '\u01F2': 'Dz',
        '\u01C5': 'Dz',
        '\u24BA': 'E',
        '\uFF25': 'E',
        '\u00C8': 'E',
        '\u00C9': 'E',
        '\u00CA': 'E',
        '\u1EC0': 'E',
        '\u1EBE': 'E',
        '\u1EC4': 'E',
        '\u1EC2': 'E',
        '\u1EBC': 'E',
        '\u0112': 'E',
        '\u1E14': 'E',
        '\u1E16': 'E',
        '\u0114': 'E',
        '\u0116': 'E',
        '\u00CB': 'E',
        '\u1EBA': 'E',
        '\u011A': 'E',
        '\u0204': 'E',
        '\u0206': 'E',
        '\u1EB8': 'E',
        '\u1EC6': 'E',
        '\u0228': 'E',
        '\u1E1C': 'E',
        '\u0118': 'E',
        '\u1E18': 'E',
        '\u1E1A': 'E',
        '\u0190': 'E',
        '\u018E': 'E',
        '\u24BB': 'F',
        '\uFF26': 'F',
        '\u1E1E': 'F',
        '\u0191': 'F',
        '\uA77B': 'F',
        '\u24BC': 'G',
        '\uFF27': 'G',
        '\u01F4': 'G',
        '\u011C': 'G',
        '\u1E20': 'G',
        '\u011E': 'G',
        '\u0120': 'G',
        '\u01E6': 'G',
        '\u0122': 'G',
        '\u01E4': 'G',
        '\u0193': 'G',
        '\uA7A0': 'G',
        '\uA77D': 'G',
        '\uA77E': 'G',
        '\u24BD': 'H',
        '\uFF28': 'H',
        '\u0124': 'H',
        '\u1E22': 'H',
        '\u1E26': 'H',
        '\u021E': 'H',
        '\u1E24': 'H',
        '\u1E28': 'H',
        '\u1E2A': 'H',
        '\u0126': 'H',
        '\u2C67': 'H',
        '\u2C75': 'H',
        '\uA78D': 'H',
        '\u24BE': 'I',
        '\uFF29': 'I',
        '\u00CC': 'I',
        '\u00CD': 'I',
        '\u00CE': 'I',
        '\u0128': 'I',
        '\u012A': 'I',
        '\u012C': 'I',
        '\u0130': 'I',
        '\u00CF': 'I',
        '\u1E2E': 'I',
        '\u1EC8': 'I',
        '\u01CF': 'I',
        '\u0208': 'I',
        '\u020A': 'I',
        '\u1ECA': 'I',
        '\u012E': 'I',
        '\u1E2C': 'I',
        '\u0197': 'I',
        '\u24BF': 'J',
        '\uFF2A': 'J',
        '\u0134': 'J',
        '\u0248': 'J',
        '\u24C0': 'K',
        '\uFF2B': 'K',
        '\u1E30': 'K',
        '\u01E8': 'K',
        '\u1E32': 'K',
        '\u0136': 'K',
        '\u1E34': 'K',
        '\u0198': 'K',
        '\u2C69': 'K',
        '\uA740': 'K',
        '\uA742': 'K',
        '\uA744': 'K',
        '\uA7A2': 'K',
        '\u24C1': 'L',
        '\uFF2C': 'L',
        '\u013F': 'L',
        '\u0139': 'L',
        '\u013D': 'L',
        '\u1E36': 'L',
        '\u1E38': 'L',
        '\u013B': 'L',
        '\u1E3C': 'L',
        '\u1E3A': 'L',
        '\u0141': 'L',
        '\u023D': 'L',
        '\u2C62': 'L',
        '\u2C60': 'L',
        '\uA748': 'L',
        '\uA746': 'L',
        '\uA780': 'L',
        '\u01C7': 'LJ',
        '\u01C8': 'Lj',
        '\u24C2': 'M',
        '\uFF2D': 'M',
        '\u1E3E': 'M',
        '\u1E40': 'M',
        '\u1E42': 'M',
        '\u2C6E': 'M',
        '\u019C': 'M',
        '\u24C3': 'N',
        '\uFF2E': 'N',
        '\u01F8': 'N',
        '\u0143': 'N',
        '\u00D1': 'N',
        '\u1E44': 'N',
        '\u0147': 'N',
        '\u1E46': 'N',
        '\u0145': 'N',
        '\u1E4A': 'N',
        '\u1E48': 'N',
        '\u0220': 'N',
        '\u019D': 'N',
        '\uA790': 'N',
        '\uA7A4': 'N',
        '\u01CA': 'NJ',
        '\u01CB': 'Nj',
        '\u24C4': 'O',
        '\uFF2F': 'O',
        '\u00D2': 'O',
        '\u00D3': 'O',
        '\u00D4': 'O',
        '\u1ED2': 'O',
        '\u1ED0': 'O',
        '\u1ED6': 'O',
        '\u1ED4': 'O',
        '\u00D5': 'O',
        '\u1E4C': 'O',
        '\u022C': 'O',
        '\u1E4E': 'O',
        '\u014C': 'O',
        '\u1E50': 'O',
        '\u1E52': 'O',
        '\u014E': 'O',
        '\u022E': 'O',
        '\u0230': 'O',
        '\u00D6': 'O',
        '\u022A': 'O',
        '\u1ECE': 'O',
        '\u0150': 'O',
        '\u01D1': 'O',
        '\u020C': 'O',
        '\u020E': 'O',
        '\u01A0': 'O',
        '\u1EDC': 'O',
        '\u1EDA': 'O',
        '\u1EE0': 'O',
        '\u1EDE': 'O',
        '\u1EE2': 'O',
        '\u1ECC': 'O',
        '\u1ED8': 'O',
        '\u01EA': 'O',
        '\u01EC': 'O',
        '\u00D8': 'O',
        '\u01FE': 'O',
        '\u0186': 'O',
        '\u019F': 'O',
        '\uA74A': 'O',
        '\uA74C': 'O',
        '\u01A2': 'OI',
        '\uA74E': 'OO',
        '\u0222': 'OU',
        '\u24C5': 'P',
        '\uFF30': 'P',
        '\u1E54': 'P',
        '\u1E56': 'P',
        '\u01A4': 'P',
        '\u2C63': 'P',
        '\uA750': 'P',
        '\uA752': 'P',
        '\uA754': 'P',
        '\u24C6': 'Q',
        '\uFF31': 'Q',
        '\uA756': 'Q',
        '\uA758': 'Q',
        '\u024A': 'Q',
        '\u24C7': 'R',
        '\uFF32': 'R',
        '\u0154': 'R',
        '\u1E58': 'R',
        '\u0158': 'R',
        '\u0210': 'R',
        '\u0212': 'R',
        '\u1E5A': 'R',
        '\u1E5C': 'R',
        '\u0156': 'R',
        '\u1E5E': 'R',
        '\u024C': 'R',
        '\u2C64': 'R',
        '\uA75A': 'R',
        '\uA7A6': 'R',
        '\uA782': 'R',
        '\u24C8': 'S',
        '\uFF33': 'S',
        '\u1E9E': 'S',
        '\u015A': 'S',
        '\u1E64': 'S',
        '\u015C': 'S',
        '\u1E60': 'S',
        '\u0160': 'S',
        '\u1E66': 'S',
        '\u1E62': 'S',
        '\u1E68': 'S',
        '\u0218': 'S',
        '\u015E': 'S',
        '\u2C7E': 'S',
        '\uA7A8': 'S',
        '\uA784': 'S',
        '\u24C9': 'T',
        '\uFF34': 'T',
        '\u1E6A': 'T',
        '\u0164': 'T',
        '\u1E6C': 'T',
        '\u021A': 'T',
        '\u0162': 'T',
        '\u1E70': 'T',
        '\u1E6E': 'T',
        '\u0166': 'T',
        '\u01AC': 'T',
        '\u01AE': 'T',
        '\u023E': 'T',
        '\uA786': 'T',
        '\uA728': 'TZ',
        '\u24CA': 'U',
        '\uFF35': 'U',
        '\u00D9': 'U',
        '\u00DA': 'U',
        '\u00DB': 'U',
        '\u0168': 'U',
        '\u1E78': 'U',
        '\u016A': 'U',
        '\u1E7A': 'U',
        '\u016C': 'U',
        '\u00DC': 'U',
        '\u01DB': 'U',
        '\u01D7': 'U',
        '\u01D5': 'U',
        '\u01D9': 'U',
        '\u1EE6': 'U',
        '\u016E': 'U',
        '\u0170': 'U',
        '\u01D3': 'U',
        '\u0214': 'U',
        '\u0216': 'U',
        '\u01AF': 'U',
        '\u1EEA': 'U',
        '\u1EE8': 'U',
        '\u1EEE': 'U',
        '\u1EEC': 'U',
        '\u1EF0': 'U',
        '\u1EE4': 'U',
        '\u1E72': 'U',
        '\u0172': 'U',
        '\u1E76': 'U',
        '\u1E74': 'U',
        '\u0244': 'U',
        '\u24CB': 'V',
        '\uFF36': 'V',
        '\u1E7C': 'V',
        '\u1E7E': 'V',
        '\u01B2': 'V',
        '\uA75E': 'V',
        '\u0245': 'V',
        '\uA760': 'VY',
        '\u24CC': 'W',
        '\uFF37': 'W',
        '\u1E80': 'W',
        '\u1E82': 'W',
        '\u0174': 'W',
        '\u1E86': 'W',
        '\u1E84': 'W',
        '\u1E88': 'W',
        '\u2C72': 'W',
        '\u24CD': 'X',
        '\uFF38': 'X',
        '\u1E8A': 'X',
        '\u1E8C': 'X',
        '\u24CE': 'Y',
        '\uFF39': 'Y',
        '\u1EF2': 'Y',
        '\u00DD': 'Y',
        '\u0176': 'Y',
        '\u1EF8': 'Y',
        '\u0232': 'Y',
        '\u1E8E': 'Y',
        '\u0178': 'Y',
        '\u1EF6': 'Y',
        '\u1EF4': 'Y',
        '\u01B3': 'Y',
        '\u024E': 'Y',
        '\u1EFE': 'Y',
        '\u24CF': 'Z',
        '\uFF3A': 'Z',
        '\u0179': 'Z',
        '\u1E90': 'Z',
        '\u017B': 'Z',
        '\u017D': 'Z',
        '\u1E92': 'Z',
        '\u1E94': 'Z',
        '\u01B5': 'Z',
        '\u0224': 'Z',
        '\u2C7F': 'Z',
        '\u2C6B': 'Z',
        '\uA762': 'Z',
        '\u24D0': 'a',
        '\uFF41': 'a',
        '\u1E9A': 'a',
        '\u00E0': 'a',
        '\u00E1': 'a',
        '\u00E2': 'a',
        '\u1EA7': 'a',
        '\u1EA5': 'a',
        '\u1EAB': 'a',
        '\u1EA9': 'a',
        '\u00E3': 'a',
        '\u0101': 'a',
        '\u0103': 'a',
        '\u1EB1': 'a',
        '\u1EAF': 'a',
        '\u1EB5': 'a',
        '\u1EB3': 'a',
        '\u0227': 'a',
        '\u01E1': 'a',
        '\u00E4': 'a',
        '\u01DF': 'a',
        '\u1EA3': 'a',
        '\u00E5': 'a',
        '\u01FB': 'a',
        '\u01CE': 'a',
        '\u0201': 'a',
        '\u0203': 'a',
        '\u1EA1': 'a',
        '\u1EAD': 'a',
        '\u1EB7': 'a',
        '\u1E01': 'a',
        '\u0105': 'a',
        '\u2C65': 'a',
        '\u0250': 'a',
        '\uA733': 'aa',
        '\u00E6': 'ae',
        '\u01FD': 'ae',
        '\u01E3': 'ae',
        '\uA735': 'ao',
        '\uA737': 'au',
        '\uA739': 'av',
        '\uA73B': 'av',
        '\uA73D': 'ay',
        '\u24D1': 'b',
        '\uFF42': 'b',
        '\u1E03': 'b',
        '\u1E05': 'b',
        '\u1E07': 'b',
        '\u0180': 'b',
        '\u0183': 'b',
        '\u0253': 'b',
        '\u24D2': 'c',
        '\uFF43': 'c',
        '\u0107': 'c',
        '\u0109': 'c',
        '\u010B': 'c',
        '\u010D': 'c',
        '\u00E7': 'c',
        '\u1E09': 'c',
        '\u0188': 'c',
        '\u023C': 'c',
        '\uA73F': 'c',
        '\u2184': 'c',
        '\u24D3': 'd',
        '\uFF44': 'd',
        '\u1E0B': 'd',
        '\u010F': 'd',
        '\u1E0D': 'd',
        '\u1E11': 'd',
        '\u1E13': 'd',
        '\u1E0F': 'd',
        '\u0111': 'd',
        '\u018C': 'd',
        '\u0256': 'd',
        '\u0257': 'd',
        '\uA77A': 'd',
        '\u01F3': 'dz',
        '\u01C6': 'dz',
        '\u24D4': 'e',
        '\uFF45': 'e',
        '\u00E8': 'e',
        '\u00E9': 'e',
        '\u00EA': 'e',
        '\u1EC1': 'e',
        '\u1EBF': 'e',
        '\u1EC5': 'e',
        '\u1EC3': 'e',
        '\u1EBD': 'e',
        '\u0113': 'e',
        '\u1E15': 'e',
        '\u1E17': 'e',
        '\u0115': 'e',
        '\u0117': 'e',
        '\u00EB': 'e',
        '\u1EBB': 'e',
        '\u011B': 'e',
        '\u0205': 'e',
        '\u0207': 'e',
        '\u1EB9': 'e',
        '\u1EC7': 'e',
        '\u0229': 'e',
        '\u1E1D': 'e',
        '\u0119': 'e',
        '\u1E19': 'e',
        '\u1E1B': 'e',
        '\u0247': 'e',
        '\u025B': 'e',
        '\u01DD': 'e',
        '\u24D5': 'f',
        '\uFF46': 'f',
        '\u1E1F': 'f',
        '\u0192': 'f',
        '\uA77C': 'f',
        '\u24D6': 'g',
        '\uFF47': 'g',
        '\u01F5': 'g',
        '\u011D': 'g',
        '\u1E21': 'g',
        '\u011F': 'g',
        '\u0121': 'g',
        '\u01E7': 'g',
        '\u0123': 'g',
        '\u01E5': 'g',
        '\u0260': 'g',
        '\uA7A1': 'g',
        '\u1D79': 'g',
        '\uA77F': 'g',
        '\u24D7': 'h',
        '\uFF48': 'h',
        '\u0125': 'h',
        '\u1E23': 'h',
        '\u1E27': 'h',
        '\u021F': 'h',
        '\u1E25': 'h',
        '\u1E29': 'h',
        '\u1E2B': 'h',
        '\u1E96': 'h',
        '\u0127': 'h',
        '\u2C68': 'h',
        '\u2C76': 'h',
        '\u0265': 'h',
        '\u0195': 'hv',
        '\u24D8': 'i',
        '\uFF49': 'i',
        '\u00EC': 'i',
        '\u00ED': 'i',
        '\u00EE': 'i',
        '\u0129': 'i',
        '\u012B': 'i',
        '\u012D': 'i',
        '\u00EF': 'i',
        '\u1E2F': 'i',
        '\u1EC9': 'i',
        '\u01D0': 'i',
        '\u0209': 'i',
        '\u020B': 'i',
        '\u1ECB': 'i',
        '\u012F': 'i',
        '\u1E2D': 'i',
        '\u0268': 'i',
        '\u0131': 'i',
        '\u24D9': 'j',
        '\uFF4A': 'j',
        '\u0135': 'j',
        '\u01F0': 'j',
        '\u0249': 'j',
        '\u24DA': 'k',
        '\uFF4B': 'k',
        '\u1E31': 'k',
        '\u01E9': 'k',
        '\u1E33': 'k',
        '\u0137': 'k',
        '\u1E35': 'k',
        '\u0199': 'k',
        '\u2C6A': 'k',
        '\uA741': 'k',
        '\uA743': 'k',
        '\uA745': 'k',
        '\uA7A3': 'k',
        '\u24DB': 'l',
        '\uFF4C': 'l',
        '\u0140': 'l',
        '\u013A': 'l',
        '\u013E': 'l',
        '\u1E37': 'l',
        '\u1E39': 'l',
        '\u013C': 'l',
        '\u1E3D': 'l',
        '\u1E3B': 'l',
        '\u017F': 'l',
        '\u0142': 'l',
        '\u019A': 'l',
        '\u026B': 'l',
        '\u2C61': 'l',
        '\uA749': 'l',
        '\uA781': 'l',
        '\uA747': 'l',
        '\u01C9': 'lj',
        '\u24DC': 'm',
        '\uFF4D': 'm',
        '\u1E3F': 'm',
        '\u1E41': 'm',
        '\u1E43': 'm',
        '\u0271': 'm',
        '\u026F': 'm',
        '\u24DD': 'n',
        '\uFF4E': 'n',
        '\u01F9': 'n',
        '\u0144': 'n',
        '\u00F1': 'n',
        '\u1E45': 'n',
        '\u0148': 'n',
        '\u1E47': 'n',
        '\u0146': 'n',
        '\u1E4B': 'n',
        '\u1E49': 'n',
        '\u019E': 'n',
        '\u0272': 'n',
        '\u0149': 'n',
        '\uA791': 'n',
        '\uA7A5': 'n',
        '\u01CC': 'nj',
        '\u24DE': 'o',
        '\uFF4F': 'o',
        '\u00F2': 'o',
        '\u00F3': 'o',
        '\u00F4': 'o',
        '\u1ED3': 'o',
        '\u1ED1': 'o',
        '\u1ED7': 'o',
        '\u1ED5': 'o',
        '\u00F5': 'o',
        '\u1E4D': 'o',
        '\u022D': 'o',
        '\u1E4F': 'o',
        '\u014D': 'o',
        '\u1E51': 'o',
        '\u1E53': 'o',
        '\u014F': 'o',
        '\u022F': 'o',
        '\u0231': 'o',
        '\u00F6': 'o',
        '\u022B': 'o',
        '\u1ECF': 'o',
        '\u0151': 'o',
        '\u01D2': 'o',
        '\u020D': 'o',
        '\u020F': 'o',
        '\u01A1': 'o',
        '\u1EDD': 'o',
        '\u1EDB': 'o',
        '\u1EE1': 'o',
        '\u1EDF': 'o',
        '\u1EE3': 'o',
        '\u1ECD': 'o',
        '\u1ED9': 'o',
        '\u01EB': 'o',
        '\u01ED': 'o',
        '\u00F8': 'o',
        '\u01FF': 'o',
        '\u0254': 'o',
        '\uA74B': 'o',
        '\uA74D': 'o',
        '\u0275': 'o',
        '\u01A3': 'oi',
        '\u0223': 'ou',
        '\uA74F': 'oo',
        '\u24DF': 'p',
        '\uFF50': 'p',
        '\u1E55': 'p',
        '\u1E57': 'p',
        '\u01A5': 'p',
        '\u1D7D': 'p',
        '\uA751': 'p',
        '\uA753': 'p',
        '\uA755': 'p',
        '\u24E0': 'q',
        '\uFF51': 'q',
        '\u024B': 'q',
        '\uA757': 'q',
        '\uA759': 'q',
        '\u24E1': 'r',
        '\uFF52': 'r',
        '\u0155': 'r',
        '\u1E59': 'r',
        '\u0159': 'r',
        '\u0211': 'r',
        '\u0213': 'r',
        '\u1E5B': 'r',
        '\u1E5D': 'r',
        '\u0157': 'r',
        '\u1E5F': 'r',
        '\u024D': 'r',
        '\u027D': 'r',
        '\uA75B': 'r',
        '\uA7A7': 'r',
        '\uA783': 'r',
        '\u24E2': 's',
        '\uFF53': 's',
        '\u00DF': 's',
        '\u015B': 's',
        '\u1E65': 's',
        '\u015D': 's',
        '\u1E61': 's',
        '\u0161': 's',
        '\u1E67': 's',
        '\u1E63': 's',
        '\u1E69': 's',
        '\u0219': 's',
        '\u015F': 's',
        '\u023F': 's',
        '\uA7A9': 's',
        '\uA785': 's',
        '\u1E9B': 's',
        '\u24E3': 't',
        '\uFF54': 't',
        '\u1E6B': 't',
        '\u1E97': 't',
        '\u0165': 't',
        '\u1E6D': 't',
        '\u021B': 't',
        '\u0163': 't',
        '\u1E71': 't',
        '\u1E6F': 't',
        '\u0167': 't',
        '\u01AD': 't',
        '\u0288': 't',
        '\u2C66': 't',
        '\uA787': 't',
        '\uA729': 'tz',
        '\u24E4': 'u',
        '\uFF55': 'u',
        '\u00F9': 'u',
        '\u00FA': 'u',
        '\u00FB': 'u',
        '\u0169': 'u',
        '\u1E79': 'u',
        '\u016B': 'u',
        '\u1E7B': 'u',
        '\u016D': 'u',
        '\u00FC': 'u',
        '\u01DC': 'u',
        '\u01D8': 'u',
        '\u01D6': 'u',
        '\u01DA': 'u',
        '\u1EE7': 'u',
        '\u016F': 'u',
        '\u0171': 'u',
        '\u01D4': 'u',
        '\u0215': 'u',
        '\u0217': 'u',
        '\u01B0': 'u',
        '\u1EEB': 'u',
        '\u1EE9': 'u',
        '\u1EEF': 'u',
        '\u1EED': 'u',
        '\u1EF1': 'u',
        '\u1EE5': 'u',
        '\u1E73': 'u',
        '\u0173': 'u',
        '\u1E77': 'u',
        '\u1E75': 'u',
        '\u0289': 'u',
        '\u24E5': 'v',
        '\uFF56': 'v',
        '\u1E7D': 'v',
        '\u1E7F': 'v',
        '\u028B': 'v',
        '\uA75F': 'v',
        '\u028C': 'v',
        '\uA761': 'vy',
        '\u24E6': 'w',
        '\uFF57': 'w',
        '\u1E81': 'w',
        '\u1E83': 'w',
        '\u0175': 'w',
        '\u1E87': 'w',
        '\u1E85': 'w',
        '\u1E98': 'w',
        '\u1E89': 'w',
        '\u2C73': 'w',
        '\u24E7': 'x',
        '\uFF58': 'x',
        '\u1E8B': 'x',
        '\u1E8D': 'x',
        '\u24E8': 'y',
        '\uFF59': 'y',
        '\u1EF3': 'y',
        '\u00FD': 'y',
        '\u0177': 'y',
        '\u1EF9': 'y',
        '\u0233': 'y',
        '\u1E8F': 'y',
        '\u00FF': 'y',
        '\u1EF7': 'y',
        '\u1E99': 'y',
        '\u1EF5': 'y',
        '\u01B4': 'y',
        '\u024F': 'y',
        '\u1EFF': 'y',
        '\u24E9': 'z',
        '\uFF5A': 'z',
        '\u017A': 'z',
        '\u1E91': 'z',
        '\u017C': 'z',
        '\u017E': 'z',
        '\u1E93': 'z',
        '\u1E95': 'z',
        '\u01B6': 'z',
        '\u0225': 'z',
        '\u0240': 'z',
        '\u2C6C': 'z',
        '\uA763': 'z',
        '\u0386': '\u0391',
        '\u0388': '\u0395',
        '\u0389': '\u0397',
        '\u038A': '\u0399',
        '\u03AA': '\u0399',
        '\u038C': '\u039F',
        '\u038E': '\u03A5',
        '\u03AB': '\u03A5',
        '\u038F': '\u03A9',
        '\u03AC': '\u03B1',
        '\u03AD': '\u03B5',
        '\u03AE': '\u03B7',
        '\u03AF': '\u03B9',
        '\u03CA': '\u03B9',
        '\u0390': '\u03B9',
        '\u03CC': '\u03BF',
        '\u03CD': '\u03C5',
        '\u03CB': '\u03C5',
        '\u03B0': '\u03C5',
        '\u03C9': '\u03C9',
        '\u03C2': '\u03C3'
    };
    function stripSpecialChars(text) {
        var match = function (a) {
            return diacritics[a] || a;
        };
        return text.replace(/[^\u0000-\u007E]/g, match);
    }

    var ItemsList = /** @class */ (function () {
        function ItemsList(_ngSelect, _selectionModel) {
            this._ngSelect = _ngSelect;
            this._selectionModel = _selectionModel;
            this._items = [];
            this._filteredItems = [];
            this._markedIndex = -1;
        }
        Object.defineProperty(ItemsList.prototype, "items", {
            get: function () {
                return this._items;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "filteredItems", {
            get: function () {
                return this._filteredItems;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "markedIndex", {
            get: function () {
                return this._markedIndex;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "selectedItems", {
            get: function () {
                return this._selectionModel.value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "markedItem", {
            get: function () {
                return this._filteredItems[this._markedIndex];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "noItemsToSelect", {
            get: function () {
                return this._ngSelect.hideSelected && this._items.length === this.selectedItems.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "maxItemsSelected", {
            get: function () {
                return this._ngSelect.multiple && this._ngSelect.maxSelectedItems <= this.selectedItems.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ItemsList.prototype, "lastSelectedItem", {
            get: function () {
                var i = this.selectedItems.length - 1;
                for (; i >= 0; i--) {
                    var item = this.selectedItems[i];
                    if (!item.disabled) {
                        return item;
                    }
                }
                return null;
            },
            enumerable: false,
            configurable: true
        });
        ItemsList.prototype.setItems = function (items) {
            var _this = this;
            this._items = items.map(function (item, index) { return _this.mapItem(item, index); });
            if (this._ngSelect.groupBy) {
                this._groups = this._groupBy(this._items, this._ngSelect.groupBy);
                this._items = this._flatten(this._groups);
            }
            else {
                this._groups = new Map();
                this._groups.set(undefined, this._items);
            }
            this._filteredItems = __spreadArray([], __read(this._items));
        };
        ItemsList.prototype.select = function (item) {
            if (item.selected || this.maxItemsSelected) {
                return;
            }
            var multiple = this._ngSelect.multiple;
            if (!multiple) {
                this.clearSelected();
            }
            this._selectionModel.select(item, multiple, this._ngSelect.selectableGroupAsModel);
            if (this._ngSelect.hideSelected) {
                this._hideSelected(item);
            }
        };
        ItemsList.prototype.unselect = function (item) {
            if (!item.selected) {
                return;
            }
            this._selectionModel.unselect(item, this._ngSelect.multiple);
            if (this._ngSelect.hideSelected && isDefined(item.index) && this._ngSelect.multiple) {
                this._showSelected(item);
            }
        };
        ItemsList.prototype.findItem = function (value) {
            var _this = this;
            var findBy;
            if (this._ngSelect.compareWith) {
                findBy = function (item) { return _this._ngSelect.compareWith(item.value, value); };
            }
            else if (this._ngSelect.bindValue) {
                findBy = function (item) { return !item.children && _this.resolveNested(item.value, _this._ngSelect.bindValue) === value; };
            }
            else {
                findBy = function (item) { return item.value === value ||
                    !item.children && item.label && item.label === _this.resolveNested(value, _this._ngSelect.bindLabel); };
            }
            return this._items.find(function (item) { return findBy(item); });
        };
        ItemsList.prototype.addItem = function (item) {
            var option = this.mapItem(item, this._items.length);
            this._items.push(option);
            this._filteredItems.push(option);
            return option;
        };
        ItemsList.prototype.clearSelected = function (keepDisabled) {
            if (keepDisabled === void 0) { keepDisabled = false; }
            this._selectionModel.clear(keepDisabled);
            this._items.forEach(function (item) {
                item.selected = keepDisabled && item.selected && item.disabled;
                item.marked = false;
            });
            if (this._ngSelect.hideSelected) {
                this.resetFilteredItems();
            }
        };
        ItemsList.prototype.findByLabel = function (term) {
            term = stripSpecialChars(term).toLocaleLowerCase();
            return this.filteredItems.find(function (item) {
                var label = stripSpecialChars(item.label).toLocaleLowerCase();
                return label.substr(0, term.length) === term;
            });
        };
        ItemsList.prototype.filter = function (term) {
            var e_1, _a;
            if (!term) {
                this.resetFilteredItems();
                return;
            }
            this._filteredItems = [];
            term = this._ngSelect.searchFn ? term : stripSpecialChars(term).toLocaleLowerCase();
            var match = this._ngSelect.searchFn || this._defaultSearchFn;
            var hideSelected = this._ngSelect.hideSelected;
            var _loop_1 = function (key) {
                var e_2, _d, _e;
                var matchedItems = [];
                try {
                    for (var _f = (e_2 = void 0, __values(this_1._groups.get(key))), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var item = _g.value;
                        if (hideSelected && (item.parent && item.parent.selected || item.selected)) {
                            continue;
                        }
                        var searchItem = this_1._ngSelect.searchFn ? item.value : item;
                        if (match(term, searchItem)) {
                            matchedItems.push(item);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_d = _f.return)) _d.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                if (matchedItems.length > 0) {
                    var _h = __read(matchedItems.slice(-1), 1), last_1 = _h[0];
                    if (last_1.parent) {
                        var head = this_1._items.find(function (x) { return x === last_1.parent; });
                        this_1._filteredItems.push(head);
                    }
                    (_e = this_1._filteredItems).push.apply(_e, __spreadArray([], __read(matchedItems)));
                }
            };
            var this_1 = this;
            try {
                for (var _b = __values(Array.from(this._groups.keys())), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    _loop_1(key);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        ItemsList.prototype.resetFilteredItems = function () {
            if (this._filteredItems.length === this._items.length) {
                return;
            }
            if (this._ngSelect.hideSelected && this.selectedItems.length > 0) {
                this._filteredItems = this._items.filter(function (x) { return !x.selected; });
            }
            else {
                this._filteredItems = this._items;
            }
        };
        ItemsList.prototype.unmarkItem = function () {
            this._markedIndex = -1;
        };
        ItemsList.prototype.markNextItem = function () {
            this._stepToItem(+1);
        };
        ItemsList.prototype.markPreviousItem = function () {
            this._stepToItem(-1);
        };
        ItemsList.prototype.markItem = function (item) {
            this._markedIndex = this._filteredItems.indexOf(item);
        };
        ItemsList.prototype.markSelectedOrDefault = function (markDefault) {
            if (this._filteredItems.length === 0) {
                return;
            }
            var lastMarkedIndex = this._getLastMarkedIndex();
            if (lastMarkedIndex > -1) {
                this._markedIndex = lastMarkedIndex;
            }
            else {
                this._markedIndex = markDefault ? this.filteredItems.findIndex(function (x) { return !x.disabled; }) : -1;
            }
        };
        ItemsList.prototype.resolveNested = function (option, key) {
            if (!isObject(option)) {
                return option;
            }
            if (key.indexOf('.') === -1) {
                return option[key];
            }
            else {
                var keys = key.split('.');
                var value = option;
                for (var i = 0, len = keys.length; i < len; ++i) {
                    if (value == null) {
                        return null;
                    }
                    value = value[keys[i]];
                }
                return value;
            }
        };
        ItemsList.prototype.mapItem = function (item, index) {
            var label = isDefined(item.$ngOptionLabel) ? item.$ngOptionLabel : this.resolveNested(item, this._ngSelect.bindLabel);
            var value = isDefined(item.$ngOptionValue) ? item.$ngOptionValue : item;
            return {
                index: index,
                label: isDefined(label) ? label.toString() : '',
                value: value,
                disabled: item.disabled,
                htmlId: this._ngSelect.dropdownId + "-" + index,
            };
        };
        ItemsList.prototype.mapSelectedItems = function () {
            var e_3, _a;
            var _this = this;
            var multiple = this._ngSelect.multiple;
            try {
                for (var _b = __values(this.selectedItems), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var selected = _c.value;
                    var value = this._ngSelect.bindValue ? this.resolveNested(selected.value, this._ngSelect.bindValue) : selected.value;
                    var item = isDefined(value) ? this.findItem(value) : null;
                    this._selectionModel.unselect(selected, multiple);
                    this._selectionModel.select(item || selected, multiple, this._ngSelect.selectableGroupAsModel);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (this._ngSelect.hideSelected) {
                this._filteredItems = this.filteredItems.filter(function (x) { return _this.selectedItems.indexOf(x) === -1; });
            }
        };
        ItemsList.prototype._showSelected = function (item) {
            var e_4, _a;
            this._filteredItems.push(item);
            if (item.parent) {
                var parent_1 = item.parent;
                var parentExists = this._filteredItems.find(function (x) { return x === parent_1; });
                if (!parentExists) {
                    this._filteredItems.push(parent_1);
                }
            }
            else if (item.children) {
                try {
                    for (var _b = __values(item.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        child.selected = false;
                        this._filteredItems.push(child);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            this._filteredItems = __spreadArray([], __read(this._filteredItems.sort(function (a, b) { return (a.index - b.index); })));
        };
        ItemsList.prototype._hideSelected = function (item) {
            this._filteredItems = this._filteredItems.filter(function (x) { return x !== item; });
            if (item.parent) {
                var children = item.parent.children;
                if (children.every(function (x) { return x.selected; })) {
                    this._filteredItems = this._filteredItems.filter(function (x) { return x !== item.parent; });
                }
            }
            else if (item.children) {
                this._filteredItems = this.filteredItems.filter(function (x) { return x.parent !== item; });
            }
        };
        ItemsList.prototype._defaultSearchFn = function (search, opt) {
            var label = stripSpecialChars(opt.label).toLocaleLowerCase();
            return label.indexOf(search) > -1;
        };
        ItemsList.prototype._getNextItemIndex = function (steps) {
            if (steps > 0) {
                return (this._markedIndex >= this._filteredItems.length - 1) ? 0 : (this._markedIndex + 1);
            }
            return (this._markedIndex <= 0) ? (this._filteredItems.length - 1) : (this._markedIndex - 1);
        };
        ItemsList.prototype._stepToItem = function (steps) {
            if (this._filteredItems.length === 0 || this._filteredItems.every(function (x) { return x.disabled; })) {
                return;
            }
            this._markedIndex = this._getNextItemIndex(steps);
            if (this.markedItem.disabled) {
                this._stepToItem(steps);
            }
        };
        ItemsList.prototype._getLastMarkedIndex = function () {
            if (this._ngSelect.hideSelected) {
                return -1;
            }
            if (this._markedIndex > -1 && this.markedItem === undefined) {
                return -1;
            }
            var selectedIndex = this._filteredItems.indexOf(this.lastSelectedItem);
            if (this.lastSelectedItem && selectedIndex < 0) {
                return -1;
            }
            return Math.max(this.markedIndex, selectedIndex);
        };
        ItemsList.prototype._groupBy = function (items, prop) {
            var e_5, _a, e_6, _b;
            var _this = this;
            var groups = new Map();
            if (items.length === 0) {
                return groups;
            }
            // Check if items are already grouped by given key.
            if (Array.isArray(items[0].value[prop])) {
                try {
                    for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                        var item = items_1_1.value;
                        var children = (item.value[prop] || []).map(function (x, index) { return _this.mapItem(x, index); });
                        groups.set(item, children);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return groups;
            }
            var isFnKey = isFunction(this._ngSelect.groupBy);
            var keyFn = function (item) {
                var key = isFnKey ? prop(item.value) : item.value[prop];
                return isDefined(key) ? key : undefined;
            };
            try {
                // Group items by key.
                for (var items_2 = __values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                    var item = items_2_1.value;
                    var key = keyFn(item);
                    var group = groups.get(key);
                    if (group) {
                        group.push(item);
                    }
                    else {
                        groups.set(key, [item]);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (items_2_1 && !items_2_1.done && (_b = items_2.return)) _b.call(items_2);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return groups;
        };
        ItemsList.prototype._flatten = function (groups) {
            var e_7, _a;
            var isGroupByFn = isFunction(this._ngSelect.groupBy);
            var items = [];
            var _loop_2 = function (key) {
                var i = items.length;
                if (key === undefined) {
                    var withoutGroup = groups.get(undefined) || [];
                    items.push.apply(items, __spreadArray([], __read(withoutGroup.map(function (x) {
                        x.index = i++;
                        return x;
                    }))));
                    return "continue";
                }
                var isObjectKey = isObject(key);
                var parent = {
                    label: isObjectKey ? '' : String(key),
                    children: undefined,
                    parent: null,
                    index: i++,
                    disabled: !this_2._ngSelect.selectableGroup,
                    htmlId: newId(),
                };
                var groupKey = isGroupByFn ? this_2._ngSelect.bindLabel : this_2._ngSelect.groupBy;
                var groupValue = this_2._ngSelect.groupValue || (function () {
                    var _a;
                    if (isObjectKey) {
                        return key.value;
                    }
                    return _a = {}, _a[groupKey] = key, _a;
                });
                var children = groups.get(key).map(function (x) {
                    x.parent = parent;
                    x.children = undefined;
                    x.index = i++;
                    return x;
                });
                parent.children = children;
                parent.value = groupValue(key, children.map(function (x) { return x.value; }));
                items.push(parent);
                items.push.apply(items, __spreadArray([], __read(children)));
            };
            var this_2 = this;
            try {
                for (var _b = __values(Array.from(groups.keys())), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    _loop_2(key);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return items;
        };
        return ItemsList;
    }());

    var KeyCode;
    (function (KeyCode) {
        KeyCode[KeyCode["Tab"] = 9] = "Tab";
        KeyCode[KeyCode["Enter"] = 13] = "Enter";
        KeyCode[KeyCode["Esc"] = 27] = "Esc";
        KeyCode[KeyCode["Space"] = 32] = "Space";
        KeyCode[KeyCode["ArrowUp"] = 38] = "ArrowUp";
        KeyCode[KeyCode["ArrowDown"] = 40] = "ArrowDown";
        KeyCode[KeyCode["Backspace"] = 8] = "Backspace";
    })(KeyCode || (KeyCode = {}));

    var NgDropdownPanelService = /** @class */ (function () {
        function NgDropdownPanelService() {
            this._dimensions = {
                itemHeight: 0,
                panelHeight: 0,
                itemsPerViewport: 0
            };
        }
        Object.defineProperty(NgDropdownPanelService.prototype, "dimensions", {
            get: function () {
                return this._dimensions;
            },
            enumerable: false,
            configurable: true
        });
        NgDropdownPanelService.prototype.calculateItems = function (scrollPos, itemsLength, buffer) {
            var d = this._dimensions;
            var scrollHeight = d.itemHeight * itemsLength;
            var scrollTop = Math.max(0, scrollPos);
            var indexByScrollTop = scrollTop / scrollHeight * itemsLength;
            var end = Math.min(itemsLength, Math.ceil(indexByScrollTop) + (d.itemsPerViewport + 1));
            var maxStartEnd = end;
            var maxStart = Math.max(0, maxStartEnd - d.itemsPerViewport);
            var start = Math.min(maxStart, Math.floor(indexByScrollTop));
            var topPadding = d.itemHeight * Math.ceil(start) - (d.itemHeight * Math.min(start, buffer));
            topPadding = !isNaN(topPadding) ? topPadding : 0;
            start = !isNaN(start) ? start : -1;
            end = !isNaN(end) ? end : -1;
            start -= buffer;
            start = Math.max(0, start);
            end += buffer;
            end = Math.min(itemsLength, end);
            return {
                topPadding: topPadding,
                scrollHeight: scrollHeight,
                start: start,
                end: end
            };
        };
        NgDropdownPanelService.prototype.setDimensions = function (itemHeight, panelHeight) {
            var itemsPerViewport = Math.max(1, Math.floor(panelHeight / itemHeight));
            this._dimensions = {
                itemHeight: itemHeight,
                panelHeight: panelHeight,
                itemsPerViewport: itemsPerViewport
            };
        };
        NgDropdownPanelService.prototype.getScrollTo = function (itemTop, itemHeight, lastScroll) {
            var panelHeight = this.dimensions.panelHeight;
            var itemBottom = itemTop + itemHeight;
            var top = lastScroll;
            var bottom = top + panelHeight;
            if (panelHeight >= itemBottom && lastScroll === itemTop) {
                return null;
            }
            if (itemBottom > bottom) {
                return top + itemBottom - bottom;
            }
            else if (itemTop <= top) {
                return itemTop;
            }
            return null;
        };
        return NgDropdownPanelService;
    }());
    NgDropdownPanelService.decorators = [
        { type: i0.Injectable }
    ];

    var TOP_CSS_CLASS = 'ng-select-top';
    var BOTTOM_CSS_CLASS = 'ng-select-bottom';
    var SCROLL_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? rxjs.animationFrameScheduler : rxjs.asapScheduler;
    var NgDropdownPanelComponent = /** @class */ (function () {
        function NgDropdownPanelComponent(_renderer, _zone, _panelService, _elementRef, _document) {
            this._renderer = _renderer;
            this._zone = _zone;
            this._panelService = _panelService;
            this._document = _document;
            this.items = [];
            this.position = 'auto';
            this.virtualScroll = false;
            this.filterValue = null;
            this.update = new i0.EventEmitter();
            this.scroll = new i0.EventEmitter();
            this.scrollToEnd = new i0.EventEmitter();
            this.outsideClick = new i0.EventEmitter();
            this._destroy$ = new rxjs.Subject();
            this._scrollToEndFired = false;
            this._updateScrollHeight = false;
            this._lastScrollPosition = 0;
            this._dropdown = _elementRef.nativeElement;
        }
        Object.defineProperty(NgDropdownPanelComponent.prototype, "currentPosition", {
            get: function () {
                return this._currentPosition;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgDropdownPanelComponent.prototype, "itemsLength", {
            get: function () {
                return this._itemsLength;
            },
            set: function (value) {
                if (value !== this._itemsLength) {
                    this._itemsLength = value;
                    this._onItemsLengthChanged();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgDropdownPanelComponent.prototype, "_startOffset", {
            get: function () {
                if (this.markedItem) {
                    var _a = this._panelService.dimensions, itemHeight = _a.itemHeight, panelHeight = _a.panelHeight;
                    var offset = this.markedItem.index * itemHeight;
                    return panelHeight > offset ? 0 : offset;
                }
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        NgDropdownPanelComponent.prototype.handleMousedown = function ($event) {
            var target = $event.target;
            if (target.tagName === 'INPUT') {
                return;
            }
            $event.preventDefault();
        };
        NgDropdownPanelComponent.prototype.ngOnInit = function () {
            this._select = this._dropdown.parentElement;
            this._virtualPadding = this.paddingElementRef.nativeElement;
            this._scrollablePanel = this.scrollElementRef.nativeElement;
            this._contentPanel = this.contentElementRef.nativeElement;
            this._handleScroll();
            this._handleOutsideClick();
            this._appendDropdown();
        };
        NgDropdownPanelComponent.prototype.ngOnChanges = function (changes) {
            if (changes.items) {
                var change = changes.items;
                this._onItemsChange(change.currentValue, change.firstChange);
            }
        };
        NgDropdownPanelComponent.prototype.ngOnDestroy = function () {
            this._destroy$.next();
            this._destroy$.complete();
            this._destroy$.unsubscribe();
            if (this.appendTo) {
                this._renderer.removeChild(this._dropdown.parentNode, this._dropdown);
            }
        };
        NgDropdownPanelComponent.prototype.scrollTo = function (option, startFromOption) {
            if (startFromOption === void 0) { startFromOption = false; }
            if (!option) {
                return;
            }
            var index = this.items.indexOf(option);
            if (index < 0 || index >= this.itemsLength) {
                return;
            }
            var scrollTo;
            if (this.virtualScroll) {
                var itemHeight = this._panelService.dimensions.itemHeight;
                scrollTo = this._panelService.getScrollTo(index * itemHeight, itemHeight, this._lastScrollPosition);
            }
            else {
                var item = this._dropdown.querySelector("#" + option.htmlId);
                var lastScroll = startFromOption ? item.offsetTop : this._lastScrollPosition;
                scrollTo = this._panelService.getScrollTo(item.offsetTop, item.clientHeight, lastScroll);
            }
            if (isDefined(scrollTo)) {
                this._scrollablePanel.scrollTop = scrollTo;
            }
        };
        NgDropdownPanelComponent.prototype.scrollToTag = function () {
            var panel = this._scrollablePanel;
            panel.scrollTop = panel.scrollHeight - panel.clientHeight;
        };
        NgDropdownPanelComponent.prototype.adjustPosition = function () {
            this._updateYPosition();
        };
        NgDropdownPanelComponent.prototype._handleDropdownPosition = function () {
            this._currentPosition = this._calculateCurrentPosition(this._dropdown);
            if (this._currentPosition === 'top') {
                this._renderer.addClass(this._dropdown, TOP_CSS_CLASS);
                this._renderer.removeClass(this._dropdown, BOTTOM_CSS_CLASS);
                this._renderer.addClass(this._select, TOP_CSS_CLASS);
                this._renderer.removeClass(this._select, BOTTOM_CSS_CLASS);
            }
            else {
                this._renderer.addClass(this._dropdown, BOTTOM_CSS_CLASS);
                this._renderer.removeClass(this._dropdown, TOP_CSS_CLASS);
                this._renderer.addClass(this._select, BOTTOM_CSS_CLASS);
                this._renderer.removeClass(this._select, TOP_CSS_CLASS);
            }
            if (this.appendTo) {
                this._updateYPosition();
            }
            this._dropdown.style.opacity = '1';
        };
        NgDropdownPanelComponent.prototype._handleScroll = function () {
            var _this = this;
            this._zone.runOutsideAngular(function () {
                rxjs.fromEvent(_this.scrollElementRef.nativeElement, 'scroll')
                    .pipe(operators.takeUntil(_this._destroy$), operators.auditTime(0, SCROLL_SCHEDULER))
                    .subscribe(function (e) {
                    var path = e.path || (e.composedPath && e.composedPath());
                    var scrollTop = !path || path.length === 0 ? e.target.scrollTop : path[0].scrollTop;
                    _this._onContentScrolled(scrollTop);
                });
            });
        };
        NgDropdownPanelComponent.prototype._handleOutsideClick = function () {
            var _this = this;
            if (!this._document) {
                return;
            }
            this._zone.runOutsideAngular(function () {
                rxjs.merge(rxjs.fromEvent(_this._document, 'touchstart', { capture: true }), rxjs.fromEvent(_this._document, 'mousedown', { capture: true })).pipe(operators.takeUntil(_this._destroy$))
                    .subscribe(function ($event) { return _this._checkToClose($event); });
            });
        };
        NgDropdownPanelComponent.prototype._checkToClose = function ($event) {
            var _this = this;
            if (this._select.contains($event.target) || this._dropdown.contains($event.target)) {
                return;
            }
            var path = $event.path || ($event.composedPath && $event.composedPath());
            if ($event.target && $event.target.shadowRoot && path && path[0] && this._select.contains(path[0])) {
                return;
            }
            this._zone.run(function () { return _this.outsideClick.emit(); });
        };
        NgDropdownPanelComponent.prototype._onItemsChange = function (items, firstChange) {
            this.items = items || [];
            this._scrollToEndFired = false;
            this.itemsLength = items.length;
            if (this.virtualScroll) {
                this._updateItemsRange(firstChange);
            }
            else {
                this._setVirtualHeight();
                this._updateItems(firstChange);
            }
        };
        NgDropdownPanelComponent.prototype._updateItems = function (firstChange) {
            var _this = this;
            this.update.emit(this.items);
            if (firstChange === false) {
                return;
            }
            this._zone.runOutsideAngular(function () {
                Promise.resolve().then(function () {
                    var panelHeight = _this._scrollablePanel.clientHeight;
                    _this._panelService.setDimensions(0, panelHeight);
                    _this._handleDropdownPosition();
                    _this.scrollTo(_this.markedItem, firstChange);
                });
            });
        };
        NgDropdownPanelComponent.prototype._updateItemsRange = function (firstChange) {
            var _this = this;
            this._zone.runOutsideAngular(function () {
                _this._measureDimensions().then(function () {
                    if (firstChange) {
                        _this._renderItemsRange(_this._startOffset);
                        _this._handleDropdownPosition();
                    }
                    else {
                        _this._renderItemsRange();
                    }
                });
            });
        };
        NgDropdownPanelComponent.prototype._onContentScrolled = function (scrollTop) {
            if (this.virtualScroll) {
                this._renderItemsRange(scrollTop);
            }
            this._lastScrollPosition = scrollTop;
            this._fireScrollToEnd(scrollTop);
        };
        NgDropdownPanelComponent.prototype._updateVirtualHeight = function (height) {
            if (this._updateScrollHeight) {
                this._virtualPadding.style.height = height + "px";
                this._updateScrollHeight = false;
            }
        };
        NgDropdownPanelComponent.prototype._setVirtualHeight = function () {
            if (!this._virtualPadding) {
                return;
            }
            this._virtualPadding.style.height = "0px";
        };
        NgDropdownPanelComponent.prototype._onItemsLengthChanged = function () {
            this._updateScrollHeight = true;
        };
        NgDropdownPanelComponent.prototype._renderItemsRange = function (scrollTop) {
            var _this = this;
            if (scrollTop === void 0) { scrollTop = null; }
            if (scrollTop && this._lastScrollPosition === scrollTop) {
                return;
            }
            scrollTop = scrollTop || this._scrollablePanel.scrollTop;
            var range = this._panelService.calculateItems(scrollTop, this.itemsLength, this.bufferAmount);
            this._updateVirtualHeight(range.scrollHeight);
            this._contentPanel.style.transform = "translateY(" + range.topPadding + "px)";
            this._zone.run(function () {
                _this.update.emit(_this.items.slice(range.start, range.end));
                _this.scroll.emit({ start: range.start, end: range.end });
            });
            if (isDefined(scrollTop) && this._lastScrollPosition === 0) {
                this._scrollablePanel.scrollTop = scrollTop;
                this._lastScrollPosition = scrollTop;
            }
        };
        NgDropdownPanelComponent.prototype._measureDimensions = function () {
            var _this = this;
            if (this._panelService.dimensions.itemHeight > 0 || this.itemsLength === 0) {
                return Promise.resolve(this._panelService.dimensions);
            }
            var _a = __read(this.items, 1), first = _a[0];
            this.update.emit([first]);
            return Promise.resolve().then(function () {
                var option = _this._dropdown.querySelector("#" + first.htmlId);
                var optionHeight = option.clientHeight;
                _this._virtualPadding.style.height = optionHeight * _this.itemsLength + "px";
                var panelHeight = _this._scrollablePanel.clientHeight;
                _this._panelService.setDimensions(optionHeight, panelHeight);
                return _this._panelService.dimensions;
            });
        };
        NgDropdownPanelComponent.prototype._fireScrollToEnd = function (scrollTop) {
            var _this = this;
            if (this._scrollToEndFired || scrollTop === 0) {
                return;
            }
            var padding = this.virtualScroll ?
                this._virtualPadding :
                this._contentPanel;
            if (scrollTop + this._dropdown.clientHeight >= padding.clientHeight) {
                this._zone.run(function () { return _this.scrollToEnd.emit(); });
                this._scrollToEndFired = true;
            }
        };
        NgDropdownPanelComponent.prototype._calculateCurrentPosition = function (dropdownEl) {
            if (this.position !== 'auto') {
                return this.position;
            }
            var selectRect = this._select.getBoundingClientRect();
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var offsetTop = selectRect.top + window.pageYOffset;
            var height = selectRect.height;
            var dropdownHeight = dropdownEl.getBoundingClientRect().height;
            if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
                return 'top';
            }
            else {
                return 'bottom';
            }
        };
        NgDropdownPanelComponent.prototype._appendDropdown = function () {
            if (!this.appendTo) {
                return;
            }
            this._parent = document.querySelector(this.appendTo);
            if (!this._parent) {
                throw new Error("appendTo selector " + this.appendTo + " did not found any parent element");
            }
            this._updateXPosition();
            this._parent.appendChild(this._dropdown);
        };
        NgDropdownPanelComponent.prototype._updateXPosition = function () {
            var select = this._select.getBoundingClientRect();
            var parent = this._parent.getBoundingClientRect();
            var offsetLeft = select.left - parent.left;
            this._dropdown.style.left = offsetLeft + 'px';
            this._dropdown.style.width = select.width + 'px';
            this._dropdown.style.minWidth = select.width + 'px';
        };
        NgDropdownPanelComponent.prototype._updateYPosition = function () {
            var select = this._select.getBoundingClientRect();
            var parent = this._parent.getBoundingClientRect();
            var delta = select.height;
            if (this._currentPosition === 'top') {
                var offsetBottom = parent.bottom - select.bottom;
                this._dropdown.style.bottom = offsetBottom + delta + 'px';
                this._dropdown.style.top = 'auto';
            }
            else if (this._currentPosition === 'bottom') {
                var offsetTop = select.top - parent.top;
                this._dropdown.style.top = offsetTop + delta + 'px';
                this._dropdown.style.bottom = 'auto';
            }
        };
        return NgDropdownPanelComponent;
    }());
    NgDropdownPanelComponent.decorators = [
        { type: i0.Component, args: [{
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    encapsulation: i0.ViewEncapsulation.None,
                    selector: 'ng-dropdown-panel',
                    template: "\n        <div *ngIf=\"headerTemplate\" class=\"ng-dropdown-header\">\n            <ng-container [ngTemplateOutlet]=\"headerTemplate\" [ngTemplateOutletContext]=\"{ searchTerm: filterValue }\"></ng-container>\n        </div>\n        <div #scroll class=\"ng-dropdown-panel-items scroll-host\">\n            <div #padding [class.total-padding]=\"virtualScroll\"></div>\n            <div #content [class.scrollable-content]=\"virtualScroll && items.length\">\n                <ng-content></ng-content>\n            </div>\n        </div>\n        <div *ngIf=\"footerTemplate\" class=\"ng-dropdown-footer\">\n            <ng-container [ngTemplateOutlet]=\"footerTemplate\" [ngTemplateOutletContext]=\"{ searchTerm: filterValue }\"></ng-container>\n        </div>\n    "
                },] }
    ];
    NgDropdownPanelComponent.ctorParameters = function () { return [
        { type: i0.Renderer2 },
        { type: i0.NgZone },
        { type: NgDropdownPanelService },
        { type: i0.ElementRef },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [common.DOCUMENT,] }] }
    ]; };
    NgDropdownPanelComponent.propDecorators = {
        items: [{ type: i0.Input }],
        markedItem: [{ type: i0.Input }],
        position: [{ type: i0.Input }],
        appendTo: [{ type: i0.Input }],
        bufferAmount: [{ type: i0.Input }],
        virtualScroll: [{ type: i0.Input }],
        headerTemplate: [{ type: i0.Input }],
        footerTemplate: [{ type: i0.Input }],
        filterValue: [{ type: i0.Input }],
        update: [{ type: i0.Output }],
        scroll: [{ type: i0.Output }],
        scrollToEnd: [{ type: i0.Output }],
        outsideClick: [{ type: i0.Output }],
        contentElementRef: [{ type: i0.ViewChild, args: ['content', { read: i0.ElementRef, static: true },] }],
        scrollElementRef: [{ type: i0.ViewChild, args: ['scroll', { read: i0.ElementRef, static: true },] }],
        paddingElementRef: [{ type: i0.ViewChild, args: ['padding', { read: i0.ElementRef, static: true },] }],
        handleMousedown: [{ type: i0.HostListener, args: ['mousedown', ['$event'],] }]
    };

    var NgOptionComponent = /** @class */ (function () {
        function NgOptionComponent(elementRef) {
            this.elementRef = elementRef;
            this.stateChange$ = new rxjs.Subject();
            this._disabled = false;
        }
        Object.defineProperty(NgOptionComponent.prototype, "disabled", {
            get: function () { return this._disabled; },
            set: function (value) { this._disabled = this._isDisabled(value); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgOptionComponent.prototype, "label", {
            get: function () {
                return (this.elementRef.nativeElement.textContent || '').trim();
            },
            enumerable: false,
            configurable: true
        });
        NgOptionComponent.prototype.ngOnChanges = function (changes) {
            if (changes.disabled) {
                this.stateChange$.next({
                    value: this.value,
                    disabled: this._disabled
                });
            }
        };
        NgOptionComponent.prototype.ngAfterViewChecked = function () {
            if (this.label !== this._previousLabel) {
                this._previousLabel = this.label;
                this.stateChange$.next({
                    value: this.value,
                    disabled: this._disabled,
                    label: this.elementRef.nativeElement.innerHTML
                });
            }
        };
        NgOptionComponent.prototype.ngOnDestroy = function () {
            this.stateChange$.complete();
        };
        NgOptionComponent.prototype._isDisabled = function (value) {
            return value != null && "" + value !== 'false';
        };
        return NgOptionComponent;
    }());
    NgOptionComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'ng-option',
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    template: "<ng-content></ng-content>"
                },] }
    ];
    NgOptionComponent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    NgOptionComponent.propDecorators = {
        value: [{ type: i0.Input }],
        disabled: [{ type: i0.Input }]
    };

    var NgSelectConfig = /** @class */ (function () {
        function NgSelectConfig() {
            this.notFoundText = 'No items found';
            this.typeToSearchText = 'Type to search';
            this.addTagText = 'Add item';
            this.loadingText = 'Loading...';
            this.clearAllText = 'Clear all';
            this.disableVirtualScroll = true;
            this.openOnEnter = true;
            this.appearance = 'underline';
        }
        return NgSelectConfig;
    }());
    NgSelectConfig.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function NgSelectConfig_Factory() { return new NgSelectConfig(); }, token: NgSelectConfig, providedIn: "root" });
    NgSelectConfig.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];

    var SELECTION_MODEL_FACTORY = new i0.InjectionToken('ng-select-selection-model');
    var NgSelectComponent = /** @class */ (function () {
        function NgSelectComponent(classes, autoFocus, config, newSelectionModel, _elementRef, _cd, _console) {
            var _this = this;
            this.classes = classes;
            this.autoFocus = autoFocus;
            this._cd = _cd;
            this._console = _console;
            this.markFirst = true;
            this.dropdownPosition = 'auto';
            this.loading = false;
            this.closeOnSelect = true;
            this.hideSelected = false;
            this.selectOnTab = false;
            this.bufferAmount = 4;
            this.selectableGroup = false;
            this.selectableGroupAsModel = true;
            this.searchFn = null;
            this.trackByFn = null;
            this.clearOnBackspace = true;
            this.labelForId = null;
            this.inputAttrs = {};
            this.readonly = false;
            this.searchWhileComposing = true;
            this.minTermLength = 0;
            this.editableSearchTerm = false;
            this.maxTermLength = 0;
            this.notCloseIfSearching = false;
            this.keyDownFn = function (_) { return true; };
            this.multiple = false;
            this.addTag = false;
            this.searchable = true;
            this.clearable = true;
            this.isOpen = false;
            // output events
            this.blurEvent = new i0.EventEmitter();
            this.focusEvent = new i0.EventEmitter();
            this.changeEvent = new i0.EventEmitter();
            this.openEvent = new i0.EventEmitter();
            this.closeEvent = new i0.EventEmitter();
            this.searchEvent = new i0.EventEmitter();
            this.clearEvent = new i0.EventEmitter();
            this.addEvent = new i0.EventEmitter();
            this.removeEvent = new i0.EventEmitter();
            this.scroll = new i0.EventEmitter();
            this.scrollToEnd = new i0.EventEmitter();
            this.searchLengthError = new i0.EventEmitter();
            this.clearTextEvent = new i0.EventEmitter();
            this.viewPortItems = [];
            this.searchTerm = null;
            this.dropdownId = newId();
            this.escapeHTML = true;
            this.useDefaultClass = true;
            this._items = [];
            this._defaultLabel = 'label';
            this._pressedKeys = [];
            this._isComposing = false;
            this._destroy$ = new rxjs.Subject();
            this._keyPress$ = new rxjs.Subject();
            this._onChange = function (_) { };
            this._onTouched = function () { };
            this.clearItem = function (item) {
                var option = _this.selectedItems.find(function (x) { return x.value === item; });
                _this.unselect(option);
            };
            this.trackByOption = function (_, item) {
                if (_this.trackByFn) {
                    return _this.trackByFn(item.value);
                }
                return item;
            };
            this._mergeGlobalConfig(config);
            this.itemsList = new ItemsList(this, newSelectionModel());
            this.element = _elementRef.nativeElement;
        }
        Object.defineProperty(NgSelectComponent.prototype, "items", {
            get: function () { return this._items; },
            set: function (value) {
                this._itemsAreUsed = true;
                this._items = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(NgSelectComponent.prototype, "compareWith", {
            get: function () { return this._compareWith; },
            set: function (fn) {
                if (fn !== undefined && fn !== null && !isFunction(fn)) {
                    throw Error('`compareWith` must be a function.');
                }
                this._compareWith = fn;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgSelectComponent.prototype, "clearSearchOnAdd", {
            get: function () { return isDefined(this._clearSearchOnAdd) ? this._clearSearchOnAdd : this.closeOnSelect; },
            set: function (value) {
                this._clearSearchOnAdd = value;
            },
            enumerable: false,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(NgSelectComponent.prototype, "disabled", {
            get: function () { return this.readonly || this._disabled; },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(NgSelectComponent.prototype, "filtered", {
            get: function () { return (!!this.searchTerm && this.searchable || this._isComposing); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(NgSelectComponent.prototype, "_editableSearchTerm", {
            get: function () {
                return this.editableSearchTerm && !this.multiple;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgSelectComponent.prototype, "selectedItems", {
            get: function () {
                return this.itemsList.selectedItems;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgSelectComponent.prototype, "selectedValues", {
            get: function () {
                return this.selectedItems.map(function (x) { return x.value; });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgSelectComponent.prototype, "hasValue", {
            get: function () {
                return this.selectedItems.length > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgSelectComponent.prototype, "currentPanelPosition", {
            get: function () {
                if (this.dropdownPanel) {
                    return this.dropdownPanel.currentPosition;
                }
                return undefined;
            },
            enumerable: false,
            configurable: true
        });
        NgSelectComponent.prototype.ngOnInit = function () {
            this._handleKeyPresses();
            this._setInputAttributes();
        };
        NgSelectComponent.prototype.ngOnChanges = function (changes) {
            if (changes.multiple) {
                this.itemsList.clearSelected();
            }
            if (changes.items) {
                this._setItems(changes.items.currentValue || []);
            }
            if (changes.isOpen) {
                this._manualOpen = isDefined(changes.isOpen.currentValue);
            }
        };
        NgSelectComponent.prototype.ngAfterViewInit = function () {
            if (!this._itemsAreUsed) {
                this.escapeHTML = false;
                this._setItemsFromNgOptions();
            }
            if (isDefined(this.autoFocus)) {
                this.focus();
            }
        };
        NgSelectComponent.prototype.ngOnDestroy = function () {
            this._destroy$.next();
            this._destroy$.complete();
        };
        NgSelectComponent.prototype.handleKeyDown = function ($event) {
            var keyCode = KeyCode[$event.which];
            if (keyCode) {
                if (this.keyDownFn($event) === false) {
                    return;
                }
                this.handleKeyCode($event);
            }
            else if ($event.key && $event.key.length === 1) {
                this._keyPress$.next($event.key.toLocaleLowerCase());
            }
        };
        NgSelectComponent.prototype.handleKeyCode = function ($event) {
            switch ($event.which) {
                case KeyCode.ArrowDown:
                    this._handleArrowDown($event);
                    break;
                case KeyCode.ArrowUp:
                    this._handleArrowUp($event);
                    break;
                case KeyCode.Space:
                    this._handleSpace($event);
                    break;
                case KeyCode.Enter:
                    this._handleEnter($event);
                    break;
                case KeyCode.Tab:
                    this._handleTab($event);
                    break;
                case KeyCode.Esc:
                    this.close();
                    $event.preventDefault();
                    break;
                case KeyCode.Backspace:
                    this._handleBackspace();
                    break;
            }
        };
        NgSelectComponent.prototype.handleMousedown = function ($event) {
            var target = $event.target;
            if (target.tagName !== 'INPUT') {
                $event.preventDefault();
            }
            if (target.classList.contains('ng-clear-wrapper')) {
                this.handleClearClick();
                return;
            }
            if (target.classList.contains('ng-arrow-wrapper')) {
                this.handleArrowClick();
                return;
            }
            if (target.classList.contains('ng-value-icon')) {
                return;
            }
            if (!this.focused) {
                this.focus();
            }
            if (this.searchable) {
                this.open();
            }
            else {
                this.toggle();
            }
        };
        NgSelectComponent.prototype.handleArrowClick = function () {
            if (this.isOpen) {
                this.close();
            }
            else {
                this.open();
            }
        };
        NgSelectComponent.prototype.handleClearClick = function () {
            if (this.hasValue) {
                this.itemsList.clearSelected(true);
                this._updateNgModel();
            }
            this._clearSearch();
            this.focus();
            this.clearEvent.emit();
            this._onSelectionChanged();
        };
        NgSelectComponent.prototype.clearModel = function () {
            if (!this.clearable) {
                return;
            }
            this.itemsList.clearSelected();
            this._updateNgModel();
        };
        NgSelectComponent.prototype.writeValue = function (value) {
            this.itemsList.clearSelected();
            this._handleWriteValue(value);
            this._cd.markForCheck();
        };
        NgSelectComponent.prototype.registerOnChange = function (fn) {
            this._onChange = fn;
        };
        NgSelectComponent.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        NgSelectComponent.prototype.setDisabledState = function (state) {
            this._disabled = state;
            this._cd.markForCheck();
        };
        NgSelectComponent.prototype.toggle = function () {
            if (!this.isOpen) {
                this.open();
            }
            else {
                this.close();
            }
        };
        NgSelectComponent.prototype.open = function () {
            if (this.disabled || this.isOpen || this.itemsList.maxItemsSelected || this._manualOpen) {
                return;
            }
            if (!this._isTypeahead && !this.addTag && this.itemsList.noItemsToSelect) {
                return;
            }
            this.isOpen = true;
            this.itemsList.markSelectedOrDefault(this.markFirst);
            this.openEvent.emit();
            if (!this.searchTerm) {
                this.focus();
            }
            this.detectChanges();
        };
        NgSelectComponent.prototype.close = function () {
            if (!this.isOpen || this._manualOpen) {
                return;
            }
            this.isOpen = false;
            this._isComposing = false;
            if (!this._editableSearchTerm) {
                if (!this.notCloseIfSearching && this.searchTerm)
                    this._clearSearch();
            }
            else {
                this.itemsList.resetFilteredItems();
            }
            this.itemsList.unmarkItem();
            this._onTouched();
            this.closeEvent.emit();
            this._cd.markForCheck();
        };
        NgSelectComponent.prototype.toggleItem = function (item) {
            if (!item || item.disabled || this.disabled) {
                return;
            }
            if (this.multiple && item.selected) {
                this.unselect(item);
            }
            else {
                this.select(item);
            }
            if (this._editableSearchTerm) {
                this._setSearchTermFromItems();
            }
            this._onSelectionChanged();
        };
        NgSelectComponent.prototype.select = function (item) {
            if (!item.selected) {
                this.itemsList.select(item);
                if (this.clearSearchOnAdd && !this._editableSearchTerm) {
                    this._clearSearch();
                }
                this._updateNgModel();
                if (this.multiple) {
                    this.addEvent.emit(item.value);
                }
            }
            if (this.closeOnSelect || this.itemsList.noItemsToSelect) {
                this.close();
            }
        };
        NgSelectComponent.prototype.focus = function () {
            this.searchInput.nativeElement.focus();
        };
        NgSelectComponent.prototype.blur = function () {
            this.searchInput.nativeElement.blur();
        };
        NgSelectComponent.prototype.unselect = function (item) {
            if (!item) {
                return;
            }
            this.itemsList.unselect(item);
            this.focus();
            this._updateNgModel();
            this.removeEvent.emit(item);
        };
        NgSelectComponent.prototype.selectTag = function () {
            var _a;
            var _this = this;
            var tag;
            if (isFunction(this.addTag)) {
                tag = this.addTag(this.searchTerm);
            }
            else {
                tag = this._primitive ? this.searchTerm : (_a = {}, _a[this.bindLabel] = this.searchTerm, _a);
            }
            var handleTag = function (item) { return _this._isTypeahead || !_this.isOpen ? _this.itemsList.mapItem(item, null) : _this.itemsList.addItem(item); };
            if (isPromise(tag)) {
                tag.then(function (item) { return _this.select(handleTag(item)); }).catch(function () { });
            }
            else if (tag) {
                this.select(handleTag(tag));
            }
        };
        NgSelectComponent.prototype.showClear = function () {
            return this.clearable && (this.hasValue || this.searchTerm) && !this.disabled;
        };
        Object.defineProperty(NgSelectComponent.prototype, "showAddTag", {
            get: function () {
                if (!this._validTerm) {
                    return false;
                }
                var term = this.searchTerm.toLowerCase().trim();
                return this.addTag &&
                    (!this.itemsList.filteredItems.some(function (x) { return x.label.toLowerCase() === term; }) &&
                        (!this.hideSelected && this.isOpen || !this.selectedItems.some(function (x) { return x.label.toLowerCase() === term; }))) &&
                    !this.loading;
            },
            enumerable: false,
            configurable: true
        });
        NgSelectComponent.prototype.showNoItemsFound = function () {
            var empty = this.itemsList.filteredItems.length === 0;
            return ((empty && !this._isTypeahead && !this.loading) ||
                (empty && this._isTypeahead && this._validTerm && !this.loading)) &&
                !this.showAddTag;
        };
        NgSelectComponent.prototype.showTypeToSearch = function () {
            var empty = this.itemsList.filteredItems.length === 0;
            return empty && this._isTypeahead && !this._validTerm && !this.loading;
        };
        NgSelectComponent.prototype.onCompositionStart = function () {
            this._isComposing = true;
        };
        NgSelectComponent.prototype.onCompositionEnd = function (term) {
            this._isComposing = false;
            if (this.searchWhileComposing) {
                return;
            }
            this.filter(term);
        };
        NgSelectComponent.prototype.filter = function (term) {
            if (this._isComposing && !this.searchWhileComposing) {
                return;
            }
            this.searchTerm = term;
            if (this._isTypeahead && (this._validTerm || this.minTermLength === 0)) {
                this.typeahead.next(term);
            }
            if (!this._isTypeahead) {
                this.itemsList.filter(this.searchTerm);
                if (this.isOpen) {
                    this.itemsList.markSelectedOrDefault(this.markFirst);
                }
            }
            this.searchEvent.emit({ term: term, items: this.itemsList.filteredItems.map(function (x) { return x.value; }) });
            if ((this.minTermLength > 0 && term.length < this.minTermLength) || (this.maxTermLength > 0 && term.length > this.maxTermLength)) {
                this.searchLengthError.emit({ "error": "Min " + this.minTermLength + " Max " + this.maxTermLength + " characters allowed" });
                return;
            }
            this.searchLengthError.emit(false);
            this.open();
        };
        NgSelectComponent.prototype.onInputFocus = function ($event) {
            if (this.focused) {
                return;
            }
            if (this._editableSearchTerm) {
                this._setSearchTermFromItems();
            }
            this.element.classList.add('ng-select-focused');
            this.focusEvent.emit($event);
            this.focused = true;
        };
        NgSelectComponent.prototype.onInputBlur = function ($event) {
            this.element.classList.remove('ng-select-focused');
            this.blurEvent.emit($event);
            if (!this.isOpen && !this.disabled) {
                this._onTouched();
            }
            if (this._editableSearchTerm) {
                this._setSearchTermFromItems();
            }
            this.focused = false;
        };
        NgSelectComponent.prototype.onItemHover = function (item) {
            if (item.disabled) {
                return;
            }
            this.itemsList.markItem(item);
        };
        NgSelectComponent.prototype.detectChanges = function () {
            if (!this._cd.destroyed) {
                this._cd.detectChanges();
            }
        };
        NgSelectComponent.prototype.clearFromX = function () {
            this._clearSearch();
        };
        NgSelectComponent.prototype._setSearchTermFromItems = function () {
            var selected = this.selectedItems && this.selectedItems[0];
            this.searchTerm = (selected && selected.label) || null;
        };
        NgSelectComponent.prototype._setItems = function (items) {
            var firstItem = items[0];
            this.bindLabel = this.bindLabel || this._defaultLabel;
            this._primitive = isDefined(firstItem) ? !isObject(firstItem) : this._primitive || this.bindLabel === this._defaultLabel;
            this.itemsList.setItems(items);
            if (items.length > 0 && this.hasValue) {
                this.itemsList.mapSelectedItems();
            }
            if (this.isOpen && isDefined(this.searchTerm) && !this._isTypeahead) {
                this.itemsList.filter(this.searchTerm);
            }
            if (this._isTypeahead || this.isOpen) {
                this.itemsList.markSelectedOrDefault(this.markFirst);
            }
        };
        NgSelectComponent.prototype._setItemsFromNgOptions = function () {
            var _this = this;
            var mapNgOptions = function (options) {
                _this.items = options.map(function (option) { return ({
                    $ngOptionValue: option.value,
                    $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                    disabled: option.disabled
                }); });
                _this.itemsList.setItems(_this.items);
                if (_this.hasValue) {
                    _this.itemsList.mapSelectedItems();
                }
                _this.detectChanges();
            };
            var handleOptionChange = function () {
                var changedOrDestroyed = rxjs.merge(_this.ngOptions.changes, _this._destroy$);
                rxjs.merge.apply(void 0, __spreadArray([], __read(_this.ngOptions.map(function (option) { return option.stateChange$; })))).pipe(operators.takeUntil(changedOrDestroyed))
                    .subscribe(function (option) {
                    var item = _this.itemsList.findItem(option.value);
                    item.disabled = option.disabled;
                    item.label = option.label || item.label;
                    _this._cd.detectChanges();
                });
            };
            this.ngOptions.changes
                .pipe(operators.startWith(this.ngOptions), operators.takeUntil(this._destroy$))
                .subscribe(function (options) {
                _this.bindLabel = _this._defaultLabel;
                mapNgOptions(options);
                handleOptionChange();
            });
        };
        NgSelectComponent.prototype._isValidWriteValue = function (value) {
            var _this = this;
            if (!isDefined(value) || (this.multiple && value === '') || Array.isArray(value) && value.length === 0) {
                return false;
            }
            var validateBinding = function (item) {
                if (!isDefined(_this.compareWith) && isObject(item) && _this.bindValue) {
                    _this._console.warn("Setting object(" + JSON.stringify(item) + ") as your model with bindValue is not allowed unless [compareWith] is used.");
                    return false;
                }
                return true;
            };
            if (this.multiple) {
                if (!Array.isArray(value)) {
                    this._console.warn('Multiple select ngModel should be array.');
                    return false;
                }
                return value.every(function (item) { return validateBinding(item); });
            }
            else {
                return validateBinding(value);
            }
        };
        NgSelectComponent.prototype._handleWriteValue = function (ngModel) {
            var _this = this;
            if (!this._isValidWriteValue(ngModel)) {
                return;
            }
            var select = function (val) {
                var _a;
                var item = _this.itemsList.findItem(val);
                if (item) {
                    _this.itemsList.select(item);
                }
                else {
                    var isValObject = isObject(val);
                    var isPrimitive = !isValObject && !_this.bindValue;
                    if ((isValObject || isPrimitive)) {
                        _this.itemsList.select(_this.itemsList.mapItem(val, null));
                    }
                    else if (_this.bindValue) {
                        item = (_a = {},
                            _a[_this.bindLabel] = null,
                            _a[_this.bindValue] = val,
                            _a);
                        _this.itemsList.select(_this.itemsList.mapItem(item, null));
                    }
                }
            };
            if (this.multiple) {
                ngModel.forEach(function (item) { return select(item); });
            }
            else {
                select(ngModel);
            }
        };
        NgSelectComponent.prototype._handleKeyPresses = function () {
            var _this = this;
            if (this.searchable) {
                return;
            }
            this._keyPress$
                .pipe(operators.takeUntil(this._destroy$), operators.tap(function (letter) { return _this._pressedKeys.push(letter); }), operators.debounceTime(200), operators.filter(function () { return _this._pressedKeys.length > 0; }), operators.map(function () { return _this._pressedKeys.join(''); }))
                .subscribe(function (term) {
                var item = _this.itemsList.findByLabel(term);
                if (item) {
                    if (_this.isOpen) {
                        _this.itemsList.markItem(item);
                        _this._scrollToMarked();
                        _this._cd.markForCheck();
                    }
                    else {
                        _this.select(item);
                    }
                }
                _this._pressedKeys = [];
            });
        };
        NgSelectComponent.prototype._setInputAttributes = function () {
            var e_1, _a;
            var input = this.searchInput.nativeElement;
            var attributes = Object.assign({ type: 'text', autocorrect: 'off', autocapitalize: 'off', autocomplete: this.labelForId ? 'off' : this.dropdownId }, this.inputAttrs);
            try {
                for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    input.setAttribute(key, attributes[key]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        NgSelectComponent.prototype._updateNgModel = function () {
            var e_2, _a;
            var model = [];
            try {
                for (var _b = __values(this.selectedItems), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var item = _c.value;
                    if (this.bindValue) {
                        var value = null;
                        if (item.children) {
                            var groupKey = this.groupValue ? this.bindValue : this.groupBy;
                            value = item.value[groupKey || this.groupBy];
                        }
                        else {
                            value = this.itemsList.resolveNested(item.value, this.bindValue);
                        }
                        model.push(value);
                    }
                    else {
                        model.push(item.value);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var selected = this.selectedItems.map(function (x) { return x.value; });
            if (this.multiple) {
                this._onChange(model);
                this.changeEvent.emit(selected);
            }
            else {
                this._onChange(isDefined(model[0]) ? model[0] : null);
                this.changeEvent.emit(selected[0]);
            }
            this._cd.markForCheck();
        };
        NgSelectComponent.prototype._clearSearch = function () {
            if (!this.searchTerm) {
                return;
            }
            this.clearTextEvent.emit();
            this._changeSearch(null);
            this.itemsList.resetFilteredItems();
        };
        NgSelectComponent.prototype._changeSearch = function (searchTerm) {
            this.searchTerm = searchTerm;
            if (this._isTypeahead) {
                this.typeahead.next(searchTerm);
            }
        };
        NgSelectComponent.prototype._scrollToMarked = function () {
            if (!this.isOpen || !this.dropdownPanel) {
                return;
            }
            this.dropdownPanel.scrollTo(this.itemsList.markedItem);
        };
        NgSelectComponent.prototype._scrollToTag = function () {
            if (!this.isOpen || !this.dropdownPanel) {
                return;
            }
            this.dropdownPanel.scrollToTag();
        };
        NgSelectComponent.prototype._onSelectionChanged = function () {
            if (this.isOpen && this.multiple && this.appendTo) {
                // Make sure items are rendered.
                this._cd.detectChanges();
                this.dropdownPanel.adjustPosition();
            }
        };
        NgSelectComponent.prototype._handleTab = function ($event) {
            if (this.isOpen === false && !this.addTag) {
                return;
            }
            if (this.selectOnTab) {
                if (this.itemsList.markedItem) {
                    this.toggleItem(this.itemsList.markedItem);
                    $event.preventDefault();
                }
                else if (this.showAddTag) {
                    this.selectTag();
                    $event.preventDefault();
                }
                else {
                    this.close();
                }
            }
            else {
                this.close();
            }
        };
        NgSelectComponent.prototype._handleEnter = function ($event) {
            if (this.isOpen || this._manualOpen) {
                if (this.itemsList.markedItem) {
                    this.toggleItem(this.itemsList.markedItem);
                }
                else if (this.showAddTag) {
                    this.selectTag();
                }
            }
            else if (this.openOnEnter) {
                this.open();
            }
            else {
                return;
            }
            $event.preventDefault();
        };
        NgSelectComponent.prototype._handleSpace = function ($event) {
            if (this.isOpen || this._manualOpen) {
                return;
            }
            this.open();
            $event.preventDefault();
        };
        NgSelectComponent.prototype._handleArrowDown = function ($event) {
            if (this._nextItemIsTag(+1)) {
                this.itemsList.unmarkItem();
                this._scrollToTag();
            }
            else {
                this.itemsList.markNextItem();
                this._scrollToMarked();
            }
            this.open();
            $event.preventDefault();
        };
        NgSelectComponent.prototype._handleArrowUp = function ($event) {
            if (!this.isOpen) {
                return;
            }
            if (this._nextItemIsTag(-1)) {
                this.itemsList.unmarkItem();
                this._scrollToTag();
            }
            else {
                this.itemsList.markPreviousItem();
                this._scrollToMarked();
            }
            $event.preventDefault();
        };
        NgSelectComponent.prototype._nextItemIsTag = function (nextStep) {
            var nextIndex = this.itemsList.markedIndex + nextStep;
            return this.addTag && this.searchTerm
                && this.itemsList.markedItem
                && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length);
        };
        NgSelectComponent.prototype._handleBackspace = function () {
            if (this.searchTerm || !this.clearable || !this.clearOnBackspace || !this.hasValue) {
                return;
            }
            if (this.multiple) {
                this.unselect(this.itemsList.lastSelectedItem);
            }
            else {
                this.clearModel();
            }
        };
        Object.defineProperty(NgSelectComponent.prototype, "_isTypeahead", {
            get: function () {
                return this.typeahead && this.typeahead.observers.length > 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(NgSelectComponent.prototype, "_validTerm", {
            get: function () {
                var term = this.searchTerm && this.searchTerm.trim();
                return term && term.length >= this.minTermLength;
            },
            enumerable: false,
            configurable: true
        });
        NgSelectComponent.prototype._mergeGlobalConfig = function (config) {
            this.placeholder = this.placeholder || config.placeholder;
            this.notFoundText = this.notFoundText || config.notFoundText;
            this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
            this.addTagText = this.addTagText || config.addTagText;
            this.loadingText = this.loadingText || config.loadingText;
            this.clearAllText = this.clearAllText || config.clearAllText;
            this.virtualScroll = isDefined(this.virtualScroll)
                ? this.virtualScroll
                : isDefined(config.disableVirtualScroll) ? !config.disableVirtualScroll : false;
            this.openOnEnter = isDefined(this.openOnEnter) ? this.openOnEnter : config.openOnEnter;
            this.appendTo = this.appendTo || config.appendTo;
            this.bindValue = this.bindValue || config.bindValue;
            this.bindLabel = this.bindLabel || config.bindLabel;
            this.appearance = this.appearance || config.appearance;
        };
        return NgSelectComponent;
    }());
    NgSelectComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'ng-select',
                    template: "<div\n    (mousedown)=\"handleMousedown($event)\"\n    [class.ng-appearance-outline]=\"appearance === 'outline'\"\n    [class.ng-has-value]=\"hasValue\"\n    class=\"ng-select-container\">\n\n    <div class=\"ng-value-container\">\n        <div class=\"ng-placeholder\">{{placeholder}}</div>\n\n        <ng-container *ngIf=\"(!multiLabelTemplate  || !multiple ) && selectedItems.length > 0\">\n            <div [class.ng-value-disabled]=\"item.disabled\" class=\"ng-value\" *ngFor=\"let item of selectedItems; trackBy: trackByOption\">\n                <ng-template #defaultLabelTemplate>\n                    <span class=\"ng-value-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\n                    <span class=\"ng-value-icon right\" (click)=\"unselect(item);\" aria-hidden=\"true\">\u00D7</span>\n                </ng-template>\n\n                <ng-template\n                    [ngTemplateOutlet]=\"labelTemplate || defaultLabelTemplate\"\n                    [ngTemplateOutletContext]=\"{ item: item.value, clear: clearItem, label: item.label }\">\n                </ng-template>\n            </div>\n        </ng-container>\n\n        <ng-template *ngIf=\"multiple && multiLabelTemplate && selectedValues.length > 0\"\n                [ngTemplateOutlet]=\"multiLabelTemplate\"\n                [ngTemplateOutletContext]=\"{ items: selectedValues, clear: clearItem }\">\n        </ng-template>\n\n        <div class=\"ng-input\"\n            role=\"combobox\" \n            [attr.aria-expanded]=\"isOpen\" \n            [attr.aria-owns]=\"isOpen ? dropdownId : null\" \n            aria-haspopup=\"listbox\">\n\n            <input #searchInput\n                   [attr.id]=\"labelForId\"\n                   [attr.tabindex]=\"tabIndex\"\n                   [readOnly]=\"!searchable || itemsList.maxItemsSelected\"\n                   [disabled]=\"disabled\"\n                   [value]=\"searchTerm ? searchTerm : ''\"\n                   (input)=\"filter(searchInput.value)\"\n                   (compositionstart)=\"onCompositionStart()\"\n                   (compositionend)=\"onCompositionEnd(searchInput.value)\"\n                   (focus)=\"onInputFocus($event)\"\n                   (blur)=\"onInputBlur($event)\"\n                   (change)=\"$event.stopPropagation()\"\n                   [attr.aria-activedescendant]=\"isOpen ? itemsList?.markedItem?.htmlId : null\"\n                   aria-autocomplete=\"list\"\n                   [attr.aria-controls]=\"isOpen ? dropdownId : null\">\n        </div>\n    </div>\n\n    <ng-container *ngIf=\"loading\">\n        <ng-template #defaultLoadingSpinnerTemplate>\n            <div class=\"ng-spinner-loader\"></div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingSpinnerTemplate || defaultLoadingSpinnerTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <span *ngIf=\"showClear()\" (click)=\"clearFromX()\" class=\"ng-clear-wrapper\">\n        <span class=\"ng-clear\">\u00D7</span>\n    </span>\n\n    <span class=\"ng-arrow-wrapper\">\n        <span class=\"ng-arrow\"></span>\n    </span>\n</div>\n\n<ng-dropdown-panel *ngIf=\"isOpen\"\n                   class=\"ng-dropdown-panel\"\n                   [virtualScroll]=\"virtualScroll\"\n                   [bufferAmount]=\"bufferAmount\"\n                   [appendTo]=\"appendTo\"\n                   [position]=\"dropdownPosition\"\n                   [headerTemplate]=\"headerTemplate\"\n                   [footerTemplate]=\"footerTemplate\"\n                   [filterValue]=\"searchTerm\"\n                   [items]=\"itemsList.filteredItems\"\n                   [markedItem]=\"itemsList.markedItem\"\n                   (update)=\"viewPortItems = $event\"\n                   (scroll)=\"scroll.emit($event)\"\n                   (scrollToEnd)=\"scrollToEnd.emit($event)\"\n                   (outsideClick)=\"close()\"\n                   [class.ng-select-multiple]=\"multiple\"\n                   [ngClass]=\"appendTo ? classes : null\"\n                   [id]=\"dropdownId\"\n                   role=\"listbox\"\n                   aria-label=\"Options list\">\n\n    <ng-container>\n        <div class=\"ng-option item-option\" [attr.role]=\"item.children ? 'group' : 'option'\" (click)=\"toggleItem(item)\" (mouseover)=\"onItemHover(item)\"\n                *ngFor=\"let item of viewPortItems; trackBy: trackByOption\"\n                [class.ng-option-disabled]=\"item.disabled\"\n                [class.ng-option-selected]=\"item.selected\"\n                [class.ng-optgroup]=\"item.children\"\n                [class.ng-option]=\"!item.children\"\n                [class.ng-option-child]=\"!!item.parent\"\n                [class.ng-option-marked]=\"item === itemsList.markedItem\"\n                [attr.aria-selected]=\"item.selected\"\n                [attr.id]=\"item?.htmlId\">\n\n            <ng-template #defaultOptionTemplate>\n                <span class=\"ng-option-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"item.children ? (optgroupTemplate || defaultOptionTemplate) : (optionTemplate || defaultOptionTemplate)\"\n                [ngTemplateOutletContext]=\"{ item: item.value, item$:item, index: item.index, searchTerm: searchTerm }\">\n            </ng-template>\n        </div>\n\n        <div class=\"ng-option ng-option-add-tag\" [class.ng-option-marked]=\"!itemsList.markedItem\" (mouseover)=\"itemsList.unmarkItem()\" role=\"option\" (click)=\"selectTag()\" *ngIf=\"showAddTag\">\n            <ng-template #defaultTagTemplate>\n                <span><span class=\"ng-tag-label\">{{addTagText}}</span> <span class=\"tag-text-two-point\">:</span> \"{{searchTerm}}\"</span>\n            </ng-template>\n\n            <ng-template\n                [ngTemplateOutlet]=\"tagTemplate || defaultTagTemplate\"\n                [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n            </ng-template>\n        </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"showNoItemsFound()\">\n        <ng-template #defaultNotFoundTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{notFoundText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"notFoundTemplate || defaultNotFoundTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"showTypeToSearch()\">\n        <ng-template #defaultTypeToSearchTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{typeToSearchText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"typeToSearchTemplate || defaultTypeToSearchTemplate\">\n        </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"loading && itemsList.filteredItems.length === 0\">\n        <ng-template #defaultLoadingTextTemplate>\n            <div class=\"ng-option ng-option-disabled\">{{loadingText}}</div>\n        </ng-template>\n\n        <ng-template\n            [ngTemplateOutlet]=\"loadingTextTemplate || defaultLoadingTextTemplate\"\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\n        </ng-template>\n    </ng-container>\n\n</ng-dropdown-panel>\n",
                    providers: [{
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: i0.forwardRef(function () { return NgSelectComponent; }),
                            multi: true
                        }, NgDropdownPanelService],
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.ng-select]': 'useDefaultClass',
                        '[class.ng-select-single]': '!multiple',
                    },
                    styles: [".ng-select{position:relative;display:block}.ng-select,.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{cursor:default;display:flex;outline:none;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none transparent;border:0;box-shadow:none;outline:none;padding:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container,.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border:2px solid rgba(66,66,66,.2);border-left-color:#424242;transform:translateZ(0);-webkit-animation:load8 .8s linear infinite;animation:load8 .8s linear infinite}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@-webkit-keyframes load8{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes load8{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup,.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-option-label:empty:before{content:\"\\200b\"}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:700;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}.ng-dropdown-panel .tag-text-two-point{padding-right:3px}"]
                },] }
    ];
    NgSelectComponent.ctorParameters = function () { return [
        { type: String, decorators: [{ type: i0.Attribute, args: ['class',] }] },
        { type: undefined, decorators: [{ type: i0.Attribute, args: ['autofocus',] }] },
        { type: NgSelectConfig },
        { type: undefined, decorators: [{ type: i0.Inject, args: [SELECTION_MODEL_FACTORY,] }] },
        { type: i0.ElementRef },
        { type: i0.ChangeDetectorRef },
        { type: ConsoleService }
    ]; };
    NgSelectComponent.propDecorators = {
        bindLabel: [{ type: i0.Input }],
        bindValue: [{ type: i0.Input }],
        markFirst: [{ type: i0.Input }],
        placeholder: [{ type: i0.Input }],
        notFoundText: [{ type: i0.Input }],
        typeToSearchText: [{ type: i0.Input }],
        addTagText: [{ type: i0.Input }],
        loadingText: [{ type: i0.Input }],
        clearAllText: [{ type: i0.Input }],
        appearance: [{ type: i0.Input }],
        dropdownPosition: [{ type: i0.Input }],
        appendTo: [{ type: i0.Input }],
        loading: [{ type: i0.Input }],
        closeOnSelect: [{ type: i0.Input }],
        hideSelected: [{ type: i0.Input }],
        selectOnTab: [{ type: i0.Input }],
        openOnEnter: [{ type: i0.Input }],
        maxSelectedItems: [{ type: i0.Input }],
        groupBy: [{ type: i0.Input }],
        groupValue: [{ type: i0.Input }],
        bufferAmount: [{ type: i0.Input }],
        virtualScroll: [{ type: i0.Input }],
        selectableGroup: [{ type: i0.Input }],
        selectableGroupAsModel: [{ type: i0.Input }],
        searchFn: [{ type: i0.Input }],
        trackByFn: [{ type: i0.Input }],
        clearOnBackspace: [{ type: i0.Input }],
        labelForId: [{ type: i0.Input }],
        inputAttrs: [{ type: i0.Input }],
        tabIndex: [{ type: i0.Input }],
        readonly: [{ type: i0.Input }],
        searchWhileComposing: [{ type: i0.Input }],
        minTermLength: [{ type: i0.Input }],
        editableSearchTerm: [{ type: i0.Input }],
        maxTermLength: [{ type: i0.Input }],
        notCloseIfSearching: [{ type: i0.Input }],
        keyDownFn: [{ type: i0.Input }],
        typeahead: [{ type: i0.Input }, { type: i0.HostBinding, args: ['class.ng-select-typeahead',] }],
        multiple: [{ type: i0.Input }, { type: i0.HostBinding, args: ['class.ng-select-multiple',] }],
        addTag: [{ type: i0.Input }, { type: i0.HostBinding, args: ['class.ng-select-taggable',] }],
        searchable: [{ type: i0.Input }, { type: i0.HostBinding, args: ['class.ng-select-searchable',] }],
        clearable: [{ type: i0.Input }, { type: i0.HostBinding, args: ['class.ng-select-clearable',] }],
        isOpen: [{ type: i0.Input }, { type: i0.HostBinding, args: ['class.ng-select-opened',] }],
        items: [{ type: i0.Input }],
        compareWith: [{ type: i0.Input }],
        clearSearchOnAdd: [{ type: i0.Input }],
        blurEvent: [{ type: i0.Output, args: ['blur',] }],
        focusEvent: [{ type: i0.Output, args: ['focus',] }],
        changeEvent: [{ type: i0.Output, args: ['change',] }],
        openEvent: [{ type: i0.Output, args: ['open',] }],
        closeEvent: [{ type: i0.Output, args: ['close',] }],
        searchEvent: [{ type: i0.Output, args: ['search',] }],
        clearEvent: [{ type: i0.Output, args: ['clear',] }],
        addEvent: [{ type: i0.Output, args: ['add',] }],
        removeEvent: [{ type: i0.Output, args: ['remove',] }],
        scroll: [{ type: i0.Output, args: ['scroll',] }],
        scrollToEnd: [{ type: i0.Output, args: ['scrollToEnd',] }],
        searchLengthError: [{ type: i0.Output, args: ['searchLengthError',] }],
        clearTextEvent: [{ type: i0.Output, args: ['clearText',] }],
        optionTemplate: [{ type: i0.ContentChild, args: [NgOptionTemplateDirective, { read: i0.TemplateRef },] }],
        optgroupTemplate: [{ type: i0.ContentChild, args: [NgOptgroupTemplateDirective, { read: i0.TemplateRef },] }],
        labelTemplate: [{ type: i0.ContentChild, args: [NgLabelTemplateDirective, { read: i0.TemplateRef },] }],
        multiLabelTemplate: [{ type: i0.ContentChild, args: [NgMultiLabelTemplateDirective, { read: i0.TemplateRef },] }],
        headerTemplate: [{ type: i0.ContentChild, args: [NgHeaderTemplateDirective, { read: i0.TemplateRef },] }],
        footerTemplate: [{ type: i0.ContentChild, args: [NgFooterTemplateDirective, { read: i0.TemplateRef },] }],
        notFoundTemplate: [{ type: i0.ContentChild, args: [NgNotFoundTemplateDirective, { read: i0.TemplateRef },] }],
        typeToSearchTemplate: [{ type: i0.ContentChild, args: [NgTypeToSearchTemplateDirective, { read: i0.TemplateRef },] }],
        loadingTextTemplate: [{ type: i0.ContentChild, args: [NgLoadingTextTemplateDirective, { read: i0.TemplateRef },] }],
        tagTemplate: [{ type: i0.ContentChild, args: [NgTagTemplateDirective, { read: i0.TemplateRef },] }],
        loadingSpinnerTemplate: [{ type: i0.ContentChild, args: [NgLoadingSpinnerTemplateDirective, { read: i0.TemplateRef },] }],
        dropdownPanel: [{ type: i0.ViewChild, args: [i0.forwardRef(function () { return NgDropdownPanelComponent; }),] }],
        searchInput: [{ type: i0.ViewChild, args: ['searchInput', { static: true },] }],
        ngOptions: [{ type: i0.ContentChildren, args: [NgOptionComponent, { descendants: true },] }],
        disabled: [{ type: i0.HostBinding, args: ['class.ng-select-disabled',] }],
        filtered: [{ type: i0.HostBinding, args: ['class.ng-select-filtered',] }],
        handleKeyDown: [{ type: i0.HostListener, args: ['keydown', ['$event'],] }]
    };

    function DefaultSelectionModelFactory() {
        return new DefaultSelectionModel();
    }
    var DefaultSelectionModel = /** @class */ (function () {
        function DefaultSelectionModel() {
            this._selected = [];
        }
        Object.defineProperty(DefaultSelectionModel.prototype, "value", {
            get: function () {
                return this._selected;
            },
            enumerable: false,
            configurable: true
        });
        DefaultSelectionModel.prototype.select = function (item, multiple, groupAsModel) {
            item.selected = true;
            if (!item.children || (!multiple && groupAsModel)) {
                this._selected.push(item);
            }
            if (multiple) {
                if (item.parent) {
                    var childrenCount = item.parent.children.length;
                    var selectedCount = item.parent.children.filter(function (x) { return x.selected; }).length;
                    item.parent.selected = childrenCount === selectedCount;
                }
                else if (item.children) {
                    this._setChildrenSelectedState(item.children, true);
                    this._removeChildren(item);
                    if (groupAsModel && this._activeChildren(item)) {
                        this._selected = __spreadArray(__spreadArray([], __read(this._selected.filter(function (x) { return x.parent !== item; }))), [item]);
                    }
                    else {
                        this._selected = __spreadArray(__spreadArray([], __read(this._selected)), __read(item.children.filter(function (x) { return !x.disabled; })));
                    }
                }
            }
        };
        DefaultSelectionModel.prototype.unselect = function (item, multiple) {
            var _a;
            this._selected = this._selected.filter(function (x) { return x !== item; });
            item.selected = false;
            if (multiple) {
                if (item.parent && item.parent.selected) {
                    var children = item.parent.children;
                    this._removeParent(item.parent);
                    this._removeChildren(item.parent);
                    (_a = this._selected).push.apply(_a, __spreadArray([], __read(children.filter(function (x) { return x !== item && !x.disabled; }))));
                    item.parent.selected = false;
                }
                else if (item.children) {
                    this._setChildrenSelectedState(item.children, false);
                    this._removeChildren(item);
                }
            }
        };
        DefaultSelectionModel.prototype.clear = function (keepDisabled) {
            this._selected = keepDisabled ? this._selected.filter(function (x) { return x.disabled; }) : [];
        };
        DefaultSelectionModel.prototype._setChildrenSelectedState = function (children, selected) {
            var e_1, _a;
            try {
                for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                    var child = children_1_1.value;
                    if (child.disabled) {
                        continue;
                    }
                    child.selected = selected;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            ;
        };
        DefaultSelectionModel.prototype._removeChildren = function (parent) {
            this._selected = __spreadArray(__spreadArray([], __read(this._selected.filter(function (x) { return x.parent !== parent; }))), __read(parent.children.filter(function (x) { return x.parent === parent && x.disabled && x.selected; })));
        };
        DefaultSelectionModel.prototype._removeParent = function (parent) {
            this._selected = this._selected.filter(function (x) { return x !== parent; });
        };
        DefaultSelectionModel.prototype._activeChildren = function (item) {
            return item.children.every(function (x) { return !x.disabled || x.selected; });
        };
        return DefaultSelectionModel;
    }());

    var ɵ0 = DefaultSelectionModelFactory;
    var NgSelectModule = /** @class */ (function () {
        function NgSelectModule() {
        }
        return NgSelectModule;
    }());
    NgSelectModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [
                        NgDropdownPanelComponent,
                        NgOptionComponent,
                        NgSelectComponent,
                        NgOptgroupTemplateDirective,
                        NgOptionTemplateDirective,
                        NgLabelTemplateDirective,
                        NgMultiLabelTemplateDirective,
                        NgHeaderTemplateDirective,
                        NgFooterTemplateDirective,
                        NgNotFoundTemplateDirective,
                        NgTypeToSearchTemplateDirective,
                        NgLoadingTextTemplateDirective,
                        NgTagTemplateDirective,
                        NgLoadingSpinnerTemplateDirective,
                        NgItemLabelDirective
                    ],
                    imports: [
                        common.CommonModule
                    ],
                    exports: [
                        NgSelectComponent,
                        NgOptionComponent,
                        NgOptgroupTemplateDirective,
                        NgOptionTemplateDirective,
                        NgLabelTemplateDirective,
                        NgMultiLabelTemplateDirective,
                        NgHeaderTemplateDirective,
                        NgFooterTemplateDirective,
                        NgNotFoundTemplateDirective,
                        NgTypeToSearchTemplateDirective,
                        NgLoadingTextTemplateDirective,
                        NgTagTemplateDirective,
                        NgLoadingSpinnerTemplateDirective
                    ],
                    providers: [
                        { provide: SELECTION_MODEL_FACTORY, useValue: ɵ0 }
                    ]
                },] }
    ];

    /*
     * Public API Surface of ng-select
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgSelectComponent = NgSelectComponent;
    exports.NgSelectConfig = NgSelectConfig;
    exports.NgSelectModule = NgSelectModule;
    exports.SELECTION_MODEL_FACTORY = SELECTION_MODEL_FACTORY;
    exports.ɵb = DefaultSelectionModelFactory;
    exports.ɵc = DefaultSelectionModel;
    exports.ɵd = NgDropdownPanelService;
    exports.ɵe = NgItemLabelDirective;
    exports.ɵf = NgOptionTemplateDirective;
    exports.ɵg = NgOptgroupTemplateDirective;
    exports.ɵh = NgLabelTemplateDirective;
    exports.ɵi = NgMultiLabelTemplateDirective;
    exports.ɵj = NgHeaderTemplateDirective;
    exports.ɵk = NgFooterTemplateDirective;
    exports.ɵl = NgNotFoundTemplateDirective;
    exports.ɵm = NgTypeToSearchTemplateDirective;
    exports.ɵn = NgLoadingTextTemplateDirective;
    exports.ɵo = NgTagTemplateDirective;
    exports.ɵp = NgLoadingSpinnerTemplateDirective;
    exports.ɵq = NgDropdownPanelComponent;
    exports.ɵr = NgOptionComponent;
    exports.ɵs = ConsoleService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng-select-ng-select.umd.js.map
