import { ModuleWithProviders, NgModule, Optional, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select.component';
import {
    NgFooterTemplateDirective,
    NgHeaderTemplateDirective,
    NgLabelTemplateDirective,
    NgLoadingTextTemplateDirective,
    NgMultiLabelTemplateDirective,
    NgNotFoundTemplateDirective,
    NgOptgroupTemplateDirective,
    NgOptionTemplateDirective,
    NgTagTemplateDirective,
    NgTypeToSearchTemplateDirective
} from './ng-templates.directive';
import { NgOptionComponent } from './ng-option.component';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { DefaultSelectionModelFactory } from './selection-model';
import {
    configFactory,
    NG_SELECT_CONFIG,
    NG_SELECT_CONFIG_PAYLOAD,
    NgSelectConfig,
    NgSelectConfigPayload
} from './config.service';

export const providers: Provider[] = [
    { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory },
    {
        provide: NG_SELECT_CONFIG,
        useFactory: configFactory,
        deps: [
            [new Optional(), NgSelectConfig],
            [new Optional(), NG_SELECT_CONFIG_PAYLOAD]]
    },
];

@NgModule({
    declarations: [
        NgDropdownPanelComponent,
        NgOptionComponent,
        NgSelectComponent,
        NgOptionHighlightDirective,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgMultiLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptionHighlightDirective,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgMultiLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective
    ],
    providers

})
export class NgSelectModule {
    static forRoot(config?: NgSelectConfigPayload): ModuleWithProviders {
        return {
            ngModule: NgSelectModule,
            providers: [
                { provide: NG_SELECT_CONFIG_PAYLOAD, useValue: config },
                ...providers
            ]
        }
    }
}
