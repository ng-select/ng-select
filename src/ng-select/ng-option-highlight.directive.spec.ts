import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive';
import { By } from '@angular/platform-browser';

@Component({
    template: `
        <span id="test1" [innerHtml]="'My text is highlighted'" [ngOptionHighlight]="term"></span>
        <span id="test2" [innerHtml]="'My text is not highlighted'" [ngOptionHighlight]="term"></span>
    `
})
class TestComponent {
    term: string;
}

describe('NgOptionHighlightDirective', () => {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [NgOptionHighlightDirective, TestComponent]
        }).createComponent(TestComponent);

        fixture.detectChanges();
    });

    it('should have two elements with highlight directive', () => {
        const highlightDirectives = fixture.debugElement.queryAll(By.directive(NgOptionHighlightDirective));
        expect(highlightDirectives.length).toBe(2);
    });

    it('should have one element with highlighted text when term matching', () => {
        const span = fixture.debugElement.query(By.css('#test1'));
        fixture.componentInstance.term = 'is high';
        fixture.detectChanges();
        expect(span.nativeElement.querySelector('.highlighted').innerHTML).toBe('is high');
        expect(span.nativeElement.textContent).toBe('My text is highlighted');
    });

    it('should have one element with no highlighted text when term not matching', () => {
        const span = fixture.debugElement.query(By.css('#test2'));
        fixture.componentInstance.term = 'non matching';
        fixture.detectChanges();
        expect(span.nativeElement.querySelector('.highlighted')).toBeNull();
        expect(span.nativeElement.innerHTML).toBe('My text is not highlighted');
    });
});
