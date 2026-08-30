import { NgOption } from '../types/ng-select.types';
import { isDefined, isObject } from '../utils/value-utils';

/**
 * Describes the bindings that affect conversion between selected options and model values.
 *
 * @since 24.0.5
 */
export interface ModelBindingOptions {
	bindLabel: string;
	bindValue: string | null | undefined;
	compareWith: ((a: any, b: any) => boolean) | null | undefined;
	groupBy: string | ((value: any) => any) | null | undefined;
	hasGroupValue: boolean;
	multiple: boolean;
}

/**
 * Represents the result of validating a value supplied through ControlValueAccessor.
 *
 * @since 24.0.5
 */
export interface ModelValidationResult {
	valid: boolean;
	warning?: string;
}

/**
 * Validates a model value against the select's multiple-selection and value-binding configuration.
 *
 * @param value - The model value supplied to the select.
 * @param options - The binding options used to validate the value.
 * @returns The validation result and an optional warning for invalid bindings.
 *
 * @since 24.0.5
 */
export function validateWriteValue(value: any, options: Pick<ModelBindingOptions, 'bindValue' | 'compareWith' | 'multiple'>): ModelValidationResult {
	if (!isDefined(value) || (options.multiple && value === '') || (Array.isArray(value) && value.length === 0)) {
		return { valid: false };
	}

	if (options.multiple && !Array.isArray(value)) {
		return { valid: false, warning: 'Multiple select ngModel should be array.' };
	}

	const values = options.multiple ? value : [value];
	const invalidBinding = values.find((item: any) => !isDefined(options.compareWith) && isObject(item) && options.bindValue);
	if (invalidBinding) {
		return {
			valid: false,
			warning: `Setting object(${JSON.stringify(invalidBinding)}) as your model with bindValue is not allowed unless [compareWith] is used.`,
		};
	}

	return { valid: true };
}

/**
 * Creates an option value for a model value that does not match an existing item.
 *
 * @param value - The unmatched model value.
 * @param bindLabel - The property used as the option label.
 * @param bindValue - The property used as the bound model value.
 * @returns The value in the shape expected by the items list.
 *
 * @since 24.0.5
 */
export function createUnmatchedOptionValue(value: any, bindLabel: string, bindValue: string | null | undefined): any {
	if (isObject(value) || !bindValue) {
		return value;
	}
	return {
		[bindLabel]: null,
		[bindValue]: value,
	};
}

/**
 * Converts selected options into the values emitted through the component model.
 *
 * @param selectedItems - The currently selected options.
 * @param options - The bindings that determine how option values are mapped.
 * @param resolveNested - Resolves a nested property from an option value.
 * @returns The model values corresponding to the selected options.
 *
 * @since 24.0.5
 */
export function selectedItemsToModel(
	selectedItems: readonly NgOption[],
	options: Pick<ModelBindingOptions, 'bindValue' | 'groupBy' | 'hasGroupValue'>,
	resolveNested: (option: any, key: string) => any,
): any[] {
	return selectedItems.map((item) => {
		if (!options.bindValue) {
			return item.value;
		}
		if (item.children) {
			const groupKey = options.hasGroupValue ? options.bindValue : (options.groupBy as string);
			return item.value[groupKey || (options.groupBy as string)];
		}
		return resolveNested(item.value, options.bindValue);
	});
}
