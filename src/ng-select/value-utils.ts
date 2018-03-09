export function isDefined(value: any) {
    return value !== null && value !== undefined;
}

export function isObject(value: any) {
    return isDefined(value) && typeof value === 'object'
}

export function isPromise(value: any) {
    return value instanceof Promise;
}

export function isFunction(value: any) {
    return value instanceof Function;
}
