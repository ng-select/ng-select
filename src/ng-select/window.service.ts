import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
  requestAnimationFrame(fn) {
    return window.requestAnimationFrame(fn);
  }

  setTimeout(handler: (...args: any[]) => void, timeout: number): number {
    return window.setTimeout(handler, timeout);
  }
}
