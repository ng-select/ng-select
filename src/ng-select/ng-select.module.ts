import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectComponent, NG_SELECT_DEFAULT_CONFIG } from './ng-select.component';
import { NgOptionTemplateDirective, NgLabelTemplateDirective } from './ng-templates.directive';
import { VirtualScrollModule } from './virtual-scroll.component';
import { SpinnerComponent } from './spinner.component';
import { NgOptionComponent } from './ng-option.component';

@NgModule({
    declarations: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        SpinnerComponent
    ],
    imports: [
        CommonModule,
        VirtualScrollModule
    ],
    exports: [
        NgSelectComponent,
        NgOptionComponent,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective
    ],
    providers: [
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

