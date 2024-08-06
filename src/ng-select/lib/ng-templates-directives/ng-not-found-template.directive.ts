import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-notfound-tmp]',
    standalone: true,
})
export class NgNotFoundTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
