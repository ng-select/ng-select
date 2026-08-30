import { NgModule } from '@angular/core';
import {
	NgClearButtonTemplateDirective,
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
} from './directives/ng-templates.directive';
import { NgDropdownPanelComponent } from './dropdown-panel/ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select/ng-select.component';
import { DefaultSelectionModelFactory } from './selection-model';

/**
 * Provides the compatibility NgModule wrapper for the standalone ng-select declarations.
 *
 * @since 3.0.0
 */
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
		NgClearButtonTemplateDirective,
	],
	providers: provideNgSelect(),
})
export class NgSelectModule {}

/**
 * Provides the default ng-select selection-model dependency.
 *
 * @since 15.2.0
 */
export function provideNgSelect() {
	return [
		{
			provide: SELECTION_MODEL_FACTORY,
			useValue: DefaultSelectionModelFactory,
		},
	];
}
