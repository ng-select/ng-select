import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-tag-tmp]',
    standalone: true,
})
export class NgTagTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
