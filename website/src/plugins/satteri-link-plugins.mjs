/**
 * Link transforms for Markdown/MDX content, written as Sätteri hast plugins.
 *
 * Astro 7 renders Markdown and MDX with Sätteri (`@astrojs/markdown-satteri`) by default, and
 * Starlight 0.42 registers its own transforms on that processor. unified/rehype plugins passed via
 * `markdown.rehypePlugins` do not run on Sätteri (and require `@astrojs/markdown-remark`), so the
 * equivalents of `rehype-external-links` and the base-path rewrite live here instead.
 * Registered from astro.config.mjs.
 */

/** Absolute http(s) or protocol-relative URL — what `rehype-external-links` treats as external by default. */
const EXTERNAL_HREF = /^(?:https?:)?\/\//i;

/**
 * Opens external links in a new tab (`rehype-external-links` equivalent).
 * @param {{ target?: string, rel?: string[] }} [options]
 */
export function externalLinks({ target = '_blank', rel = ['noopener', 'noreferrer'] } = {}) {
	return {
		name: 'ng-select-external-links',
		element: {
			filter: ['a'],
			visit(node, ctx) {
				const href = node.properties?.href;
				if (typeof href !== 'string' || !EXTERNAL_HREF.test(href)) return;
				ctx.setProperty(node, 'target', target);
				ctx.setProperty(node, 'rel', rel);
			},
		},
	};
}

/**
 * Prefixes root-relative content links (`/examples/forms/`) with Astro's `base` (`/ng-select`),
 * so authors can keep writing base-free links like the old Ng-Doc site did.
 * @param {{ base: string }} options
 */
export function baseLinks({ base }) {
	const prefix = base.replace(/\/$/, '');
	return {
		name: 'ng-select-base-links',
		element: {
			filter: ['a'],
			visit(node, ctx) {
				const href = node.properties?.href;
				if (!prefix || typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return;
				if (href === prefix || href.startsWith(`${prefix}/`)) return;
				ctx.setProperty(node, 'href', `${prefix}${href}`);
			},
		},
	};
}
