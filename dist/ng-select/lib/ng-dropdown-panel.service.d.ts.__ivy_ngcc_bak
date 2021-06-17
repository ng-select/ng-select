export interface ItemsRangeResult {
    scrollHeight: number;
    topPadding: number;
    start: number;
    end: number;
}
export interface PanelDimensions {
    itemHeight: number;
    panelHeight: number;
    itemsPerViewport: number;
}
export declare class NgDropdownPanelService {
    private _dimensions;
    get dimensions(): PanelDimensions;
    calculateItems(scrollPos: number, itemsLength: number, buffer: number): ItemsRangeResult;
    setDimensions(itemHeight: number, panelHeight: number): void;
    getScrollTo(itemTop: number, itemHeight: number, lastScroll: number): number;
}
