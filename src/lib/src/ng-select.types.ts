export interface NgOption {
    [name: string]: any;
    selected?: boolean;
    disabled?: boolean;
    marked?: boolean;
    label?: string;
    value?: string;
}

export enum KeyCode {
    Tab = 9,
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40,
    BackSpace = 8
}
