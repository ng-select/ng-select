import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ang-option-tmp]' })
export class AngOptionDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Directive({ selector: '[ang-display-tmp]' })
export class AngDisplayDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
