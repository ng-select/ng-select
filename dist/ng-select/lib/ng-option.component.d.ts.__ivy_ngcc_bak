import { AfterViewChecked, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
export declare class NgOptionComponent implements OnChanges, AfterViewChecked, OnDestroy {
    elementRef: ElementRef<HTMLElement>;
    value: any;
    get disabled(): any;
    set disabled(value: any);
    readonly stateChange$: Subject<{
        value: any;
        disabled: boolean;
        label?: string;
    }>;
    private _disabled;
    private _previousLabel;
    constructor(elementRef: ElementRef<HTMLElement>);
    get label(): string;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewChecked(): void;
    ngOnDestroy(): void;
    private _isDisabled;
}
