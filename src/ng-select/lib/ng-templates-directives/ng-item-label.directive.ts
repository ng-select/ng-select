import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from "@angular/core";
import {escapeHTML} from "../value-utils";

@Directive({
    selector: '[ngItemLabel]',
    standalone: true,
})
export class NgItemLabelDirective implements OnChanges {
    @Input() ngItemLabel: string;
    @Input() escape = true;

    constructor(private element: ElementRef<HTMLElement>) {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.element.nativeElement.innerHTML = this.escape ?
            escapeHTML(this.ngItemLabel) :
            this.ngItemLabel;
    }
}
