import { NgModule } from '@angular/core';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select.component';
import {
	NgFooterTemplateDirective,
	NgHeaderTemplateDirective,
	NgItemLabelDirective,
	NgLabelTemplateDirective,
	NgLoadingSpinnerTemplateDirective,
	NgLoadingTextTemplateDirective,
	NgMultiLabelTemplateDirective,
	NgNotFoundTemplateDirective,
	NgOptgroupTemplateDirective,
	NgOptionTemplateDirective,
	NgPlaceholderTemplateDirective,
	NgTagTemplateDirective,
	NgTypeToSearchTemplateDirective,
	NgClearButtonTemplateDirective
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
		NgMultiLabelTemplateDirective,
		NgHeaderTemplateDirective,
		NgFooterTemplateDirective,
		NgPlaceholderTemplateDirective,
		NgClearButtonTemplateDirective,
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
		NgMultiLabelTemplateDirective,
		NgHeaderTemplateDirective,
		NgFooterTemplateDirective,
		NgPlaceholderTemplateDirective,
		NgNotFoundTemplateDirective,
		NgTypeToSearchTemplateDirective,
		NgLoadingTextTemplateDirective,
		NgTagTemplateDirective,
		NgLoadingSpinnerTemplateDirective,
		NgClearButtonTemplateDirective
	],
	providers: [{ provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }],
})
export class NgSelectModule {}
