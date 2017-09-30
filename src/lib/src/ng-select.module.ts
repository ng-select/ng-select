import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgSelectComponent } from './ng-select.component';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { AngSearchFocusDirective } from './ng-search-focus.directive';
import { VirtualScrollModule } from './virtual-scroll.component';
import { SpinnerComponent } from './spinner.component';
import { NgSelectConfig } from './ng-select.types';

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
    static forRoot(config: NgSelectConfig): ModuleWithProviders {
        return {
            ngModule: NgSelectModule,
            providers: [
                {provide: NgSelectConfig, useValue: config}
            ]
        };
    }

    constructor(@Optional() @SkipSelf() parentModule: NgSelectModule) {
        if (parentModule) {
            throw new Error(
                'NgSelectModule is already loaded. Import it in the AppModule only');
        }
    }
}
