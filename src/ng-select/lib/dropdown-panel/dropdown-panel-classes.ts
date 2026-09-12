/**
 * Represents the class value formats accepted by ng-select and Angular's NgClass directive.
 *
 * @since 24.0.5
 */
export type ClassValue = string | string[] | Set<string> | Record<string, any>;

const INTERNAL_HOST_CLASSES = new Set([
	'ng-select',
	'ng-select-single',
	'ng-select-multiple',
	'ng-select-typeahead',
	'ng-select-taggable',
	'ng-select-searchable',
	'ng-select-clearable',
	'ng-select-opened',
	'ng-select-filtered',
	'ng-select-disabled',
	'ng-select-focused',
	'ng-select-top',
	'ng-select-bottom',
	'ng-select-left',
	'ng-select-right',
]);

const ANGULAR_MANAGED_HOST_CLASSES = new Set([
	'ng-star-inserted',
	'ng-untouched',
	'ng-touched',
	'ng-pristine',
	'ng-dirty',
	'ng-valid',
	'ng-invalid',
	'ng-pending',
	'ng-submitted',
]);

/**
 * Reads consumer-provided classes from the ng-select host while excluding internal Angular and component state classes.
 *
 * @param element - The ng-select host element.
 * @returns A space-separated list of consumer-provided classes.
 *
 * @since 24.0.5
 */
export function readConsumerHostClasses(element: HTMLElement): string {
	return Array.from(element.classList)
		.filter((className) => !INTERNAL_HOST_CLASSES.has(className) && !ANGULAR_MANAGED_HOST_CLASSES.has(className))
		.join(' ');
}

/**
 * Normalizes and merges supported class value formats into a unique class string.
 *
 * @param values - Class values to normalize and merge.
 * @returns A space-separated list of unique class names.
 *
 * @since 24.0.5
 */
export function mergeClassValues(...values: readonly (ClassValue | null | undefined)[]): string {
	const classes = new Set<string>();
	for (const value of values) {
		collectClasses(classes, value);
	}
	return Array.from(classes).join(' ');
}

/**
 * Adds normalized class values to the target set.
 *
 * @param target - The target.
 * @param value - The value to process.
 *
 * @since 24.0.5
 */
function collectClasses(target: Set<string>, value: ClassValue | null | undefined): void {
	if (!value) {
		return;
	}

	if (typeof value === 'string') {
		collectClassString(target, value);
		return;
	}

	if (Array.isArray(value) || value instanceof Set) {
		for (const className of value) {
			collectClassString(target, className);
		}
		return;
	}

	for (const [classNames, enabled] of Object.entries(value)) {
		if (enabled) {
			collectClassString(target, classNames);
		}
	}
}

/**
 * Splits a class string and adds its non-empty names to the target set.
 *
 * @param target - The target.
 * @param value - The value to process.
 *
 * @since 24.0.5
 */
function collectClassString(target: Set<string>, value: string): void {
	for (const className of value.split(/\s+/)) {
		if (className) {
			target.add(className);
		}
	}
}
