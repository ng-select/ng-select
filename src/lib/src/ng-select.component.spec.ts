import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, ViewChild, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from './ng-select.module';
import { NgSelectComponent } from './ng-select.component';
import { KeyCode, NgOption } from './ng-select.types';

describe('NgSelectComponent', function () {

    describe('Model changes', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="this"
                        [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('should update app model value', () => {
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            fixture.detectChanges();

            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);
        });
    });

    describe('Keyboard events', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="id"
                        [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('should open dropdown on space click', () => {
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);

            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });

        it('should select next value on arrow down', () => {
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);

            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
        });

        it('should select first value on arrow down when current selected value is last', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowDown);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            });
        });

        it('should select previous value on arrow up', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowUp);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            });

        });

        it('should select last value on arrow up when current selected value is first', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.ArrowUp);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[2]);
            });
        });

    });

    describe('Custom display template', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ang-display-tmp let-item="item">
                        <div class="custom-header">{{item.name}}</div>
                    </ng-template>
                </ng-select>`);
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
                `<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ang-option-tmp let-item="item">
                        <div class="custom-option">{{item.name}}</div>
                    </ng-template>
                </ng-select>`);
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
                `<ng-select [items]="cities"
                    bindLabel="name"
                    bindValue="id"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('should display then no selected value', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.ng-select-placeholder')).nativeElement;
                expect(el.innerText).toBe('select value');
            });
        }));

        it('should not display then selected value', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.ng-select-placeholder'));
                expect(el).toBeNull();
            });
        }));
    });

    describe('Search', () => {
        let fixture: ComponentFixture<AngSelectSearch>;

        it('should filter items with default filter', async(() => {
            fixture = createTestingModule(
                AngSelectSearch,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    bindValue="id"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.detectChanges();
            fixture.componentInstance.select.onFilter({target: {value: 'vilnius'}});

            expect(fixture.componentInstance.select.itemsList.filteredItems).toEqual([{id: 1, name: 'Vilnius'}]);
        }));

        it('should filter items with custom filter function', async(() => {
            fixture = createTestingModule(
                AngSelectSearch,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    bindValue="id"
                    [filterFunc]="customFilterFunc"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.detectChanges();
            fixture.componentInstance.select.onFilter({target: {value: 'no matter'}});

            expect(fixture.componentInstance.select.itemsList.filteredItems).toEqual([{id: 3, name: 'Pabrade'}]);
        }));

    });

});

function getNgSelectElement(fixture: ComponentFixture<any>): DebugElement {
    return fixture.debugElement.query(By.css('ng-select'));
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
        imports: [FormsModule, NgSelectModule],
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
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pabrade'},
    ];
}

@Component({
    template: `
    `
})
class AngSelectSearch {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        {id: 1, name: 'Vilnius'},
        {id: 2, name: 'Kaunas'},
        {id: 3, name: 'Pabrade'},
    ];

    customFilterFunc(term: string) {
        return (item: NgOption) => {
            return item.id === 3;
        };
    }
}
