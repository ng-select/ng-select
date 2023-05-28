import { NgModule } from '@angular/core';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectComponent } from './ng-select.component';
import {
    NgFooterTemplateDirective,
    NgHeaderTemplateDirective,
    NgLabelTemplateDirective,
    NgLoadingSpinnerTemplateDirective,
    NgLoadingTextTemplateDirective,
    NgMultiLabelTemplateDirective,
    NgNotFoundTemplateDirective,
    NgOptgroupTemplateDirective,
    NgOptionTemplateDirective,
    NgTagTemplateDirective,
    NgItemLabelDirective,
    NgTypeToSearchTemplateDirective
} from './ng-templates.directive';
import { provideCustomSelectionModelFactory } from './selection-model.provider';

@NgModule({
    imports: [
        NgDropdownPanelComponent,
        NgOptionComponent,
        NgSelectComponent,
        NgItemLabelDirective,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgMultiLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective,
        NgLoadingSpinnerTemplateDirective
    ],
    exports: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgMultiLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective,
        NgLoadingSpinnerTemplateDirective
    ],
    providers: [
        provideCustomSelectionModelFactory()
    ]
})
export class NgSelectModule { }
