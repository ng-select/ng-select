import { Injectable, signal } from '@angular/core';
import { NgOptionComponent } from './ng-option.component';

/**
 * Service to manage registration of NgOptionComponent instances.
 * This allows ng-option components to be detected even when they are
 * rendered through ngTemplateOutlet or other dynamic content scenarios.
 */
@Injectable({
	providedIn: 'root'
})
export class NgOptionRegistry {
	private readonly _options = signal<Set<NgOptionComponent>>(new Set());

	/**
	 * Signal containing all registered ng-option components
	 */
	public readonly options = this._options.asReadonly();

	/**
	 * Register an ng-option component
	 */
	public register(option: NgOptionComponent): void {
		this._options.update(options => {
			const newOptions = new Set(options);
			newOptions.add(option);
			return newOptions;
		});
	}

	/**
	 * Unregister an ng-option component
	 */
	public unregister(option: NgOptionComponent): void {
		this._options.update(options => {
			const newOptions = new Set(options);
			newOptions.delete(option);
			return newOptions;
		});
	}

	/**
	 * Get all registered options as an array
	 */
	public getOptions(): NgOptionComponent[] {
		return Array.from(this._options());
	}

	/**
	 * Filter registered options that belong to a specific parent element
	 */
	public getOptionsForParent(parentElement: HTMLElement): NgOptionComponent[] {
		return this.getOptions().filter(option => 
			parentElement.contains(option.elementRef.nativeElement)
		);
	}
}