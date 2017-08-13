export interface AngOption {
    [name: string]: any;
    selected?: boolean;
    disabled?: boolean;
    label?: string;
    value?: string;
}

export type FilterFunc = (term: string) => (val: AngOption) => boolean;

export enum KeyCode {
    Tab = 9,
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40
}
