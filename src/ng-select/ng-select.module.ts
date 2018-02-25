import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent, NG_SELECT_DEFAULT_CONFIG } from './ng-select.component';
import {
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgHeaderTemplateDirective,
    NgFooterTemplateDirective
} from './ng-templates.directive';
import { NgOptionComponent } from './ng-option.component';
import { NgOptionHighlightDirective } from './ng-option-highlight.directive' ;
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { WindowService } from './window.service';

@NgModule({
    declarations: [
        NgSelectComponent,
        NgOptionComponent,
        NgDropdownPanelComponent,
        NgOptionHighlightDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptionHighlightDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective
    ],
    providers: [
        WindowService,
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
export class NgSelectModule { }
