const unescapedHTMLExp = /[&<>"']/g;
const hasUnescapedHTMLExp = RegExp(unescapedHTMLExp.source);
const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;'
};

export function escapeHTML(string: string) {
    return (string && hasUnescapedHTMLExp.test(string)) ?
        string.replace(unescapedHTMLExp, chr => htmlEscapes[chr]) :
        string;
}

export function isDefined(value: any) {
    return value !== undefined && value !== null;
}

export function isObject(value: any) {
    return typeof value === 'object' && isDefined(value);
}

export function isPromise(value: any) {
    return value instanceof Promise;
}

export function isFunction(value: any) {
    return value instanceof Function;
}
