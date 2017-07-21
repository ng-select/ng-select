import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[angSearchFocus]'
})
export class AngSearchFocusDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { };

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
