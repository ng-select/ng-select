import { DropdownPosition } from './ng-select.types';

/**
 * Interface defining the contract that ItemsList expects from a select component.
 * This allows both NgSelectComponent and NgSelectCdkComponent to work with ItemsList.
 */
export interface NgSelectBaseComponent {
	hideSelected(): boolean;
	multiple(): boolean;
	maxSelectedItems(): number;
	groupBy(): string | ((value: any) => any);
	selectableGroupAsModel(): boolean;
	compareWith(): any;
	bindValue(): string;
	bindLabel(): string;
	searchFn(): any;
	selectableGroup(): boolean;
	groupValue(): any;
	dropdownId: string;
}