import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngSelectComponent } from './ang-select.component';
import { AngOptionDirective, AngDisplayDirective } from './ang-templates.directive';
import { AngSearchFocusDirective } from './ang-search-focus.directive';
import {VirtualScrollModule} from './virtual-scroll.component';

@NgModule({
    declarations: [
        AngSelectComponent,
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
        AngSelectComponent,
        AngOptionDirective,
        AngDisplayDirective
    ]
})
export class AngSelectModule {

}
