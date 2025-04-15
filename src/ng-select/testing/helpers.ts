import { DebugElement } from '@angular/core';
import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { KeyCode } from '../lib/ng-select.types';

export class TestsErrorHandler {}

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
	fixture.detectChanges();
	tick();
}

export function selectOption(fixture, key: KeyCode, index: number) {
	triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space); // open
	tickAndDetectChanges(fixture); // need to tick and detect changes, since dropdown fully inits after promise is resolved
	for (let i = 0; i < index; i++) {
		triggerKeyDownEvent(getNgSelectElement(fixture), key);
	}
	triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter); // select
}

export function getNgSelectElement(fixture: ComponentFixture<any>): DebugElement {
	return fixture.debugElement.query(By.css('ng-select'));
}

export function triggerKeyDownEvent(element: DebugElement, key: string, target: Element = null): void {
	element.triggerEventHandler('keydown', {
		key,
		preventDefault: () => {},
		target,
	});
}
