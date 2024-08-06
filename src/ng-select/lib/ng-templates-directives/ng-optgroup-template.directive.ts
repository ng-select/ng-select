import {Directive, TemplateRef} from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-optgroup-tmp]',
    standalone: true,
})
export class NgOptgroupTemplateDirective {
    constructor(public template: TemplateRef<any>) {
    }
}
