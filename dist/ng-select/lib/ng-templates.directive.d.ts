import { ElementRef, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
export declare class NgItemLabelDirective implements OnChanges {
    private element;
    ngItemLabel: string;
    escape: boolean;
    constructor(element: ElementRef<HTMLElement>);
    ngOnChanges(changes: SimpleChanges): void;
}
export declare class NgOptionTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgOptgroupTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgLabelTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgMultiLabelTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgHeaderTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgFooterTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgNotFoundTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgTypeToSearchTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgLoadingTextTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgTagTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
export declare class NgLoadingSpinnerTemplateDirective {
    template: TemplateRef<any>;
    constructor(template: TemplateRef<any>);
}
