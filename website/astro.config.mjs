import angular from '@analogjs/astro-angular';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { baseLinks, externalLinks } from './src/plugins/satteri-link-plugins.mjs';

const siteRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('..', import.meta.url));

/** Deployed base path (GitHub Pages project site). */
const BASE = '/ng-select';

/** Only these paths go through the Angular compiler; everything else (Starlight, Astro) is plain TS. */
const ANGULAR_PATHS = ['/src/demo/app/examples/', '/src/ng-select/', '/src/ng-option-highlight/', '/website/src/angular/'];

/**
 * Render-blocking inline <head> script, added through Starlight's `head` option (the documented
 * alternative to overriding the `Head` component). It
 * - applies the persisted ng-select demo theme class to <html> before first paint, so selects never
 *   flash the default theme (ng-select-themes.scss is scoped to `html.<theme>-theme`);
 * - redirects legacy hash-routed URLs from the old Ng-Doc site (`/ng-select/#/examples/forms`)
 *   to the equivalent path on this site.
 */
const earlyHeadScript = String.raw`(() => {
	const root = document.documentElement;
	try {
		root.classList.add((sessionStorage.getItem('ng-select-theme') || 'default') + '-theme');
	} catch {
		root.classList.add('default-theme');
	}
	if (location.hash.startsWith('#/')) {
		const base = ${JSON.stringify(BASE)};
		// "#/examples/multiselect#hidden-selected-items" -> "/ng-select/examples/multiselect/#hidden-selected-items"
		const [path, anchor] = location.hash.slice(1).split('#');
		location.replace((path === '/' ? base + '/' : base + path.replace(/\/?$/, '/')) + (anchor ? '#' + anchor : ''));
	}
})();`;

/**
 * Astro 7 renders Markdown and MDX with Sätteri. The legacy `markdown.smartypants` and
 * `markdown.rehypePlugins` options are deprecated there (rehype plugins don't run on Sätteri at
 * all), so configure the active processor directly — the same way Starlight registers its own
 * transforms — which also covers `.mdx` (MDX inherits the Markdown processor).
 */
function contentMarkdown() {
	return {
		name: 'ng-select-docs:content-markdown',
		hooks: {
			'astro:config:setup': ({ config, logger }) => {
				const processor = config.markdown.processor;
				if (processor?.name !== 'satteri') {
					logger.warn(`Expected the Sätteri Markdown processor, got "${processor?.name}"; content link transforms are not applied.`);
					return;
				}
				// Keep straight quotes and `--` as typed (API tables, code-like prose).
				processor.options.features.smartPunctuation = false;
				processor.options.hastPlugins.push(externalLinks({ target: '_blank', rel: ['noopener', 'noreferrer'] }), baseLinks({ base: BASE }));
			},
		},
	};
}

export default defineConfig({
	site: 'https://ng-select.github.io',
	base: BASE,
	outDir: '../dist/docs',
	trailingSlash: 'ignore',
	integrations: [
		angular({
			vite: {
				tsconfig: `${siteRoot}tsconfig.app.json`,
				inlineStylesExtension: 'scss',
				transformFilter: (_code, id) => ANGULAR_PATHS.some((p) => id.includes(p)),
			},
		}),
		contentMarkdown(),
		starlight({
			title: 'ng-select',
			description: 'Lightweight all-in-one UI select, multiselect and autocomplete component for Angular.',
			favicon: '/favicon.ico',
			head: [{ tag: 'script', content: earlyHeadScript }],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ng-select/ng-select' },
				{ icon: 'npm', label: 'npm', href: 'https://www.npmjs.com/package/@ng-select/ng-select' },
			],
			// Starlight appends the entry's path relative to the Astro root (`src/content/docs/…`).
			editLink: { baseUrl: 'https://github.com/ng-select/ng-select/edit/master/website/' },
			// Expressive Code options live in ./ec.config.mjs (needed for the <Code> component used by Demo.astro).
			sidebar: [
				{ label: 'Docs', items: [{ autogenerate: { directory: 'getting-started' } }] },
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
				{ label: 'Examples', items: [{ autogenerate: { directory: 'examples' } }] },
			],
			// Vendor styles first, our overrides last. All of these are unlayered, so they win over
			// Starlight's own `@layer starlight.*` styles regardless of order or specificity.
			customCss: [
				'./src/styles/bootstrap.scss',
				'./src/styles/ng-select-themes.scss',
				'./src/styles/custom.css',
				'./src/styles/demo.css',
				'./src/styles/layout.css',
			],
			components: {
				PageTitle: './src/components/PageTitle.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
		}),
	],
	vite: {
		// lightningcss rejects one of the compiled Angular component stylesheets; esbuild (what the Angular CLI uses) is fine.
		build: { cssMinify: 'esbuild' },
		resolve: {
			alias: {
				'@ng-select/ng-select': `${repoRoot}src/ng-select/public-api.ts`,
				'@ng-select/ng-option-highlight': `${repoRoot}src/ng-option-highlight/public-api.ts`,
				'@examples': `${repoRoot}src/demo/app/examples`,
				'@components': `${siteRoot}src/components`,
			},
		},
		server: { fs: { allow: [repoRoot] } },
	},
});
