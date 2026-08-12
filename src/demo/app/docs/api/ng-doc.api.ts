import { NgDocApi } from '@ng-doc/core';

const Api: NgDocApi = {
	title: 'API Reference',
	scopes: [
		{
			name: '@ng-select/ng-select',
			route: 'ng-select',
			include: 'src/ng-select/lib/**/*.ts',
			exclude: ['**/*.spec.ts', '**/testing/**'],
		},
		{
			name: '@ng-select/ng-option-highlight',
			route: 'ng-option-highlight',
			include: 'src/ng-option-highlight/lib/**/*.ts',
			exclude: '**/*.spec.ts',
		},
	],
};

export default Api;
