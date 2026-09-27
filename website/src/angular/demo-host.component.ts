import { provideHttpClient, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, Provider, ViewContainerRef, afterNextRender, inject, input } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { EXAMPLES } from './examples.registry';

export const NG_SELECT_THEME_STORAGE_KEY = 'ng-select-theme';

/** Global ng-select defaults for every demo island (each island is its own Angular app). */
function provideDemoNgSelectConfig(): Provider {
	return {
		provide: NgSelectConfig,
		useFactory: () => {
			const config = new NgSelectConfig();
			config.placeholder = 'Select item';
			// Demos default to the fill appearance under the material theme; other themes ignore appearance.
			if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(NG_SELECT_THEME_STORAGE_KEY) === 'material') {
				config.appearance = 'fill';
			}
			return config;
		},
	};
}

const DEMO_PROVIDERS: Provider[] = [provideHttpClient(withFetch()), provideDemoNgSelectConfig()];

/**
 * Astro island that mounts one demo component by folder name.
 * The demo is loaded lazily in the browser only, so build-time prerendering never
 * executes example code (some examples touch `window`/`document`).
 */
@Component({
	selector: 'ng-demo-host',
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoHostComponent {
	static clientProviders = DEMO_PROVIDERS;
	static renderProviders = DEMO_PROVIDERS;

	readonly example = input<string>('');
	private readonly viewContainer = inject(ViewContainerRef);

	constructor() {
		// Prerendering (platform-server) must not load demo code; inputs are also not yet set at that point.
		if (!isPlatformBrowser(inject(PLATFORM_ID))) {
			return;
		}
		afterNextRender(async () => {
			const load = EXAMPLES[this.example()];
			if (!load) {
				console.error(`[ng-select docs] Unknown example "${this.example()}"`);
				return;
			}
			this.viewContainer.createComponent(await load());
		});
	}
}
