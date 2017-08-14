import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[angSearchFocus]'
})
export class AngSearchFocusDirective implements OnInit {

  constructor(private elementRef: ElementRef) { };

  ngOnInit(): void {
    this.elementRef.nativeElement.onFocus();
  }
}
