import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-multi-label-tmp]',
    standalone: true,
})
export class NgMultiLabelTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}
