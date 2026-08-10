import { DOCUMENT, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgDocNavbarComponent, NgDocRootComponent, NgDocSidebarComponent, NgDocThemeToggleComponent } from '@ng-doc/app';
import { NgDocButtonIconComponent, NgDocIconComponent, NgDocTooltipDirective } from '@ng-doc/ui-kit';
import { NgSelectConfig } from '@ng-select/ng-select';

export type NgSelectTheme = 'default' | 'ant' | 'material';

const THEME_STORAGE_KEY = 'ng-select-theme';

@Component({
	selector: 'demo-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [
		RouterOutlet,
		RouterLink,
		NgDocRootComponent,
		NgDocNavbarComponent,
		NgDocSidebarComponent,
		NgDocThemeToggleComponent,
		NgDocButtonIconComponent,
		NgDocIconComponent,
		NgDocTooltipDirective,
	],
})
export class AppComponent {
	private config = inject(NgSelectConfig);
	protected readonly location = inject(Location);
	private document = inject(DOCUMENT);

	readonly theme = signal<NgSelectTheme>((sessionStorage.getItem(THEME_STORAGE_KEY) as NgSelectTheme) || 'default');

	constructor() {
		this.config.placeholder = 'Select item';
		// Demos default to the fill appearance under the material theme; other themes ignore appearance.
		if (this.theme() === 'material') {
			this.config.appearance = 'fill';
		}
		this.applyBodyThemeClass();
	}

	@HostBinding('class') get themeClass() {
		return `${this.theme()}-theme`;
	}

	@HostBinding('attr.data-ng-doc-is-landing')
	get isLandingPage(): boolean {
		return this.location.path() === '';
	}

	setTheme(theme: string) {
		this.theme.set(theme as NgSelectTheme);
		sessionStorage.setItem(THEME_STORAGE_KEY, theme);
		// Rendered selects read config (e.g. appearance) once at init, so re-init the app to apply it.
		window.location.reload();
	}

	// The dropdown panel renders in the CDK overlay outside this component's subtree, so the
	// theme class must live on <body> for the theme styles (global, see styles.scss) to reach
	// both the select and the panel. setTheme() reloads the app, which re-runs this.
	private applyBodyThemeClass() {
		const body = this.document?.body;
		if (!body) {
			return;
		}
		body.classList.remove('default-theme', 'ant-theme', 'material-theme');
		body.classList.add(`${this.theme()}-theme`);
	}
}
