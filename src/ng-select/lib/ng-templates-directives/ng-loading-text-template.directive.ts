import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-loadingtext-tmp]',
    standalone: true,
})
export class NgLoadingTextTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
