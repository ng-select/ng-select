import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class MockNgZone extends NgZone {
    constructor() {
        super({ enableLongStackTrace: true });
    }

    run(fn: Function): any {
        return fn();
    }
    
    runOutsideAngular(fn: Function): any {
        return fn();
    }
}

@Injectable()
export class MockConsole {
    warn() {

    }
}
