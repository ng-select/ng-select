import { TestBed } from '@angular/core/testing';
import { NgDropdownPanelService } from '@ng-select/ng-select';

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
