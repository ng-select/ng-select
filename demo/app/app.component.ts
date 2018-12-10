import '../style/styles.scss';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NgSelectConfig } from '../../src';

@Component({
    selector: 'demo-app',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {

    title: string;
    version: string = window['ngSelectVersion'];
    exampleSourceUrl: string;
    dir: 'ltr' | 'rtl' = 'ltr';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private config: NgSelectConfig
    ) {
        this.config.placeholder = 'Select item';
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
                mergeMap((route) => route.data)
            )
            .subscribe((event) => {
                this.title = event['title'];
                this.titleService.setTitle(this.title);
                this.exampleSourceUrl = `https://github.com/ng-select/ng-select/tree/master/demo/app/examples/${event['fileName']}`;
            });
    }

}
