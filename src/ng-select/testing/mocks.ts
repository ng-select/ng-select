import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class MockNgZone extends NgZone {
	constructor() {
		super({ enableLongStackTrace: true });
	}

	run(fn: () => any): any {
		return fn();
	}

	runOutsideAngular(fn: () => any): any {
		return fn();
	}
}

@Injectable()
export class MockConsole {
	warn() {}
}
