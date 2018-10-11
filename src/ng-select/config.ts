import { InjectionToken } from '@angular/core';
import { NgSelectConfig } from './ng-select.types';

export const ngSelectConfigDefaults = {
    notFoundText: 'No items found',
    typeToSearchText: 'Type to search',
    addTagText: 'Add item',
    loadingText: 'Loading...',
    clearAllText: 'Clear all',
    disableVirtualScroll: false
};

export function ngSelectDefaultConfigFactory() {
    return ngSelectConfigDefaults;
}

export const NG_SELECT_DEFAULT_CONFIG = new InjectionToken<NgSelectConfig>('ng-select-default-options', {
    factory: ngSelectDefaultConfigFactory
});
