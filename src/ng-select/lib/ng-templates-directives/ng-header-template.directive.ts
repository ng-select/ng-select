import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-header-tmp]',
    standalone: true,
})
export class NgHeaderTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
