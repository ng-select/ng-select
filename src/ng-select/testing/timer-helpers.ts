import { ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';
import { tickAndDetectChanges } from './helpers';
import type { NgSelectComponent } from '../lib/ng-select.component';

export function enableDebounceFakeTimers(): void {
	vi.useFakeTimers({ shouldAdvanceTime: true });
}

export function disableDebounceFakeTimers(): void {
	vi.useRealTimers();
}

export async function advanceDebounce(fixture: ComponentFixture<unknown>, ms = 200): Promise<void> {
	await vi.advanceTimersByTimeAsync(ms);
	await tickAndDetectChanges(fixture);
}

export async function openSelect(select: NgSelectComponent, fixture: ComponentFixture<unknown>): Promise<void> {
	select.open();
	await tickAndDetectChanges(fixture);
}
