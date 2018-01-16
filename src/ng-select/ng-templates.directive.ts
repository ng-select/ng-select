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

@Directive({ selector: '[ng-header-tmp]' })
export class NgHeaderTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({ selector: '[ng-footer-tmp]' })
export class NgFooterTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
