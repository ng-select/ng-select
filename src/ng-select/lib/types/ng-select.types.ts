/**
 * Defines the ng option contract used by ng-select.
 *
 * @since 3.0.0
 */
export interface NgOption {
	[name: string]: any;

	index?: number;
	htmlId?: string;
	selected?: boolean;
	disabled?: boolean;
	marked?: boolean;
	label?: string;
	value?: string | any;
	classes?: string;
	parent?: NgOption;
	children?: NgOption[];
}

export enum KeyCode {
	Tab = 'Tab',
	Enter = 'Enter',
	Esc = 'Escape',
	Space = ' ',
	ArrowUp = 'ArrowUp',
	ArrowDown = 'ArrowDown',
	Backspace = 'Backspace',
}

export type DropdownPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';
