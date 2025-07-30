import { Injectable, NgZone, inject } from '@angular/core';

/**
 * Service to detect if the application is running in zoneless mode
 * and provide utilities for handling change detection in both modes.
 */
@Injectable({
	providedIn: 'root'
})
export class ZonelessService {
	private _zone = inject(NgZone);
	
	/**
	 * Check if the application is running in zoneless mode.
	 * In zoneless mode, NgZone is replaced with NoopNgZone or similar implementation.
	 */
	readonly isZoneless = this._isZonelessMode();
	
	private _isZonelessMode(): boolean {
		// Check if NgZone is NoopNgZone or similar implementation
		const zoneName = this._zone.constructor.name;
		return zoneName === 'NoopNgZone' || zoneName === 'MockNoopNgZone' || 
			   zoneName.includes('Noop') || 
			   // Additional check: if zone doesn't actually patch async operations
			   !this._zone.hasPendingMacrotasks;
	}
	
	/**
	 * Run code outside Angular zone if zone is available, otherwise run directly.
	 * This is a safe wrapper for NgZone.runOutsideAngular() that works in both
	 * zone and zoneless modes.
	 */
	runOutsideAngular<T>(fn: () => T): T {
		if (this.isZoneless) {
			// In zoneless mode, just run the function directly
			return fn();
		} else {
			// In zone mode, run outside Angular zone for performance
			return this._zone.runOutsideAngular(fn);
		}
	}
	
	/**
	 * Run code inside Angular zone if zone is available, otherwise run directly.
	 * This is a safe wrapper for NgZone.run() that works in both
	 * zone and zoneless modes.
	 */
	run<T>(fn: () => T): T {
		if (this.isZoneless) {
			// In zoneless mode, just run the function directly
			return fn();
		} else {
			// In zone mode, run inside Angular zone to trigger change detection
			return this._zone.run(fn);
		}
	}
}