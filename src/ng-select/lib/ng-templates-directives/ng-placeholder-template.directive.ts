import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[ng-placeholder-tmp]',
    standalone: true,
})
export class NgPlaceholderTemplateDirective {
    public readonly template: TemplateRef<any> = inject(TemplateRef);
}
