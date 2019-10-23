export type DropdownPosition = 'auto' | 'bottom' | 'top';
export type AddTagFn = (term: string) => any | Promise<any>;
export type CompareWithFn = (a: any, b: any) => boolean;
export type GroupValueFn = (key: string | object, children: any[]) => string | object;
export type KeyDownFn = (_: KeyboardEvent) => boolean;
export type SearchFn = (term: string, item: any) => boolean;
export type TrackByFn = (item: any) => any;

export interface NgOption {
    [name: string]: any;
    index?: number;
    htmlId?: string;
    selected?: boolean;
    disabled?: boolean;
    marked?: boolean;
    label?: string;
    value?: string | Object;
    parent?: NgOption;
    children?: NgOption[];
}

export enum KeyCode {
    Tab = 9,
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40,
    Backspace = 8
}
