import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgOptionHighlightDirective} from './ng-option-highlight.directive';
import {By} from '@angular/platform-browser';

@Component({
    template: `
        <span id="test1" [innerHTML]="'My text is highlighted'" [ngOptionHighlight]="'is high'"></span>
        <span id="test2" [innerHTML]="'My text is not highlighted'" [ngOptionHighlight]="'test'"></span>
        <span id="test3" [innerHTML]="'My text is rich'"></span>
    `
})
class TestComponent {
}

describe('NgOptionHighlightDirective', function () {

    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [NgOptionHighlightDirective, TestComponent]
        })
            .createComponent(TestComponent);

        fixture.detectChanges();
});

    it('should have two elements with highlight directive', () => {
        let highlightDirectives = fixture.debugElement.queryAll(By.directive(NgOptionHighlightDirective));
        expect(highlightDirectives.length).toBe(2);
    });

    it('should have one element with highlighted text when term matching', () => {
        let span1 = fixture.debugElement.query(By.css('#test1'));
        expect(span1.nativeElement.querySelector('.highlighted').innerHTML).toBe('is high');
        expect(span1.nativeElement.textContent).toBe('My text is highlighted');
    });

    it('should have one element with no highlighted text when term not matching', () => {
        let span2 = fixture.debugElement.query(By.css('#test2'));
        expect(span2.nativeElement.querySelector('.highlighted')).toBeNull();
        expect(span2.nativeElement.innerHTML).toBe('My text is not highlighted');
    });

    it('should have one element with no highlighted text when no highlight directive', () => {
        let span3 = fixture.debugElement.query(By.css('#test3'));
        expect(span3.nativeElement.querySelector('.highlighted')).toBeNull();
        expect(span3.nativeElement.innerHTML).toBe('My text is rich');
    });
});
