/**
 * Generates `llms.txt` and `llms-full.txt` at the repository root from the docs pages under
 * `website/src/content/docs/**\/*.mdx` (https://llmstxt.org). Runs before `pnpm build:docs`, and
 * the Astro endpoints in `website/src/pages/` serve the two files at the site root.
 *
 * - `llms.txt`      — project summary plus an index of every docs page with its description.
 * - `llms-full.txt` — the full content of every page, with each `<Demo example="…" />` replaced
 *                     by the example's TypeScript/HTML/SCSS sources so the code is available to LLMs.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = join(root, 'website/src/content/docs');
const examplesDir = join(root, 'src/demo/app/examples');
const siteUrl = 'https://ng-select.github.io/ng-select';
const repoUrl = 'https://github.com/ng-select/ng-select';
const libraryVersion = JSON.parse(readFileSync(join(root, 'src/ng-select/package.json'), 'utf8')).version;
// Node strips the types at import time; the data file has no runtime TS-only syntax beyond that.
const { maintainers, contributors } = await import('../website/src/data/contributors.ts');

/** Sidebar groups in display order (mirrors `sidebar` in website/astro.config.mjs). */
const groups = [
	{ dir: 'getting-started', label: 'Docs' },
	{ dir: 'reference', label: 'Reference' },
	{ dir: 'examples', label: 'Examples' },
];

const summary = `ng-select is a lightweight all-in-one UI select, multiselect and autocomplete component for Angular. It is published as two npm packages: \`@ng-select/ng-select\` (the select component, template directives, and the \`default\`, \`material\` and \`ant.design\` themes) and \`@ng-select/ng-option-highlight\` (an optional directive that highlights the search term inside options). The component is standalone, uses OnPush change detection with signal-based inputs, integrates with Signal Forms, Reactive Forms and Template-driven Forms through \`ControlValueAccessor\`, and supports keyboard navigation, ARIA attributes, virtual scroll, typeahead, tagging, grouping and custom templates.`;

const facts = [
	`Current library version: ${libraryVersion} (Angular peer range ^22.0.0)`,
	`Install: \`npm i @ng-select/ng-select @angular/cdk\` (or pnpm/yarn)`,
	`Docs: ${siteUrl}`,
	`Repository: ${repoUrl}`,
	`Package: https://www.npmjs.com/package/@ng-select/ng-select`,
];

function walk(dir) {
	return readdirSync(dir).flatMap((name) => {
		const file = join(dir, name);
		return statSync(file).isDirectory() ? walk(file) : file.endsWith('.mdx') || file.endsWith('.md') ? [file] : [];
	});
}

function parseFrontmatter(source) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
	if (!match) return { data: {}, body: source };
	const data = {};
	let key = null;
	for (const line of match[1].split(/\r?\n/)) {
		const nested = /^\s+(\w+):\s*(.*)$/.exec(line);
		const top = /^(\w+):\s*(.*)$/.exec(line);
		if (top) {
			key = top[1];
			data[key] = top[2] === '' ? {} : unquote(top[2]);
		} else if (nested && key && typeof data[key] === 'object') {
			data[key][nested[1]] = unquote(nested[2]);
		}
	}
	return { data, body: source.slice(match[0].length) };
}

