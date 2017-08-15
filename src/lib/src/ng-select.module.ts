import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {NgSelectComponent} from './ng-select.component';
import {AngOptionDirective, AngDisplayDirective} from './ng-templates.directive';
import {AngSearchFocusDirective} from './ng-search-focus.directive';
import {VirtualScrollModule} from './virtual-scroll.component';

@NgModule({
    declarations: [
        NgSelectComponent,
        AngOptionDirective,
        AngDisplayDirective,
        AngSearchFocusDirective
    ],
    imports: [
        FormsModule,
        CommonModule,
        VirtualScrollModule
    ],
    exports: [
        NgSelectComponent,
        AngOptionDirective,
        AngDisplayDirective
    ]
})
export class NgSelectModule {

}
