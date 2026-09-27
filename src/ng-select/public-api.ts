/*
 * Public API Surface of ng-select
 */

export {
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
} from './lib/directives/ng-templates.directive';
export { NgDropdownPanelComponent } from './lib/dropdown-panel/ng-dropdown-panel.component';
export { NgDropdownPanelService } from './lib/dropdown-panel/ng-dropdown-panel.service';
export { NgOptionComponent } from './lib/ng-option.component';
export { NgSelectModule } from './lib/ng-select.module';
export { NgSelectComponent, SELECTION_MODEL_FACTORY } from './lib/ng-select/ng-select.component';
export { DefaultSelectionModel, DefaultSelectionModelFactory, SelectionModel } from './lib/selection-model';
export { NgSelectConfig } from './lib/services/config.service';
export { ConsoleService } from './lib/services/console.service';
export { DropdownPosition, NgOption } from './lib/types/ng-select.types';
