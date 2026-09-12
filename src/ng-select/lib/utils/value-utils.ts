/**
 * Determines whether a value is neither `undefined` nor `null`.
 *
 * @param value - The value to process.
 *
 * @since 3.0.0
 */
export function isDefined(value: any) {
	return value !== undefined && value !== null;
}

/**
 * Determines whether a value is a non-null object.
 *
 * @param value - The value to process.
 *
 * @since 3.0.0
 */
export function isObject(value: any) {
	return typeof value === 'object' && isDefined(value);
}

/**
 * Determines whether a value is promise-like.
 *
 * @param value - The value to process.
 *
 * @since 3.0.0
 */
export function isPromise(value: any) {
	return value instanceof Promise;
}

/**
 * Determines whether a value is a function.
 *
 * @param value - The value to process.
 *
 * @since 3.0.0
 */
export function isFunction(value: any) {
	return value instanceof Function;
}
