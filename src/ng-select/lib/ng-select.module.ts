import { NgModule } from '@angular/core';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select.component';
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
		NgPlaceholderTemplateDirective,
    NgTagTemplateDirective,
    NgItemLabelDirective,
    NgTypeToSearchTemplateDirective,
    NgLabelValueTemplateDirective,
} from './ng-templates.directive';
import { DefaultSelectionModelFactory } from './selection-model';

@NgModule({
    imports: [
			NgDropdownPanelComponent,
			NgOptionComponent,
			NgSelectComponent,
			NgOptgroupTemplateDirective,
			NgOptionTemplateDirective,
			NgLabelTemplateDirective,
			NgLabelValueTemplateDirective,
			NgMultiLabelTemplateDirective,
			NgHeaderTemplateDirective,
			NgFooterTemplateDirective,
			NgPlaceholderTemplateDirective,
			NgNotFoundTemplateDirective,
			NgTypeToSearchTemplateDirective,
			NgLoadingTextTemplateDirective,
			NgTagTemplateDirective,
			NgLoadingSpinnerTemplateDirective,
			NgItemLabelDirective,
    ],
    exports: [
			NgSelectComponent,
			NgOptionComponent,
			NgOptgroupTemplateDirective,
			NgOptionTemplateDirective,
			NgLabelTemplateDirective,
			NgLabelValueTemplateDirective,
			NgMultiLabelTemplateDirective,
			NgHeaderTemplateDirective,
			NgFooterTemplateDirective,
			NgPlaceholderTemplateDirective,
			NgNotFoundTemplateDirective,
			NgTypeToSearchTemplateDirective,
			NgLoadingTextTemplateDirective,
			NgTagTemplateDirective,
			NgLoadingSpinnerTemplateDirective,
    ],
    providers: [
        { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }
    ],
})
export class NgSelectModule {}
