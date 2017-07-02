import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement, Component, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {AngSelectModule} from '../module';
import {AngSelectComponent, Key} from './ang-select.component';

describe('AngSelectComponent', function () {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, AngSelectModule],
            declarations: [AngSelectTestPage]
        })
            .compileComponents();
    }));


    it('should create component', () => {
        const fixture = TestBed.createComponent(AngSelectTestPage);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeDefined();
    });

    describe('dropdown container click', () => {
        let fixture: ComponentFixture<AngSelectTestPage>;
        let trigger: HTMLElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(AngSelectTestPage);
            fixture.detectChanges();
            trigger = fixture.debugElement.query(By.css('.ang-select-container')).nativeElement;
        });

        it('should toggle dropdown on select container click', () => {
            trigger.click();
            fixture.detectChanges();
            expect(fixture.componentInstance.select.isOpen).toBe(true);

            trigger.click();
            fixture.detectChanges();
            expect(fixture.componentInstance.select.isOpen).toBe(false);
        });

        it('should select value and close dropdown on option select', () => {
            trigger.click();
            fixture.detectChanges();

            const angOptionElement = fixture.debugElement.query(By.css('.ang-option')).nativeElement;
            angOptionElement.click();
            fixture.detectChanges();

            expect(fixture.componentInstance.select.isOpen).toBe(false);
            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);
        });
    });

    describe('model changes', () => {
        let fixture: ComponentFixture<AngSelectTestPage>;

        beforeEach(() => {
            fixture = TestBed.createComponent(AngSelectTestPage);
            fixture.detectChanges();
        });

        xit('should update app model value', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowDown);
            fixture.detectChanges();

            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[1]);
        });

        it('should update select model value', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[2]);
            });
        });
    });

    describe('keyboard events', () => {
        let fixture: ComponentFixture<AngSelectTestPage>;

        beforeEach(() => {
            fixture = TestBed.createComponent(AngSelectTestPage);
            fixture.detectChanges();
        });

        it('should open dropdown on space click', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), Key.Space);

            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });

        xit('should select next value on arrow down', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowDown);

            expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[1]);
        });

        it('should select first value on arrow down when current selected value is last', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowDown);
                expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[0]);
            });
        });

        it('should select previous value on arrow up', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowUp);
                expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[0]);
            });

        });

        it('should select last value on arrow up when current selected value is first', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowUp);
                expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[2]);
            });
        });

    });

});

function getAngSelectElement(fixture: ComponentFixture<any>): DebugElement {
    return fixture.debugElement.query(By.css('ang-select'));
}

function triggerKeyDownEvent(element: DebugElement, key: number): void {
    element.triggerEventHandler('keydown', {
        which: key,
        preventDefault: () => {
        }
    });
}

@Component({
    template: `
        <div>
            <button (click)="toggle()">Click</button>
            <div *ngIf="show">Show</div>
            <ang-select [items]="cities" [(ngModel)]="selectedCity">
                <ng-template ang-display-tmp let-item="item">
                    {{item.name}}
                </ng-template>
                <ng-template ang-option-tmp let-item="item">
                    Template <b>{{item.name}}</b>
                </ng-template>
            </ang-select>
        </div>
    `
})
class AngSelectTestPage {
    @ViewChild(AngSelectComponent) select: AngSelectComponent;
    selectedCity: { id: number; name: string };
    show = true;

    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pabrade'},
    ];

    toggle() {
        this.show = !this.show;
    }
}
