export interface NgOption {
    [name: string]: any;
    index?: number;
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
    Backspace = 8
}

export class NgSelectConfig {
    notFoundText = '';
    typeToSearchText = '';
}
