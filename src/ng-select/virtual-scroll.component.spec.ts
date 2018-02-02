import {
    ComponentFixture, TestBed, fakeAsync, tick
} from '@angular/core/testing';

import { Component, Type, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VirtualScrollComponent } from './virtual-scroll.component';

describe('VirtualScrollComponent', () => {
    it('should scroll to selected item', fakeAsync(() => {
        const fixture = createTestingModule(
            BasicVirtualScrollTestCmp,
            `<div style="height: 100px; overflow-y: scroll; display: block;">
                <ng-select-virtual-scroll style="height: 100px;" [bufferAmount]="10" [items]="items" (update)="viewPortItems = $event">
                <div [attr.class]="'item'+item" style="height: 20px;" *ngFor="let item of viewPortItems">
                    {{item}}
                </div>
                </ng-select-virtual-scroll>
             <div>`);

        tick(100);
        fixture.detectChanges();

        // first item should be in view port
        expect(fixture.nativeElement.querySelector('.item0')).not.toBeNull();
        // middle item should be out of view port and not rendered
        expect(fixture.nativeElement.querySelector('.item50')).toBeNull();

        fixture.componentInstance.virtualScroll.scrollInto(50);
        tick(100);
        fixture.detectChanges();

        // first item should not be in view port anymore
        expect(fixture.nativeElement.querySelector('.item0')).toBeNull();
        // middle item should be out of view port and not rendered
        expect(fixture.nativeElement.querySelector('.item50')).not.toBeNull();
    }));
});

function createTestingModule<T>(cmp: Type<T>, template: string): ComponentFixture<T> {
    TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [
            VirtualScrollComponent,
            BasicVirtualScrollTestCmp,
        ]
    })
        .overrideComponent(cmp, {
            set: {
                template: template
            }
        })
        .compileComponents();

    const fixture = TestBed.createComponent(cmp);
    fixture.detectChanges();
    return fixture;
}

@Component({
    template: ''
})
class BasicVirtualScrollTestCmp {
    // numbers range 0 to 99
    viewPortItems = [];
    items = Array.from({length: 100}, (_, key) => key);
    @ViewChild(VirtualScrollComponent) virtualScroll: VirtualScrollComponent;
}
