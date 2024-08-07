import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-typetosearch-tmp]',
    standalone: true,
})
export class NgTypeToSearchTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
