import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive';

@Component({
	template: `
		<span id="test1" [ngOptionHighlight]="term">My text is highlighted</span>
		<span id="test2" [ngOptionHighlight]="term">My text is not highlighted</span>
		<span id="test3" [ngOptionHighlight]="term">Multiple text is highlighted</span>
		<span id="test4" [ngOptionHighlight]="term">My ťëxť is highlighted text</span>
		@if (showNew) {
			<span id="test5" [ngOptionHighlight]="term">New label</span>
		}
		<span id="test6" [ngOptionHighlight]="term">+My text is) high\\lighted</span>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgOptionHighlightDirective],
})
class TestComponent {
	term: string;
	showNew = false;
}

@Component({
	template: `
		<span id="bound-label" [ngOptionHighlight]="term">{{ label }}</span>
		<span id="nested-label" [ngOptionHighlight]="term"
			><b>{{ label }}</b></span
		>
		@for (item of items; track $index) {
			<span class="filtered-option" [ngOptionHighlight]="term">{{ item.name }}</span>
		}
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [NgOptionHighlightDirective],
})
class RecycledLabelTestComponent {
	term: string;
	label = 'Apple';
	items = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Cherry' }];
}

/**
 * Zone/zoneless parity shim (same as ng-select's testing/helpers.ts): in a zoneless
 * TestBed, fixture.detectChanges() only renders views Angular knows are dirty, so plain
 * test-property mutations would be skipped by the render pass and then flagged NG0100 by
 * the checkNoChanges pass (angular/angular#59082). Marking the root view dirty first
 * restores identical semantics in both lanes.
 */
function applyZonelessFixtureCompat<T>(fixture: ComponentFixture<T>): ComponentFixture<T> {
	const originalDetectChanges = fixture.detectChanges.bind(fixture);
	fixture.detectChanges = (checkNoChanges?: boolean) => {
		fixture.changeDetectorRef.markForCheck();
		originalDetectChanges(checkNoChanges);
	};
	return fixture;
}

async function flushAsync(): Promise<void> {
	await new Promise<void>((resolve) => queueMicrotask(resolve));
	await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe('NgOptionHighlightDirective', () => {
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		fixture = applyZonelessFixtureCompat(
			TestBed.configureTestingModule({
				imports: [TestComponent],
			}).createComponent(TestComponent),
		);

		fixture.detectChanges();
	});

	it('should have five elements with highlight directive', () => {
		const highlightDirectives = fixture.debugElement.queryAll(By.directive(NgOptionHighlightDirective));
		expect(highlightDirectives.length).toBe(5);
	});

	it('should have one element with highlighted text when term matching', () => {
		const span = fixture.debugElement.query(By.css('#test1'));
		fixture.componentInstance.term = 'is high';
		fixture.detectChanges();
		expect(span.nativeElement.querySelectorAll('.highlighted')[0].innerHTML).toBe('is');
		expect(span.nativeElement.querySelectorAll('.highlighted')[1].innerHTML).toBe('high');
		expect(span.nativeElement.textContent).toBe('My text is highlighted');
	});

	it('should have one element with no highlighted text when term not matching', () => {
		const span = fixture.debugElement.query(By.css('#test2'));
		fixture.componentInstance.term = 'non matching';
		fixture.detectChanges();
		expect(span.nativeElement.querySelector('.highlighted')).toBeNull();
		expect(span.nativeElement.innerHTML).toBe('My text is not highlighted');
	});

	it('should have multiple elements with highlighted text when term matching', () => {
		const span = fixture.debugElement.query(By.css('#test3'));
		fixture.componentInstance.term = 'Multiple text highlighted';
		fixture.detectChanges();
		expect(span.nativeElement.querySelectorAll('.highlighted')[0].innerHTML).toBe('Multiple');
		expect(span.nativeElement.querySelectorAll('.highlighted')[1].innerHTML).toBe('text');
		expect(span.nativeElement.querySelectorAll('.highlighted')[2].innerHTML).toBe('highlighted');
		expect(span.nativeElement.textContent).toBe('Multiple text is highlighted');
	});

	it('Highlights special characters', () => {
		const span = fixture.debugElement.query(By.css('#test4'));
		fixture.componentInstance.term = 'ťëxť';
		fixture.detectChanges();
		expect(span.nativeElement.querySelector('.highlighted').innerHTML).toBe('ťëxť');
		expect(span.nativeElement.textContent).toBe('My ťëxť is highlighted text');
	});

	it('should highlight text when label changed', async () => {
		fixture.componentInstance.term = 'new';
		fixture.detectChanges();
		fixture.componentInstance.showNew = true;
		fixture.detectChanges();
		await fixture.whenRenderingDone();
		const span = fixture.debugElement.query(By.css('#test5'));
		expect(span.nativeElement.querySelector('.highlighted').innerHTML).toBe('New');
		expect(span.nativeElement.textContent).toBe('New label');
	});

	it('should highlight text with a special character at the beginning of the term', () => {
		const span = fixture.debugElement.query(By.css('#test6'));

		fixture.componentInstance.term = '+My text';
		fixture.detectChanges();
		expect(span.nativeElement.querySelectorAll('.highlighted')[0].innerHTML).toBe('+My');
		expect(span.nativeElement.querySelectorAll('.highlighted')[1].innerHTML).toBe('text');
		expect(span.nativeElement.textContent).toBe('+My text is) high\\lighted');
	});

	it('should highlight text with a special character at the end of the term', () => {
		const span = fixture.debugElement.query(By.css('#test6'));

		fixture.componentInstance.term = 'is)';
		fixture.detectChanges();
		expect(span.nativeElement.querySelectorAll('.highlighted')[0].innerHTML).toBe('is)');
		expect(span.nativeElement.textContent).toBe('+My text is) high\\lighted');
	});

	it('should highlight text with a special character in the middle of the term', () => {
		const span = fixture.debugElement.query(By.css('#test6'));

		fixture.componentInstance.term = 'high\\l';
		fixture.detectChanges();
		expect(span.nativeElement.querySelectorAll('.highlighted')[0].innerHTML).toBe('high\\l');
		expect(span.nativeElement.textContent).toBe('+My text is) high\\lighted');
	});
});

