import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgSelectComponent } from './ng-select.component';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { VirtualScrollModule } from './virtual-scroll.component';
import { SpinnerComponent } from './spinner.component';
import { NgSelectConfig } from './ng-select.types';

@NgModule({
    declarations: [
        NgSelectComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
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
