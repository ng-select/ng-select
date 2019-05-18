import { ComponentFixture, tick } from '@angular/core/testing';
import { KeyCode } from '../ng-select/ng-select.types';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export class TestsErrorHandler {
    handleError(error: any) {
        throw error;
    }
}

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
    fixture.detectChanges();
    tick();
}

export function selectOption(fixture, key: KeyCode, index: number) {
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space); // open
    for (let i = 0; i < index; i++) {
        triggerKeyDownEvent(getNgSelectElement(fixture), key);
    }
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter); // select
}

export function getNgSelectElement(fixture: ComponentFixture<any>): DebugElement {
    return fixture.debugElement.query(By.css('ng-select'));
}

export function triggerKeyDownEvent(element: DebugElement, which: number, key = ''): void {
    element.triggerEventHandler('keydown', {
        which: which,
        key: key,
        preventDefault: () => { },
    });
}
