import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConsoleService {
    warn(message: string) {
        console.warn(message)
    }
}
