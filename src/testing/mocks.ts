import { Injectable, NgZone } from '@angular/core';
import { WindowService } from '../ng-select/window.service';

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
export class MockNgWindow extends WindowService {
    requestAnimationFrame(fn: Function): any {
        return fn();
    }
}

@Injectable()
export class MockConsole {
    warn() {

    }
}
