import { NgDocConfiguration } from '@ng-doc/builder';

const config: NgDocConfiguration = {
	// Keep the cache off: warm-cache builds skip page indexing and ship an empty search index.
	// `ng serve` uses ng-doc.serve.config.ts instead (wired via `ngDoc.config` in angular.json).
	cache: false,
	repoConfig: {
		url: 'https://github.com/ng-select/ng-select',
		mainBranch: 'master',
		releaseBranch: 'master',
	},
};

export default config;
