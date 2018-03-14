import { Injectable } from '@angular/core';

@Injectable()
export class ConsoleService {
    warn(message: string) {
        console.warn(message)
    }
}
