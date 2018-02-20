/**
 * The MIT License (MIT)
 * Copyright (c) 2016 Rinto Jose (rintoj)
 * Source code https://github.com/rintoj/angular2-virtual-scroll
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgModule, NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output, Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgOption } from './ng-select.types';
import { VirtualScrollService } from './virtual-scroll.service';

@Component({
    selector: 'ng-select-virtual-scroll',
    providers: [VirtualScrollService],
    template: `
        <div *ngIf="enabled" class="total-padding" [style.height]="scrollHeight + 'px'"></div>
        <div #content
             [class.scrollable-content]="enabled"
             [style.transform]="transformStyle">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        :host {
            overflow: hidden;
            overflow-y: auto;
            position: relative;
            display: block;
            -webkit-overflow-scrolling: touch;
        }

        .scrollable-content {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .total-padding {
            width: 1px;
            opacity: 0;
        }
    `]
})
export class VirtualScrollComponent implements OnInit, OnChanges, OnDestroy {

    @Input() items: NgOption[] = [];
    @Input() bufferAmount = 0;
    @Input() disabled = false;

    @Output() update = new EventEmitter<any[]>();
    @Output() init = new EventEmitter<any>();

    @ViewChild('content', { read: ElementRef }) contentElementRef: ElementRef;

    scrollHeight: number;

    private _topPadding: number;
    private _previousStart: number;
    private _previousEnd: number;
    private _startupLoop = true;
    // min number of items for virtual scroll to be enabled
    private _minItems = 40;
    private _disposeScrollListener = () => { };

    constructor(
        private element: ElementRef,
        private zone: NgZone,
        private renderer: Renderer2,
        private virtualScrollService: VirtualScrollService
    ) {}

    get enabled() {
        return !this.disabled && this.items && this.items.length > this._minItems;
    }

    get transformStyle() {
        return this.enabled ? 'translateY(' + this._topPadding + 'px)' : 'none'
    }

    handleScroll() {
        const handler = () => {
            if (!this.enabled) {
                this.update.emit(this.items);
                return;
            }
            this.refresh();
        };
        this._disposeScrollListener = this.renderer.listen(this.element.nativeElement, 'scroll', handler);
    }

    ngOnInit() {
        this.handleScroll();
    }

    ngAfterContentInit() {
        this.init.emit();
    }

    ngOnDestroy() {
        this._disposeScrollListener();
    }

    ngOnChanges(changes: SimpleChanges) {
        this._previousStart = undefined;
        this._previousEnd = undefined;
        const items = (changes as any).items || {};
        if ((changes as any).items !== undefined && items.previousValue === undefined ||
            (items.previousValue !== undefined && items.previousValue.length === 0)) {
            this._startupLoop = true;
        }
        this.items = items.currentValue;
        this.refresh();
    }

    refresh() {
        if (!this.enabled) {
            this.update.emit(this.items);
            return;
        }
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => this._calculateItems());
        });
    }

    scrollInto(item: any) {
        const el: Element = this.element.nativeElement;
        const index: number = (this.items || []).indexOf(item);
        if (index < 0 || index >= (this.items || []).length) {
            return;
        }

        const d = this._calculateDimensions();
        const buffer = Math.floor(d.viewHeight / d.childHeight) - 1;
        el.scrollTop = (Math.floor(index / d.itemsPerRow) * d.childHeight)
            - (d.childHeight * Math.min(index, buffer));
        this.refresh();
    }

    scrollIntoTag() {
        const el: Element = this.element.nativeElement;
        const d = this._calculateDimensions();
        el.scrollTop = d.childHeight * (d.itemCount + 1);
        this.refresh();
    }

    private _calculateItems() {
        NgZone.assertNotInAngularZone();
        let items = this.items || [];
        const d = this._calculateDimensions();
        const range = this.virtualScrollService.calculateItemsRange(d, this.element, this.bufferAmount);
        this.scrollHeight = range.scrollHeight;
        this._topPadding = range.topPadding;

        if (range.start !== this._previousStart || range.end !== this._previousEnd) {

            // update the scroll list
            this.zone.run(() => {
                this.update.emit(items.slice(range.start, range.end));
            });

            this._previousStart = range.start;
            this._previousEnd = range.end;

            if (this._startupLoop === true) {
                this.refresh();
            }

        } else if (this._startupLoop === true) {
            this._startupLoop = false;
            this.refresh();
        }
    }

    private _calculateDimensions() {
        return this.virtualScrollService.calculateDimensions(this.items, this.scrollHeight, this.element, this.contentElementRef)
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [VirtualScrollComponent],
    declarations: [VirtualScrollComponent]
})
export class VirtualScrollModule {
}
