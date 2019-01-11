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
    Home = 36,
    End = 35,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40,
    ArrowLeft = 37,
    ArrowRight = 39,
    Backspace = 8,
    Delete = 46
}
