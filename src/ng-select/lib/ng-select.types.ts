export interface NgOption {
	[name: string]: any;

	index?: number;
	htmlId?: string;
	selected?: boolean;
	disabled?: boolean;
	marked?: boolean;
	label?: string;
	value?: string | any;
	parent?: NgOption;
	children?: NgOption[];
}

export enum KeyCode {
  ArrowUp = 38,
  ArrowDown = 40,
  ArrowLeft = 37,
  ArrowRight = 39,
  Backspace = 8,
  Delete = 46,
  Enter = 13,
  Esc = 27,
  End = 35,
  Home = 36,
  Space = 32,
  Tab = 9
}

export type DropdownPosition = 'top' | 'right' | 'bottom' | 'left' | 'auto';
