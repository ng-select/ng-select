// @ts-check

const { defineConfig } = require('eslint/config');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
	{
		ignores: ['projects/**/*'],
	},
	{
		files: ['**/*.ts'],
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
		processor: angular.processInlineTemplates,
		languageOptions: {
			parserOptions: {
				project: ['tsconfig.json', 'e2e/tsconfig.json'],
				createDefaultProgram: true,
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'no-useless-escape': 'off',
			'no-prototype-builtins': 'off',
			'@typescript-eslint/explicit-member-accessibility': ['off', { accessibility: 'explicit' }],
			'arrow-parens': ['off', 'always'],
			'import/order': 'off',
			'max-len': ['error', { code: 160 }],
			'jsdoc/newline-after-description': 'off',
			'@angular-eslint/no-host-metadata-property': 'off',
			'@angular-eslint/no-output-rename': 'off',
			'@angular-eslint/no-output-native': 'off',
			'@angular-eslint/prefer-standalone': 'off',
			'@angular-eslint/component-selector': [
				'error',
				{
					prefix: 'ng',
					style: 'kebab-case',
					type: 'element',
				},
			],
			'@angular-eslint/directive-selector': [
				'error',
				{
					prefix: 'ng',
					style: 'camelCase',
					type: 'attribute',
				},
			],
			'@typescript-eslint/consistent-type-assertions': 'off',
			'@typescript-eslint/member-delimiter-style': 'off',
			'@typescript-eslint/member-ordering': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'@typescript-eslint/semi': 'off',
			indent: 'off',
			'no-underscore-dangle': 'off',
			'prefer-arrow/prefer-arrow-functions': 'off',
			'spaced-comment': 'error',
			'quote-props': 'off',
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {
			'@angular-eslint/template/eqeqeq': [
				'error',
				{
					allowNullOrUndefined: true,
				},
			],
		},
	},
]);
