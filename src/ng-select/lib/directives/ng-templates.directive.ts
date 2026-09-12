import { Directive, effect, ElementRef, inject, input, TemplateRef } from '@angular/core';

/**
 * @deprecated Default labels are plain text via interpolation. Prefer `{{ label }}` or
 * custom templates (`ng-label-tmp` / `ng-option-tmp`) for rich markup. Kept for public API
 * compatibility; always writes `textContent` (the `escape` input is ignored).
 *
 * @since 3.0.2
 */
@Directive({
	selector: '[ngItemLabel]',
	standalone: true,
})
export class NgItemLabelDirective {
	private element = inject<ElementRef<HTMLElement>>(ElementRef);

	ngItemLabel = input<string>();
	/** @deprecated Ignored — labels are always written as text. */
	escape = input(true);

	/**
	 * Creates an instance of NgItemLabelDirective.
	 *
	 * @since 3.0.2
	 */
	constructor() {
		effect(() => {
			this.element.nativeElement.textContent = this.ngItemLabel() ?? '';
		});
	}
}

/**
 * Marks a template as the custom option template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-option-tmp]',
	standalone: true,
})
export class NgOptionTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom optgroup template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-optgroup-tmp]',
	standalone: true,
})
export class NgOptgroupTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom label template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-label-tmp]',
	standalone: true,
})
export class NgLabelTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom multi label template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-multi-label-tmp]',
	standalone: true,
})
export class NgMultiLabelTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom header template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-header-tmp]',
	standalone: true,
})
export class NgHeaderTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom footer template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-footer-tmp]',
	standalone: true,
})
export class NgFooterTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom not found template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-notfound-tmp]',
	standalone: true,
})
export class NgNotFoundTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom placeholder template for ng-select.
 *
 * @since 13.6.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-placeholder-tmp]',
	standalone: true,
})
export class NgPlaceholderTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom type to search template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-typetosearch-tmp]',
	standalone: true,
})
export class NgTypeToSearchTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom loading text template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-loadingtext-tmp]',
	standalone: true,
})
export class NgLoadingTextTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom tag template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-tag-tmp]',
	standalone: true,
})
export class NgTagTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom loading spinner template for ng-select.
 *
 * @since 3.0.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-loadingspinner-tmp]',
	standalone: true,
})
export class NgLoadingSpinnerTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

/**
 * Marks a template as the custom clear button template for ng-select.
 *
 * @since 14.2.0
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-clearbutton-tmp]',
	standalone: true,
})
export class NgClearButtonTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}
