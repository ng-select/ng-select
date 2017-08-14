export interface NgOption {
    [name: string]: any;
    selected?: boolean;
    disabled?: boolean;
    label?: string;
    value?: string;
}

export type FilterFunc = (term: string) => (val: NgOption) => boolean;

export enum KeyCode {
    Tab = 9,
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40
}
