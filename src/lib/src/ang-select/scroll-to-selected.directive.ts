import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
    selector: '[scrollToSelected]'
})
export class ScrollToSelectedDirective implements AfterViewInit {

    constructor(private elementRef: ElementRef) { };

    ngAfterViewInit(): void {
        const dropdownContainer = <HTMLElement>this.elementRef.nativeElement;
        const selectedOption = this.getSelectedOption(dropdownContainer);
        if (selectedOption) {
            const offset = selectedOption.offsetTop;
            dropdownContainer.scrollTop = offset;
        }
    }

    private getSelectedOption(container: HTMLElement): HTMLElement {
        return <HTMLElement>container.querySelector('.ang-option.selected');
    }
}
