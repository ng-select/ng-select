import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[ng-option-tmp]' })
export class NgOptionTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-optgroup-tmp]' })
export class NgOptgroupTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-label-tmp]' })
export class NgLabelTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-multi-label-tmp]' })
export class NgMultiLabelTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-header-tmp]' })
export class NgHeaderTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-footer-tmp]' })
export class NgFooterTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-notfound-tmp]' })
export class NgNotFoundTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-typetosearch-tmp]' })
export class NgTypeToSearchTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-loadingtext-tmp]' })
export class NgLoadingTextTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-tag-tmp]' })
export class NgTagTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}

@Directive({ selector: '[ng-loadingspinner-tmp]' })
export class NgLoadingSpinnerTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}
