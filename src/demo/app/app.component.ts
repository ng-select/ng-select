import '../style/styles.scss';

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

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
