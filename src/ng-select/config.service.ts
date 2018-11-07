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

export const defaultConfig = new NgSelectConfig();
