import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-footer-tmp]',
    standalone: true,
})
export class NgFooterTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}
