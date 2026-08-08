import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NgSelectConfig } from '@ng-select/ng-select';
import { LayoutHeaderComponent } from './layout/header.component';
import { LayoutSidenavComponent } from './layout/sidenav-component';

@Component({
	selector: 'demo-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [LayoutHeaderComponent, LayoutSidenavComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	private titleService = inject(Title);
	private config = inject(NgSelectConfig);
	private document = inject(DOCUMENT);

	title: string;
	version: string = window['ngSelectVersion'];
	exampleSourceUrl: string;
	dir: 'ltr' | 'rtl' = 'ltr';

	constructor() {
		this.config.placeholder = 'Select item';
		// set the bindValue to global config when you use the same bindValue in most of the place.
		// You can also override bindValue for the specified template by defining `bindValue` as property
		// Eg : <ng-select bindValue="some-new-value"></ng-select>
		// this.config.bindValue = 'value';
		this.applyBodyThemeClass();
	}

	// The dropdown panel renders in the CDK overlay outside this component's subtree, so the
	// theme class must live on <body> for the theme styles (global, see styles.scss) to reach
	// both the select and the panel
	private _theme: 'default' | 'ant' | 'material' = 'default';

	get theme(): 'default' | 'ant' | 'material' {
		return this._theme;
	}

	set theme(value: 'default' | 'ant' | 'material') {
		this._theme = value;
		this.applyBodyThemeClass();
	}

	@HostBinding('class') get themeClass() {
		return `${this.theme}-theme`;
	}

	private applyBodyThemeClass() {
		const body = this.document?.body;
		if (!body) {
			return;
		}
		body.classList.remove('default-theme', 'ant-theme', 'material-theme');
		body.classList.add(`${this._theme}-theme`);
	}

	ngOnInit() {
		this.setTitle();
	}

	private setTitle() {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
				map((route) => {
					while (route.firstChild) {
						route = route.firstChild;
					}
					return route;
				}),
				filter((route) => route.outlet === 'primary'),
				mergeMap((route) => route.data),
			)
			.subscribe((event) => {
				this.title = event['title'];
				this.titleService.setTitle(this.title);
				this.exampleSourceUrl = `https://github.com/ng-select/ng-select/tree/master/demo/app/examples/${event['fileName']}`;
			});
	}
}
