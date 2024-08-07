import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-loadingspinner-tmp]',
    standalone: true,
})
export class NgLoadingSpinnerTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
