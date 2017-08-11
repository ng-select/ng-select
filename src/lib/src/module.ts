import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngSelectComponent } from './ang-select/ang-select.component';
import { AngOptionDirective, AngDisplayDirective } from './ang-select/ang-templates.directive';
import { AngSearchFocusDirective } from './ang-select/ang-search-focus.directive';
import { ScrollToSelectedDirective } from './ang-select/scroll-to-selected.directive';
import {VirtualScrollModule} from './ang-select/virtual-scroll';

@NgModule({
    declarations: [
        AngSelectComponent,
        AngOptionDirective,
        AngDisplayDirective,
        AngSearchFocusDirective,
        ScrollToSelectedDirective
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
