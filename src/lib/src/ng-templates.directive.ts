import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ng-option-tmp]' })
export class NgOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({ selector: '[ng-display-tmp]' })
export class NgDisplayDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
