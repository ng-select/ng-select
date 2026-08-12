import { Location } from '@angular/common';
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

	readonly theme = signal<NgSelectTheme>((sessionStorage.getItem(THEME_STORAGE_KEY) as NgSelectTheme) || 'default');

	constructor() {
		this.config.placeholder = 'Select item';
		this.config.appendTo = null;
		// Demos default to the fill appearance under the material theme; other themes ignore appearance.
		if (this.theme() === 'material') {
			this.config.appearance = 'fill';
		}
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
}
