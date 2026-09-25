import { defineEcConfig } from '@astrojs/starlight/expressive-code';

/**
 * Expressive Code options live here (not in astro.config.mjs) because the <Code> component used by
 * Demo.astro needs a JSON-serializable config, and the style overrides below are functions.
 */
export default defineEcConfig({
	// The old Ng-Doc site highlighted with Shiki's github-light / ayu-dark. Starlight maps each theme
	// to `[data-theme='<type>']`, so these follow the site's light/dark switch.
	themes: ['github-light', 'ayu-dark'],
	useStarlightUiThemeColors: false,
	// Sources use tabs; render them 4 columns wide (applies to Markdown fences and <Code>).
	tabWidth: 4,
	frames: { extractFileNameFromCode: false },
	// Ng-Doc rendered shell snippets as plain code blocks: use the editor frame (no terminal title bar).
	defaultProps: { overridesByLang: { 'bash,sh,shell,shellscript,zsh,console': { frame: 'code' } } },
	// Block chrome measured on the old Ng-Doc site: #f6f6f6 canvas, 1px #dedede border, 8px radius,
	// 14px / 20px monospace, 16px vertical and 24px horizontal padding. Dark values follow ayu-dark.
	styleOverrides: {
		codeBackground: ({ theme }) => (theme.type === 'dark' ? '#0b0e14' : '#f6f6f6'),
		borderColor: ({ theme }) => (theme.type === 'dark' ? '#353841' : '#dedede'),
		borderWidth: '1px',
		borderRadius: '8px',
		codeFontSize: '14px',
		codeLineHeight: '1.4286',
		codePaddingBlock: '16px',
		codePaddingInline: '24px',
		frames: { shadowColor: 'transparent' },
	},
});
