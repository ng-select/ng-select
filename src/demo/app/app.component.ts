import '../style/styles.scss';

import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'demo-app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    title: string;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private titleService: Title) {
    }

    ngOnInit() {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe((event) => {
                this.title = event['title'];
                this.titleService.setTitle(this.title);
            });
    }

}
