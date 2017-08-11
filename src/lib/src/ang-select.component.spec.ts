import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, ViewChild, Type } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';

import { AngSelectModule } from './ang-select.module';
import { AngSelectComponent, Key } from './ang-select.component';

describe('AngSelectComponent', function () {

    describe('Dropdown container click', () => {
        let fixture: ComponentFixture<AngSelectBasic>;
        let trigger: HTMLElement;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" 
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ang-select>`);
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

    describe('Model changes', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" 
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ang-select>`);
        });

        it('should update app model value', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowDown);
            fixture.detectChanges();

            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);
        });

        it('should update select model value', () => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[2]);
            });
        });
    });

    describe('Keyboard events', () => {
        let fixture: ComponentFixture<AngSelectBasic>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectBasic,
                `<ang-select [items]="cities" 
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ang-select>`);
        });

        it('should open dropdown on space click', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), Key.Space);

            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });

        it('should select next value on arrow down', () => {
            triggerKeyDownEvent(getAngSelectElement(fixture), Key.ArrowDown);

            expect(fixture.componentInstance.select.selectedItem).toEqual(fixture.componentInstance.cities[0]);
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
                const el = fixture.debugElement.query(By.css('.custom-header')).nativeElement;
                expect(el).not.toBeNull();
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
            const trigger = fixture.debugElement.query(By.css('.ang-select-container')).nativeElement;
            trigger.click();
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

    fdescribe('Search', () => {
        let fixture: ComponentFixture<AngSelectSearch>;

        beforeEach(() => {
            fixture = createTestingModule(
                AngSelectSearch,
                `<ang-select [items]="cities" 
                    bindLabel="name"
                    allowSearch="true"
                    [(ngModel)]="selectedCity">
                </ang-select>`);
        });

        it('should show search input when panel is opened', async(() => {
            fixture.componentInstance.select.isOpen = true;
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const searchInput = fixture.debugElement.query(By.css('.search-input-container')).nativeElement;
                expect(searchInput).toBeDefined();
            });
        }));

        it('should filter by search input value', async(() => {
            fixture.detectChanges();

            fixture.componentInstance.select.onSearch({target: {value: 'vilnius'}});
            fixture.componentInstance.select.open();

            fixture.whenStable().then(() => {
                const angOptions = fixture.debugElement.queryAll(By.css('.ang-option'));
                expect(angOptions.length).toBe(1);
                expect(angOptions[0].nativeElement.innerText).toBe('Vilnius');
            });
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
    template: `
    `
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
}
