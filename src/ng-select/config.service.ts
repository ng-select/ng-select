import {InjectionToken} from '@angular/core';

export const NG_SELECT_CONFIG_PAYLOAD = new InjectionToken<NgSelectConfigPayload>('NG_SELECT_CONFIG_PAYLOAD');
export const NG_SELECT_CONFIG = new InjectionToken<NgSelectConfig>('NG_SELECT_CONFIG');

export interface NgSelectConfigPayload {
    placeholder?: string;
    notFoundText?: string;
    typeToSearchText?: string;
    addTagText?: string;
    loadingText?: string;
    clearAllText?: string;
    disableVirtualScroll?: boolean;
    openOnEnter?: boolean;
}

export class NgSelectConfig implements NgSelectConfigPayload {
    placeholder: string;
    notFoundText = 'No items found';
    typeToSearchText = 'Type to search';
    addTagText = 'Add item';
    loadingText = 'Loading...';
    clearAllText = 'Clear all';
    disableVirtualScroll = true;
    openOnEnter = true;
    constructor(payload?: NgSelectConfigPayload) {
        Object.assign(this, payload);
    }
}

export function configFactory(providedConfig: NgSelectConfig, providedPayload: NgSelectConfigPayload) {
    return providedConfig || new NgSelectConfig(providedPayload);
}
