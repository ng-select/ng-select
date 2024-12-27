import { Component } from '@angular/core';

@Component({
    selector: 'ng-fixed-placeholder-example',
    templateUrl: './fixed-placeholder-example.component.html',
    styleUrls: ['./fixed-placeholder-example.component.scss'],
    standalone: false
})
export class FixedPlaceholderExampleComponent {
	isPlaceholderFixed: boolean = true;
}
