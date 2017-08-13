import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, ViewChild, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngSelectModule } from './ang-select.module';
import {AngSelectComponent} from './ang-select.component';
import {KeyCode, AngOption} from './ang-select.types';

describe('AngSelectComponent', function () {

    describe('Model changes', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" 
                        bindLabel="name"
                        bindValue="this"
                        [(ngModel)]="selectedCity">
                </ang-select>`);
        });

        it('should update app model value', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.Space);
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.ArrowDown);
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.Enter);
            fixture.detectChanges();

            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);
        });
    });

    describe('Keyboard events', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" 
                        bindLabel="name"
                        bindValue="id"
                        [(ngModel)]="selectedCity">
                </ang-select>`);
        });

        it('should open dropdown on space click', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.Space);

            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });

        it('should select next value on arrow down', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.Space);
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.ArrowDown);
            triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.Enter);

            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
        });

        it('should select first value on arrow down when current selected value is last', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.ArrowDown);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            });
        });

        it('should select previous value on arrow up', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.ArrowUp);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            });

        });

        it('should select last value on arrow up when current selected value is first', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getAngSelectElement(fixture), KeyCode.ArrowUp);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[2]);
            });
        });

    });

    describe('Custom display template', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ang-display-tmp let-item="item">
                        <div class="custom-header">{{item.name}}</div>
                    </ng-template>
                </ang-select>`);
        });

        it('should display custom html', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.custom-header'));
                expect(el).not.toBeNull();
                expect(el.nativeElement).not.toBeNull();
            });
        }));
    });

    describe('Custom option template', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ang-option-tmp let-item="item">
                        <div class="custom-option">{{item.name}}</div>
                    </ng-template>
                </ang-select>`);
        });

        it('should display custom html', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.custom-option')).nativeElement;
                expect(el).not.toBeNull();
            });
        }));
    });

    describe('Placeholder', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" 
                    bindLabel="name"
                    bindValue="id"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ang-select>`);
        });

        it('should display then no selected value', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.ang-select-placeholder')).nativeElement;
                expect(el.innerText).toBe('select value');
            });
        }));

        it('should not display then selected value', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.ang-select-placeholder'));
                expect(el).toBeNull();
            });
        }));
    });

    describe('Search', () => {
        let fixture: ComponentFixture<AngSelectSearch>;

        it('should filter items with default filter', async(() => {
            fixture = createTestingModule(
                AngSelectSearch,
                `<ang-select [items]="cities" 
                    bindLabel="name"
                    bindValue="id"
                    [(ngModel)]="selectedCity">
                </ang-select>`);

            fixture.detectChanges();
            fixture.componentInstance.select.onFilter({target: {value: 'vilnius'}});

            expect(fixture.componentInstance.select.itemsList.filteredItems).toEqual([{ id: 1, name: 'Vilnius' }]);
        }));

        it('should filter items with custom filter function', async(() => {
            fixture = createTestingModule(
                AngSelectSearch,
                `<ang-select [items]="cities" 
                    bindLabel="name"
                    bindValue="id"
                    [filterFunc]="customFilterFunc"
                    [(ngModel)]="selectedCity">
                </ang-select>`);

            fixture.detectChanges();
            fixture.componentInstance.select.onFilter({target: {value: 'no matter'}});

            expect(fixture.componentInstance.select.itemsList.filteredItems).toEqual([{ id: 3, name: 'Pabrade' }]);
        }));

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

function createTestingModule<T>(cmp: Type<T>, template: string): ComponentFixture<T> {
    TestBed.configureTestingModule({
        imports: [FormsModule, AngSelectModule],
        declarations: [AngSelectBasic, AngSelectSearch]
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
    template: ``
})
class AngSelectBasic {
    @ViewChild(AngSelectComponent) select: AngSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
}

@Component({
    template: `
    `
})
class AngSelectSearch {
    @ViewChild(AngSelectComponent) select: AngSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];

    customFilterFunc(term: string) {
        return (item: AngOption) => {
            return item.id === 3;
        };
    }
}