describe('NgOptionHighlightDirective with recycled content', () => {
	let fixture: ComponentFixture<RecycledLabelTestComponent>;

	beforeEach(() => {
		fixture = applyZonelessFixtureCompat(
			TestBed.configureTestingModule({
				imports: [RecycledLabelTestComponent],
			}).createComponent(RecycledLabelTestComponent),
		);

		fixture.detectChanges();
	});

	it('should highlight the current label when the label and term change together', async () => {
		fixture.componentInstance.term = 'ch';
		fixture.componentInstance.label = 'Cherry';
		fixture.detectChanges();
		await fixture.whenRenderingDone();

		const span = fixture.debugElement.query(By.css('#bound-label'));
		expect(span.nativeElement.textContent).toBe('Cherry');
		expect(span.nativeElement.querySelectorAll('.highlighted')).toHaveLength(1);
		expect(span.nativeElement.querySelector('.highlighted').innerHTML).toBe('Ch');
	});

	it('should update the highlighted label when only the label changes', async () => {
		fixture.componentInstance.term = 'ch';
		fixture.detectChanges();
		await fixture.whenRenderingDone();

		fixture.componentInstance.label = 'Cherry';
		fixture.detectChanges();
		await fixture.whenRenderingDone();
		await flushAsync();

		const span = fixture.debugElement.query(By.css('#bound-label'));
		expect(span.nativeElement.textContent).toBe('Cherry');
		expect(span.nativeElement.querySelectorAll('.highlighted')).toHaveLength(1);
		expect(span.nativeElement.querySelector('.highlighted').innerHTML).toBe('Ch');
	});

	it('should restore the plain label when the term is cleared', async () => {
		fixture.componentInstance.term = 'ch';
		fixture.componentInstance.label = 'Cherry';
		fixture.detectChanges();
		await fixture.whenRenderingDone();

		fixture.componentInstance.term = '';
		fixture.detectChanges();
		await fixture.whenRenderingDone();

		const span = fixture.debugElement.query(By.css('#bound-label'));
		expect(span.nativeElement.innerHTML).toBe('Cherry');
		expect(span.nativeElement.querySelector('.highlighted')).toBeNull();
	});

	it('should render the current item label when index-tracked views are reused', async () => {
		fixture.componentInstance.term = 'ch';
		fixture.detectChanges();
		await fixture.whenRenderingDone();

		fixture.componentInstance.items = [{ name: 'Cherry' }];
		fixture.detectChanges();
		await fixture.whenRenderingDone();
		await flushAsync();

		const options = fixture.debugElement.queryAll(By.css('.filtered-option'));
		expect(options.length).toBe(1);
		expect(options[0].nativeElement.textContent).toBe('Cherry');
		expect(options[0].nativeElement.querySelectorAll('.highlighted')).toHaveLength(1);
		expect(options[0].nativeElement.querySelector('.highlighted').innerHTML).toBe('Ch');
	});

	it('should preserve nested markup and update it when the label changes', async () => {
		fixture.componentInstance.term = 'ch';
		fixture.detectChanges();
		await fixture.whenRenderingDone();

		fixture.componentInstance.label = 'Cherry';
		fixture.detectChanges();
		await fixture.whenRenderingDone();
		await flushAsync();

		const span = fixture.debugElement.query(By.css('#nested-label'));
		expect(span.nativeElement.innerHTML).toBe('<b><span class="highlighted">Ch</span>erry</b>');
		expect(span.nativeElement.textContent).toBe('Cherry');
	});
});
