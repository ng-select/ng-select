import { Directive, effect, ElementRef, inject, input, TemplateRef } from '@angular/core';
import { escapeHTML } from './value-utils';

@Directive({
	selector: '[ngItemLabel]',
	standalone: true,
})
export class NgItemLabelDirective {
	private element = inject<ElementRef<HTMLElement>>(ElementRef);

	ngItemLabel = input<string>();
	escape = input(true);

	constructor() {
		effect(() => {
			this.element.nativeElement.innerHTML = this.escape()
				? escapeHTML(this.ngItemLabel())
				: this.ngItemLabel();
		})
	}
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-option-tmp]',
	standalone: true,
})
export class NgOptionTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-optgroup-tmp]',
	standalone: true,
})
export class NgOptgroupTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-label-tmp]',
	standalone: true,
})
export class NgLabelTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-multi-label-tmp]',
	standalone: true,
})
export class NgMultiLabelTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-header-tmp]',
	standalone: true,
})
export class NgHeaderTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-footer-tmp]',
	standalone: true,
})
export class NgFooterTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-notfound-tmp]',
	standalone: true,
})
export class NgNotFoundTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-placeholder-tmp]',
	standalone: true,
})
export class NgPlaceholderTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-typetosearch-tmp]',
	standalone: true,
})
export class NgTypeToSearchTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-loadingtext-tmp]',
	standalone: true,
})
export class NgLoadingTextTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-tag-tmp]',
	standalone: true,
})
export class NgTagTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ng-loadingspinner-tmp]',
	standalone: true,
})
export class NgLoadingSpinnerTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-clearbutton-tmp]', standalone: true })
export class NgClearButtonTemplateDirective {
	public readonly template = inject(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-collapse-button-tmp]', standalone: true })
export class NgCollapseButtonTemplateDirective {
	public readonly template = inject(TemplateRef<any>)
}
