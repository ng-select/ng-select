import { NgDocConfiguration } from '@ng-doc/builder';
import baseConfig from './ng-doc.config';

/**
 * Dev-server-only Ng-Doc config (see the demo `serve` target in angular.json).
 * Production builds keep using ng-doc.config.ts, where the cache stays off so the search index is always populated.
 */
const config: NgDocConfiguration = {
	...baseConfig,
	// Keep output between rebuilds so Angular's watcher does not compile while ng-doc/demo is deleted.
	cache: true,
};

export default config;
