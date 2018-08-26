import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConsoleService } from './console.service';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive';
import { NgOptionComponent } from './ng-option.component';
import { NG_SELECT_DEFAULT_CONFIG, NgSelectComponent } from './ng-select.component';
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
    NgTypeToSearchTemplateDirective,
} from './ng-templates.directive';
import { VirtualScrollService } from './virtual-scroll.service';
import { WindowService } from './window.service';

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
  imports: [CommonModule],
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
  providers: [
    ConsoleService,
    WindowService,
    VirtualScrollService,
    {
      provide: NG_SELECT_DEFAULT_CONFIG,
      useValue: {
        notFoundText: 'No items found',
        typeToSearchText: 'Type to search',
        addTagText: 'Add item',
        loadingText: 'Loading...',
        clearAllText: 'Clear all',
        disableVirtualScroll: false
      }
    }
  ]
})
export class NgSelectModule {}
