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

  setTimeout(handler: (...args: any[]) => void, _: number): number {
    handler();
    return 0;
  }
}

@Injectable()
export class MockConsole {
  warn() {}
}
