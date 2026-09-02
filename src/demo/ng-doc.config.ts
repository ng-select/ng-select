import { NgDocConfiguration } from '@ng-doc/builder';

const config: NgDocConfiguration = {
	// Keep output between rebuilds so Angular's watcher does not compile while ng-doc/demo is deleted.
	// Tradeoff: a cold start with a warm cache may skip page indexing until a doc file changes.
	cache: true,
	repoConfig: {
		url: 'https://github.com/ng-select/ng-select',
		mainBranch: 'master',
		releaseBranch: 'master',
	},
};

export default config;
