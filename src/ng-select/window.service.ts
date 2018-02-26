import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
    requestAnimationFrame(fn) {
        return window.requestAnimationFrame(fn);
    }
}
