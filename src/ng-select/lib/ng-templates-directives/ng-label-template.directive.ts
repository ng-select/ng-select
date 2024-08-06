import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-label-tmp]',
    standalone: true,
})
export class NgLabelTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
