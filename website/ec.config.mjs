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
	// GitHub-like block chrome: light grey canvas (#f6f8fa) in light mode, GitHub dark canvas in dark mode.
	styleOverrides: {
		codeBackground: ({ theme }) => (theme.type === 'dark' ? '#0d1117' : '#f6f8fa'),
		borderColor: ({ theme }) => (theme.type === 'dark' ? '#30363d' : '#d0d7de'),
		borderRadius: '6px',
		codeFontSize: '0.875rem',
		codeLineHeight: '1.5',
		frames: { shadowColor: 'transparent' },
	},
});
