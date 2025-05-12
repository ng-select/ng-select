/*
 * Public API Surface of ng-select
 */

export { NgSelectComponent, SELECTION_MODEL_FACTORY } from './lib/ng-select.component';
export { NgSelectModule } from './lib/ng-select.module';
export { NgOption, DropdownPosition } from './lib/ng-select.types';
export { DefaultSelectionModelFactory, DefaultSelectionModel, SelectionModel } from './lib/selection-model';
export { NgSelectConfig } from './lib/config.service';
export { NgOptionComponent } from './lib/ng-option.component';
export { ConsoleService } from './lib/console.service';
export { NgDropdownPanelComponent } from './lib/ng-dropdown-panel.component';
export { NgDropdownPanelService } from './lib/ng-dropdown-panel.service';
export {
	NgOptgroupTemplateDirective,
	NgOptionTemplateDirective,
	NgFooterTemplateDirective,
	NgPlaceholderTemplateDirective,
	NgHeaderTemplateDirective,
	NgItemLabelDirective,
	NgLabelTemplateDirective,
	NgLoadingSpinnerTemplateDirective,
	NgLoadingTextTemplateDirective,
	NgMultiLabelTemplateDirective,
	NgNotFoundTemplateDirective,
	NgTagTemplateDirective,
	NgTypeToSearchTemplateDirective,
	NgClearButtonTemplateDirective,
} from './lib/ng-templates.directive';
