import { defineConfig } from 'vitest/config';

// Shared Vitest config for both `ng-select` and `ng-option-highlight` test targets.
//
// zone.js / zone.js/testing / zone.js/plugins/vitest-patch are loaded as `polyfills` via each
// project's `test-build` application target in `angular.json`, which guarantees they are evaluated
// *before* the builder's `init-testbed` module imports `@angular/core/testing`.
export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		testTimeout: 30000,
		hookTimeout: 30000,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcovonly'],
		},
	},
});
