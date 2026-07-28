import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KeyCode } from '../lib/ng-select.types';

export class TestsErrorHandler {}

/**
 * Zone/zoneless parity shim for fixtures whose templates bind plain test-component
 * properties. In a zone TestBed, fixture.detectChanges() unconditionally re-renders the
 * root template. In a zoneless TestBed it runs ApplicationRef.tick(), which only renders
 * views Angular knows are dirty — a plain property mutation from test code dirties
 * nothing, so the render pass skips the view and the dev-mode checkNoChanges pass then
 * throws NG0100 for the drifted binding (angular/angular#59082). Marking the root view
 * dirty first is what a real zoneless consumer's event handler would have done, and it
 * restores identical detectChanges semantics in both lanes. Library-internal
 * notification bugs stay detectable: checkNoChanges still verifies NgSelect's own views.
 */
export function applyZonelessFixtureCompat<T>(fixture: ComponentFixture<T>): ComponentFixture<T> {
	const originalDetectChanges = fixture.detectChanges.bind(fixture);
	fixture.detectChanges = (checkNoChanges?: boolean) => {
		fixture.changeDetectorRef.markForCheck();
		originalDetectChanges(checkNoChanges);
	};
	return fixture;
}

/** Flush microtasks and macrotasks that run outside Angular's zone (e.g. virtual-scroll measurement). */
export async function flushAsync(): Promise<void> {
	await new Promise<void>((resolve) => queueMicrotask(resolve));
	await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

export async function tickAndDetectChanges(fixture: ComponentFixture<any>) {
	fixture.detectChanges();
	await fixture.whenStable();
	await flushAsync();
	fixture.detectChanges();
}

export async function selectOption(fixture: ComponentFixture<any>, key: KeyCode, index: number) {
	triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space); // open
	await tickAndDetectChanges(fixture);
	for (let i = 0; i < index; i++) {
		triggerKeyDownEvent(getNgSelectElement(fixture), key);
	}
	triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter); // select
}

export function getNgSelectElement(fixture: ComponentFixture<any>): DebugElement {
	return fixture.debugElement.query(By.css('ng-select'));
}

export function getNgSelectNativeElement(fixture: ComponentFixture<any>): HTMLElement {
	return getNgSelectElement(fixture).nativeElement;
}

export function triggerKeyDownEvent(element: DebugElement, key: string, target: Element = null): void {
	element.triggerEventHandler('keydown', {
		key,
		preventDefault: () => {},
		target,
	});
}
