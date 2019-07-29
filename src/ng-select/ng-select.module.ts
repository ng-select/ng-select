import { NgModule } from '@angular/core';
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
    NgPlaceholderTemplateDirective,
    NgTagTemplateDirective,
    NgTypeToSearchTemplateDirective
} from './ng-templates.directive';
import { NgOptionComponent } from './ng-option.component';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { DefaultSelectionModelFactory } from './selection-model';

@NgModule({
    declarations: [
        NgDropdownPanelComponent,
        NgOptionComponent,
        NgSelectComponent,
        NgOptionHighlightDirective,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgPlaceholderTemplateDirective,
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
        NgPlaceholderTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective
    ],
    providers: [
        { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }
    ]
})
export class NgSelectModule { }
