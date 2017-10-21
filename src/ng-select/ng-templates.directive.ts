import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ng-option-tmp]' })
export class NgOptionTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({ selector: '[ng-label-tmp]' })
export class NgLabelTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
