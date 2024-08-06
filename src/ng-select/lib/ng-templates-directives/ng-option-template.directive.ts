import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-option-tmp]',
    standalone: true,
})
export class NgOptionTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
