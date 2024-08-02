import { Directive, ElementRef, inject, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { escapeHTML } from './value-utils';

@Directive({ selector: '[ngItemLabel]' })
export class NgItemLabelDirective implements OnChanges {
	@Input() ngItemLabel: string;
	@Input() escape = true;
	private element = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

	ngOnChanges(changes: SimpleChanges) {
		this.element.nativeElement.innerHTML = this.escape ? escapeHTML(this.ngItemLabel) : this.ngItemLabel;
	}
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-option-tmp]' })
export class NgOptionTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-optgroup-tmp]' })
export class NgOptgroupTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-label-tmp]' })
export class NgLabelTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-multi-label-tmp]' })
export class NgMultiLabelTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-header-tmp]' })
export class NgHeaderTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-footer-tmp]' })
export class NgFooterTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-notfound-tmp]' })
export class NgNotFoundTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-typetosearch-tmp]' })
export class NgTypeToSearchTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-loadingtext-tmp]' })
export class NgLoadingTextTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-tag-tmp]' })
export class NgTagTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[ng-loadingspinner-tmp]' })
export class NgLoadingSpinnerTemplateDirective {
	public template = inject<TemplateRef<any>>(TemplateRef<any>);
}
