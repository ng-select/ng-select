import {
    Directive,
    Inject,
    forwardRef,
    OnDestroy,
    Renderer2,
    Input,
    ViewContainerRef,
    TemplateRef
} from '@angular/core';

import { NgSelectComponent } from './ng-select.component';


@Directive({ selector: '[dropdownPanel]' })
export class DropdownPanelDirective implements OnDestroy {

    private _dropdownElement: HTMLElement;
    private _disposeDocumentResizeListener = () => { };

    constructor(
        @Inject(forwardRef(() => NgSelectComponent)) private _ngSelect: NgSelectComponent,
        private _viewContainer: ViewContainerRef,
        private _renderer: Renderer2,
        private _templateRef: TemplateRef<any>,
    ) { }


    @Input('dropdownPanel') set isOpen(open: boolean) {
        if (open) {
            const view = this._viewContainer.createEmbeddedView(this._templateRef);
            this._dropdownElement = view.rootNodes[0];
            if (this._ngSelect.dropdownPosition === 'auto') {
                this._autoPositionDropdown();
            }
            if (this._ngSelect.appendTo) {
                this._handleAppendTo();
                this._updateAppendedDropdownPosition();
            }
        } else {
            this._viewContainer.clear();
        }
    }

    ngOnDestroy() {
        this._disposeDocumentResizeListener();
        this._dropdownElement = null;
    }

    private _handleDocumentResize() {
        const handler = () => {
            if (this._ngSelect.appendTo) {
                this._updateAppendedDropdownPosition();
            }
        };

        this._disposeDocumentResizeListener = this._renderer.listen('window', 'resize', handler);
    }

    private _handleAppendTo() {
        if (this._ngSelect.appendTo === 'body') {
            document.body.appendChild(this._dropdownElement);
        } else {
            const parent = document.querySelector(this._ngSelect.appendTo);
            if (!parent) {
                throw new Error(`appendTo selector ${this._ngSelect.appendTo} did not found any parent element`)
            }
            parent.appendChild(this._dropdownElement);
        }
        this._handleDocumentResize();
        this._updateAppendedDropdownPosition();
    }

    private _updateAppendedDropdownPosition() {
        const selectRect: ClientRect = this._ngSelect.elementRef.nativeElement.getBoundingClientRect();
        const dropdownPanel: HTMLElement = this._dropdownElement;
        const bodyRect = document.body.getBoundingClientRect();
        const offsetTop = selectRect.top - bodyRect.top;
        const offsetLeft = selectRect.left - bodyRect.left;
        const topDelta = this._ngSelect.currentDropdownPosition === 'bottom' ? selectRect.height : -dropdownPanel.clientHeight;
        dropdownPanel.style.top = offsetTop + topDelta + 'px';
        dropdownPanel.style.bottom = 'auto';
        dropdownPanel.style.left = offsetLeft + 'px';
        dropdownPanel.style.width = selectRect.width + 'px';
    }

    private _autoPositionDropdown() {
        const ngOption = this._dropdownElement.querySelector('.ng-option');
        if (!ngOption) {
            setTimeout(() => { this._autoPositionDropdown(); }, 50);
            return;
        }

        const selectRect: ClientRect = this._ngSelect.elementRef.nativeElement.getBoundingClientRect();
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const offsetTop = selectRect.top + window.pageYOffset;
        const height = selectRect.height;
        const dropdownHeight = this._dropdownElement.getBoundingClientRect().height;
        if (offsetTop + height + dropdownHeight > scrollTop + document.documentElement.clientHeight) {
            this._ngSelect.currentDropdownPosition = 'top';
        } else {
            this._ngSelect.currentDropdownPosition = 'bottom';
        }
    }
}
