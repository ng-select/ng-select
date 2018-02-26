import { Component, Injectable, ViewChild, ErrorHandler, NgZone } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgSelectComponent } from './ng-select.component';
import { WindowService } from './window.service';
import { VirtualScrollService } from './virtual-scroll.service';
import { ItemsList } from './items-list';
import { MockNgZone, MockNgWindow } from '../testing/mocks';
import { TestsErrorHandler } from '../testing/helpers';

@Component({
    template: `
    <ng-dropdown-panel *ngIf="isOpen"
        class="ng-dropdown-panel"
        [items]="itemsList.filteredItems"
        (update)="viewPortItems = $event">
        <div class="ng-option" *ngFor="let item of viewPortItems">{{item.label}}</div>
    </ng-dropdown-panel>
    `
})
@Injectable()
class MockNgSelect {
    @ViewChild(NgDropdownPanelComponent) dropdownPanel: NgDropdownPanelComponent;
    itemsList = new ItemsList(<any>this);
    viewPortItems = [];
    isOpen = true;
}

describe('NgDropdowPanel', function () {
    let fixture: ComponentFixture<MockNgSelect>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            providers: [
                VirtualScrollService,
                { provide: ErrorHandler, useClass: TestsErrorHandler },
                { provide: NgZone, useFactory: () => new MockNgZone() },
                { provide: WindowService, useFactory: () => new MockNgWindow() },
                { provide: NgSelectComponent, useClass: MockNgSelect },
            ],
            declarations: [
                NgDropdownPanelComponent,
                MockNgSelect
            ]
        }).createComponent(MockNgSelect);

        fixture.detectChanges();
    });

    it('should render items', async(() => {
        fixture.componentInstance.itemsList.setItems(['A', 'B', 'C'], true);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.componentInstance.dropdownPanel.items.length).toBe(3);
            const options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
            expect(options.length).toBe(3);
            expect(options[0].innerText).toBe('A');
            expect(options[1].innerText).toBe('B');
            expect(options[2].innerText).toBe('C');
        });
    }));

    it('should not render items when items length is zero', async(() => {
        fixture.componentInstance.itemsList.setItems([]);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.componentInstance.dropdownPanel.items.length).toBe(0);
            const options = fixture.debugElement.nativeElement.querySelectorAll('.ng-option');
            expect(options.length).toBe(0);
        });
    }));

});

