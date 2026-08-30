import { TestBed } from '@angular/core/testing';
import { NgDropdownPanelService } from '@ng-select/ng-select';
import { beforeEach, describe, expect, it } from 'vitest';

describe('NgDropdownPanelService', () => {
	let service: NgDropdownPanelService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [NgDropdownPanelService],
		});

		service = TestBed.inject(NgDropdownPanelService);
	});

	describe('calculate items', () => {
		it('should calculate items from start', () => {
			const itemsLength = 100;
			const buffer = 4;

			service.setDimensions(25, 100);
			const res = service.calculateItems(0, itemsLength, buffer);

			expect(res).toEqual({
				start: 0,
				end: 9,
				topPadding: 0,
				scrollHeight: 2500,
			});
		});

		it('should calculate items when scrolled', () => {
			const itemsLength = 100;
			const buffer = 4;

			service.setDimensions(25, 100);
			const res = service.calculateItems(1250, itemsLength, buffer);

			expect(res).toEqual({
				start: 46,
				end: 59,
				topPadding: 1150,
				scrollHeight: 2500,
			});
		});

		it('should use group and option heights when they differ', () => {
			// [group, option, option, group, option] => 36 + 80 + 80 + 36 + 80 = 312
			const items = [{ children: [] }, {}, {}, { children: [] }, {}];
			service.setDimensions(80, 160, 36);

			const res = service.calculateItems(0, items.length, 1, items);

			expect(res.scrollHeight).toBe(312);
			expect(res.start).toBe(0);
			expect(res.topPadding).toBe(0);
			// panel 160 fits group(36)+option(80)+part of next option → end past index 2, plus buffer
			expect(res.end).toBeGreaterThan(2);
		});

		it('should compute topPadding from cumulative group/option heights when scrolled', () => {
			const items = [{ children: [] }, {}, {}, { children: [] }, {}];
			service.setDimensions(80, 160, 36);

			// Scroll past first group+option (36+80=116)
			const res = service.calculateItems(116, items.length, 0, items);

			expect(res.scrollHeight).toBe(312);
			expect(res.start).toBe(2);
			expect(res.topPadding).toBe(116);
		});
	});

	describe('item offsets', () => {
		it('should accumulate group and option heights', () => {
			const items = [{ children: [] }, {}, { children: [] }, {}];
			service.setDimensions(80, 160, 36);

			expect(service.getItemHeight(items[0])).toBe(36);
			expect(service.getItemHeight(items[1])).toBe(80);
			expect(service.getItemOffset(items, 0)).toBe(0);
			expect(service.getItemOffset(items, 2)).toBe(116);
			expect(service.getScrollHeight(items)).toBe(232);
		});
	});

	describe('scroll to', () => {
		beforeEach(() => {
			service.setDimensions(40, 240);
		});

		it('should not scroll if item is in visible area', () => {
			expect(service.getScrollTo(0, 40, 0)).toBeNull();
			expect(service.getScrollTo(200, 40, 0)).toBeNull();
		});

		it('should not scroll if item is inside panel height', () => {
			expect(service.getScrollTo(40, 40, 40)).toBeNull();
		});

		it('should scroll by item height', () => {
			expect(service.getScrollTo(240, 40, 0)).toBe(40);
		});

		it('should start from top when reached bottom', () => {
			expect(service.getScrollTo(0, 40, 400)).toBe(0);
		});

		it('should move to bottom when reached top', () => {
			expect(service.getScrollTo(600, 40, 0)).toBe(400);
		});
	});
});
