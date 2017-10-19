import '../style/styles.scss';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
    selector: 'demo-app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    title: string;

    constructor(private route: ActivatedRoute) {
        this.route.data.subscribe(d => {
            this.title = d.title;
        });
    }

}
