import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZonelessService } from './zoneless.service';

// Real zone mock that behaves like actual NgZone
class MockRealNgZone extends NgZone {
	constructor() {
		super({ enableLongStackTrace: false });
	}

	run<T>(fn: () => T): T {
		return fn();
	}

	runOutsideAngular<T>(fn: () => T): T {
		return fn();
	}
}

// Mock NoopNgZone to simulate zoneless mode  
class MockNoopNgZone extends NgZone {
	constructor() {
		super({ enableLongStackTrace: false });
	}

	run<T>(fn: () => T): T {
		return fn();
	}

	runOutsideAngular<T>(fn: () => T): T {
		return fn();
	}
}

describe('ZonelessService', () => {
	let service: ZonelessService;

	describe('with regular NgZone', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					ZonelessService,
					{ provide: NgZone, useClass: MockRealNgZone }
				]
			});
			service = TestBed.inject(ZonelessService);
		});

		it('should detect zone mode correctly', () => {
			expect(service.isZoneless).toBe(false);
		});

		it('should call NgZone.runOutsideAngular', () => {
			const zone = TestBed.inject(NgZone);
			spyOn(zone, 'runOutsideAngular').and.callThrough();
			
			const mockFn = jasmine.createSpy('mockFn').and.returnValue('result');
			const result = service.runOutsideAngular(mockFn);
			
			expect(zone.runOutsideAngular).toHaveBeenCalledWith(mockFn);
			expect(result).toBe('result');
		});

		it('should call NgZone.run', () => {
			const zone = TestBed.inject(NgZone);
			spyOn(zone, 'run').and.callThrough();
			
			const mockFn = jasmine.createSpy('mockFn').and.returnValue('result');
			const result = service.run(mockFn);
			
			expect(zone.run).toHaveBeenCalledWith(mockFn);
			expect(result).toBe('result');
		});
	});

	describe('with NoopNgZone (zoneless mode)', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [
					ZonelessService,
					{ provide: NgZone, useClass: MockNoopNgZone }
				]
			});
			service = TestBed.inject(ZonelessService);
		});

		it('should detect zoneless mode correctly', () => {
			// The MockNoopNgZone should be detected as zoneless
			expect(service.isZoneless).toBe(true);
		});

		it('should run function directly without NgZone.runOutsideAngular', () => {
			const zone = TestBed.inject(NgZone);
			spyOn(zone, 'runOutsideAngular').and.callThrough();
			
			const mockFn = jasmine.createSpy('mockFn').and.returnValue('result');
			const result = service.runOutsideAngular(mockFn);
			
			expect(zone.runOutsideAngular).not.toHaveBeenCalled();
			expect(mockFn).toHaveBeenCalled();
			expect(result).toBe('result');
		});

		it('should run function directly without NgZone.run', () => {
			const zone = TestBed.inject(NgZone);
			spyOn(zone, 'run').and.callThrough();
			
			const mockFn = jasmine.createSpy('mockFn').and.returnValue('result');
			const result = service.run(mockFn);
			
			expect(zone.run).not.toHaveBeenCalled();
			expect(mockFn).toHaveBeenCalled();
			expect(result).toBe('result');
		});
	});
});