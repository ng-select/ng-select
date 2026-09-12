import { Injectable } from '@angular/core';

/**
 * Reports developer-facing warnings through the configured console.
 *
 * @since 3.0.0
 */
@Injectable({ providedIn: 'root' })
export class ConsoleService {
	/**
	 * Writes a developer-facing warning to the console.
	 *
	 * @param message - The message.
	 *
	 * @since 3.0.0
	 */
	warn(message: string) {
		console.warn(message);
	}
}