function unquote(value) {
	const trimmed = value.trim();
	return /^(['"]).*\1$/.test(trimmed) ? trimmed.slice(1, -1) : trimmed;
}

function readExample(example) {
	const read = (ext) => {
		try {
			return readFileSync(join(examplesDir, example, `${example}.component.${ext}`), 'utf8');
		} catch {
			return undefined;
		}
	};
	const ts = read('ts');
	if (!ts) throw new Error(`Demo "${example}" not found under src/demo/app/examples`);
	const html = read('html');
	const scss = read('scss');
	const parts = [`**Example: \`${example}\`**`, '', `\`\`\`ts title="${example}.component.ts"`, ts.trimEnd(), '```'];
	if (html) parts.push('', `\`\`\`html title="${example}.component.html"`, html.trimEnd(), '```');
	if (scss?.trim()) parts.push('', `\`\`\`scss title="${example}.component.scss"`, scss.trimEnd(), '```');
	return parts.join('\n');
}

/** Markdown for the <Contributors section="…" /> component on the Contributors page. */
function renderContributors(section) {
	if (section === 'maintainers') {
		return maintainers
			.map((person) => {
				const links = [`[GitHub](https://github.com/${person.login})`, person.website && `[Website](${person.website})`].filter(Boolean);
				return `### ${person.name} (@${person.login})\n\n${person.bio}\n\n${links.join(' · ')}`;
			})
			.join('\n\n');
	}
	return contributors.map((person) => `- [${person.name}](https://github.com/${person.login}) (@${person.login})`).join('\n');
}

/** Turns MDX into plain Markdown: drops imports, inlines demos, flattens Starlight tabs. */
function toMarkdown(body) {
	const lines = body.split(/\r?\n/);
	const out = [];
	let inFence = false;
	for (const line of lines) {
		if (/^\s*(```|~~~)/.test(line)) {
			inFence = !inFence;
			out.push(line);
			continue;
		}
		if (inFence) {
			out.push(line);
			continue;
		}
		if (/^import\s.+from\s+['"].+['"];?\s*$/.test(line)) continue;
		const demo = /<Demo\s+example="([^"]+)"[^>]*\/>/.exec(line);
		if (demo) {
			out.push(line.replace(demo[0], readExample(demo[1])));
			continue;
		}
		const tab = /^<TabItem\s+label="([^"]+)"[^>]*>/.exec(line);
		if (tab) {
			out.push(`**${tab[1]}**`);
			continue;
		}
		if (/^<\/?(Tabs|TabItem)\b[^>]*>\s*$/.test(line)) continue;
		const people = /<Contributors\s+section="(maintainers|contributors)"[^>]*\/>/.exec(line);
		if (people) {
			out.push(renderContributors(people[1]));
			continue;
		}
		// Other Astro components have no Markdown equivalent.
		if (/^<[A-Z]\w*[^>]*\/>\s*$/.test(line)) continue;
		out.push(line);
	}
	return out
		.join('\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

const pages = walk(docsDir)
	.map((file) => {
		const source = readFileSync(file, 'utf8');
		const { data, body } = parseFrontmatter(source);
		const rel = relative(docsDir, file)
			.replace(/\\/g, '/')
			.replace(/\.mdx?$/, '');
		const dir = rel.includes('/') ? rel.slice(0, rel.indexOf('/')) : '';
		const slug = rel.replace(/(^|\/)index$/, '');
		return {
			file,
			dir,
			title: data.title ?? slug,
			description: data.description ?? '',
			order: Number(data.sidebar?.order ?? Number.MAX_SAFE_INTEGER),
			url: slug ? `${siteUrl}/${slug}/` : `${siteUrl}/`,
			body,
			splash: data.template === 'splash',
		};
	})
	.filter((page) => !page.splash)
	.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

const grouped = groups.map((group) => ({ ...group, pages: pages.filter((page) => page.dir === group.dir) }));
const orphans = pages.filter((page) => !groups.some((group) => group.dir === page.dir));
if (orphans.length) throw new Error(`Docs pages outside the known sidebar groups: ${orphans.map((page) => page.file).join(', ')}`);

const llms = [
	'# ng-select',
	'',
	`> ${summary}`,
	'',
	...facts.map((fact) => `- ${fact}`),
	'',
	...grouped.flatMap((group) => [
		`## ${group.label}`,
		'',
		...group.pages.map((page) => `- [${page.title}](${page.url})${page.description ? `: ${page.description}` : ''}`),
		'',
	]),
	'## Optional',
	'',
	`- [Full documentation in one file](${siteUrl}/llms-full.txt): every docs page with demo source code`,
	`- [README](${repoUrl}#readme): installation, API tables, change detection notes`,
	`- [Releases](${repoUrl}/releases): release notes per version`,
	`- [Contributing](${repoUrl}/blob/master/CONTRIBUTING.md): how to contribute`,
	`- [ng-option-highlight](${repoUrl}/blob/master/src/ng-option-highlight/README.md): highlight directive usage`,
	'',
].join('\n');

const llmsFull = [
	'# ng-select',
	'',
	`URL: ${siteUrl}/`,
	'',
	summary,
	'',
	...facts.map((fact) => `- ${fact}`),
	'',
	...pages.flatMap((page) => [`# ${page.title}`, '', `URL: ${page.url}`, '', toMarkdown(page.body), '']),
].join('\n');

writeFileSync(join(root, 'llms.txt'), llms);
writeFileSync(join(root, 'llms-full.txt'), llmsFull);
console.log(`Wrote llms.txt (${pages.length} pages) and llms-full.txt (${(llmsFull.length / 1024).toFixed(0)} KiB)`);
