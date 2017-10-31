import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectComponent } from './ng-select.component';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { VirtualScrollModule } from './virtual-scroll.component';
import { SpinnerComponent } from './spinner.component';
import { NgSelectConfig } from './ng-select.types';
import { NgOptionComponent } from './ng-option.component';

@NgModule({
    declarations: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        SpinnerComponent
    ],
    imports: [
        CommonModule,
        VirtualScrollModule
    ],
    exports: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective
    ]
})
export class NgSelectModule {
    static forRoot(config: NgSelectConfig): ModuleWithProviders {
        return provideModule(config);
    }

    static forChild(config: NgSelectConfig): ModuleWithProviders {
        return provideModule(config);
    }
}

function provideModule(config: NgSelectConfig) {
    return {
        ngModule: NgSelectModule,
        providers: [
            {provide: NgSelectConfig, useValue: config}
        ]
    };
}
