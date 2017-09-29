import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgSelectComponent } from './ng-select.component';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { AngSearchFocusDirective } from './ng-search-focus.directive';
import { VirtualScrollModule } from './virtual-scroll.component';
import { SpinnerComponent } from './spinner.component';

@NgModule({
    declarations: [
        NgSelectComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        AngSearchFocusDirective,
        SpinnerComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        VirtualScrollModule
    ],
    exports: [
        NgSelectComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective
    ]
})
export class NgSelectModule {

}
