import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NgSelectConfig {
    placeholder: string;
    notFoundText = 'No items found';
    typeToSearchText = 'Type to search';
    addTagText = 'Add item';
    loadingText = 'Loading...';
    clearAllText = 'Clear all';
    toggleDropdownText = 'Toggle dropdown';
    disableVirtualScroll = true;
    openOnEnter = true;
}
