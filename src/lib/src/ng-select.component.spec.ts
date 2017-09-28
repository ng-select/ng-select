import {
    async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { DebugElement, Component, ViewChild, Type, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from './ng-select.module';
import { NgSelectComponent } from './ng-select.component';
import { KeyCode, NgOption } from './ng-select.types';
import { Subject } from 'rxjs/Subject';

describe('NgSelectComponent', function () {

    describe('Model changes', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;

        beforeEach(() => {
            fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('update parent selected model on value change', fakeAsync(() => {
            // select second city
            selectOption(fixture, KeyCode.ArrowDown, 1);

            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[1]);
            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[1]);

            // clear select
            fixture.componentInstance.select.clear();
            fixture.detectChanges();
            tick();
            expect(fixture.componentInstance.selectedCity).toEqual(null);
            discardPeriodicTasks();
        }));

        it('update ng-select value on parent model change', fakeAsync(() => {
            // select first city
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);

            // clear model
            fixture.componentInstance.selectedCity = null;
            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.select.value).toEqual(null);
            discardPeriodicTasks();
        }));
    });

    describe('Model bindings', () => {

        it('bind to custom object properties', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectCustomBindingsTestCmp,
                `<ng-select [items]="cities"
                            bindLabel="name"
                            bindValue="id"
                            [(ngModel)]="selectedCityId">
                </ng-select>`);

            // from component to model
            selectOption(fixture, KeyCode.ArrowDown, 0);

            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.selectedCityId).toEqual(1);

            // from model to component
            fixture.componentInstance.selectedCityId = 2;

            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[1]);
            discardPeriodicTasks();
        }));

        it('bind to object', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                            bindLabel="name"
                            [(ngModel)]="selectedCity">
                </ng-select>`);

            // from component to model
            selectOption(fixture, KeyCode.ArrowDown, 0);

            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[0]);

            // from model to component
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];

            fixture.detectChanges();
            tick();

            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[1]);
            discardPeriodicTasks();
        }));
    });

    describe('Pre-selected model', () => {
        describe('single', () => {
            it('should select by bindValue when primitive type', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedSimpleCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="id"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                fixture.detectChanges();
                tick();
                expect(fixture.componentInstance.select.value).toEqual({ id: 2, name: 'Kaunas', selected: true });
            }));

            it('should select by bindLabel when binding to object', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedObjectCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                fixture.detectChanges();
                tick();
                expect(fixture.componentInstance.select.value).toEqual({ id: 2, name: 'Kaunas', selected: true });
            }));

            it('should select object reference', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedObjectByRefCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                fixture.detectChanges();
                tick();
                expect(fixture.componentInstance.select.value).toEqual({ id: 2, name: 'Kaunas', selected: true })
            }));

            it('should select none when there is no items', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedEmptyCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="id"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                fixture.detectChanges();
                tick();
                expect(fixture.componentInstance.select.value).toBeNull();
            }));
        });

        describe('multiple', () => {
            const result = [{ id: 2, name: 'Kaunas', selected: true }, { id: 3, name: 'Pabrade', selected: true }];
            it('should select by bindValue when primitive type', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedSimpleMultipleCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        bindValue="id"
                        multiple="true"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                fixture.detectChanges();
                tick();

                expect(fixture.componentInstance.select.value).toEqual(result)
            }));

            it('should select by bindLabel when binding to object', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedObjectMultipleCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        multiple="true"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                fixture.detectChanges();
                tick();
                expect(fixture.componentInstance.select.value).toEqual(result);
            }));
        });
    });

    describe('Keyboard events', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;

        beforeEach(() => {
            fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('open dropdown on space click', () => {
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });

        it('should mark first item on open', () => {
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
        });

        it('select next value on arrow down', () => {
            selectOption(fixture, KeyCode.ArrowDown, 1);
            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[1]);
        });

        it('select first value on arrow down when current selected value is last', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                selectOption(fixture, KeyCode.ArrowDown, 1);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            });
        }));

        it('should skip disabled option and select next one', fakeAsync(() => {
            const city: any = fixture.componentInstance.cities[0];
            city.disabled = true;
            selectOption(fixture, KeyCode.ArrowDown, 1);
            fixture.detectChanges();
            tick();
            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[1]);
        }));

        it('select previous value on arrow up', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                selectOption(fixture, KeyCode.ArrowUp, 1);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            });
        }));

        it('select last value on arrow up when current selected value is first', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                selectOption(fixture, KeyCode.ArrowUp, 1);
                expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[2]);
            });
        }));

        it('close opened dropdown on esc click', () => {
            fixture.componentInstance.select.isOpen = true;
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
            expect(fixture.componentInstance.select.isOpen).toBe(false);
        });

        it('should close opened dropdown and select marked value on tab click', () => {
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[0]);
            expect(fixture.componentInstance.select.isOpen).toBeFalsy()
        });
    });

    describe('document:click', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;

        beforeEach(() => {
            fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<button id="close">close</button>
                <ng-select id="select" [items]="cities"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('close dropdown if opened and clicked outside dropdown container', () => {
            fixture.componentInstance.select.isOpen = true;

            document.getElementById('close').click();

            expect(fixture.componentInstance.select.isOpen).toBe(false);
        });

        it('prevent dropdown close if clicked on select', () => {
            fixture.componentInstance.select.isOpen = true;

            document.getElementById('select').click();

            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });

        it('prevent dropdown close if after first open', () => {
            fixture.componentInstance.select.open();

            document.getElementById('close').click();

            expect(fixture.componentInstance.select.isOpen).toBe(true);
        });
    });

    describe('Custom templates', () => {
        it('display custom header template', async(() => {
            const fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ng-display-tmp let-item="item">
                        <div class="custom-header">{{item.name}}</div>
                    </ng-template>
                </ng-select>`);

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.custom-header'));
                expect(el).not.toBeNull();
                expect(el.nativeElement).not.toBeNull();
            });
        }));

        it('display custom dropdown option template', async(() => {

            const fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ng-option-tmp let-item="item">
                        <div class="custom-option">{{item.name}}</div>
                    </ng-template>
                </ng-select>`);

            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.custom-option')).nativeElement;
                expect(el).not.toBeNull();
            });
        }));
    });

    describe('Multiple', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;
        beforeEach(() => {
            fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    bindValue="this"
                    placeholder="select value"
                    [(ngModel)]="selectedCity"
                    [multiple]="true">
                </ng-select>`);
        });

        it('should select several items', fakeAsync(() => {
            selectOption(fixture, KeyCode.ArrowDown, 1);
            selectOption(fixture, KeyCode.ArrowDown, 2);
            detectChanges();
            expect((<NgOption[]>fixture.componentInstance.select.value).length).toBe(2);
        }));

        it('should toggle selected item', fakeAsync(() => {
            selectOption(fixture, KeyCode.ArrowDown, 0);
            selectOption(fixture, KeyCode.ArrowDown, 2);
            detectChanges();
            expect((<NgOption[]>fixture.componentInstance.select.value).length).toBe(2);

            selectOption(fixture, KeyCode.ArrowDown, 1);
            detectChanges();
            expect((<NgOption[]>fixture.componentInstance.select.value).length).toBe(1);
            expect(fixture.componentInstance.select.value[0].name).toBe('Pabrade');
        }));

        it('should not toggle item on enter when dropdown is closed', () => {
            selectOption(fixture, KeyCode.ArrowDown, 0);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
            expect((<NgOption[]>fixture.componentInstance.select.value).length).toBe(1);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect((<NgOption[]>fixture.componentInstance.select.value).length).toBe(1);
        })

        function detectChanges() {
            fixture.detectChanges();
            tick();
        }
    });

    describe('Placeholder', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;

        beforeEach(() => {
            fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        it('display then no selected value', async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.as-placeholder')).nativeElement;
                expect(el.innerText).toBe('select value');
            });
        }));

        it('do not display on selected value', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.as-placeholder'));
                expect(el).toBeNull();
            });
        }));
    });

    describe('Filter', () => {
        let fixture: ComponentFixture<NgSelectFilterTestCmp>;

        it('should filter using default implementation', fakeAsync(() => {
            fixture = createTestingModule(
                NgSelectFilterTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.detectChanges();
            fixture.componentInstance.select.onFilter({ target: { value: 'vilnius' } });
            tick(200);

            expect(fixture.componentInstance.select.itemsList.filteredItems).toEqual([{ id: 1, name: 'Vilnius', marked: true }]);
        }));

        it('should mark first item on filter', fakeAsync(() => {
            fixture = createTestingModule(
                NgSelectFilterTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.detectChanges();
            fixture.componentInstance.select.onFilter({ target: { value: 'pab' } });
            tick(200);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect(fixture.componentInstance.select.value).toEqual(fixture.componentInstance.cities[2])
        }));

        describe('with typeahead', () => {
            beforeEach(() => {
                fixture = createTestingModule(
                    NgSelectFilterTestCmp,
                    `<ng-select [items]="cities"
                        [typeahead]="customFilter"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);
                fixture.detectChanges();
            });

            it('should push term to custom observable', async(() => {
                fixture.componentInstance.customFilter.subscribe(term => {
                    expect(term).toBe('vilnius');
                });
                fixture.componentInstance.select.onFilter({ target: { value: 'vilnius' } });
            }));

            it('should mark first item when typeahead results are loaded', async(() => {
                fixture.componentInstance.customFilter.subscribe();
                fixture.componentInstance.select.onFilter({ target: { value: 'buk' } });
                fixture.componentInstance.cities = [{ id: 4, name: 'Bukiskes' }];
                fixture.detectChanges();
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
                expect(fixture.componentInstance.select.value).toEqual(jasmine.objectContaining({ id: 4, name: 'Bukiskes' }))
            }));

            it('should start and stop loading indicator', async(() => {
                fixture.componentInstance.customFilter.subscribe();
                fixture.componentInstance.select.onFilter({ target: { value: 'buk' } });
                expect(fixture.componentInstance.select.isLoading).toBeTruthy();
                fixture.componentInstance.cities = [{ id: 4, name: 'Bukiskes' }];
                fixture.detectChanges();
                expect(fixture.componentInstance.select.isLoading).toBeFalsy();
            }));
        });
    });

    describe('Output events', () => {
        it('fire open event once', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectEventsTestCmp,
                `<ng-select [items]="cities"
                            (open)="onOpen()"
                            [(ngModel)]="selectedCity">
                </ng-select>`);

            spyOn(fixture.componentInstance, 'onOpen');

            fixture.componentInstance.select.open();
            fixture.componentInstance.select.open();
            tick();

            expect(fixture.componentInstance.onOpen).toHaveBeenCalledTimes(1);
        }));

        it('fire close event once', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectEventsTestCmp,
                `<ng-select [items]="cities"
                            (close)="onClose()"
                            [(ngModel)]="selectedCity">
                </ng-select>`);

            spyOn(fixture.componentInstance, 'onClose');

            fixture.componentInstance.select.open();
            fixture.componentInstance.select.close();
            fixture.componentInstance.select.close();
            tick();

            expect(fixture.componentInstance.onClose).toHaveBeenCalledTimes(1);
        }));

        it('fire change when changed', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectEventsTestCmp,
                `<ng-select [items]="cities"
                            (change)="onChange()"
                            [(ngModel)]="selectedCity">
                </ng-select>`);

            spyOn(fixture.componentInstance, 'onChange');

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();
            tick();

            fixture.componentInstance.select.select(fixture.componentInstance.cities[1]);

            expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
        }));

        it('do not fire change when item not changed', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectEventsTestCmp,
                `<ng-select [items]="cities"
                            (change)="onChange()"
                            [(ngModel)]="selectedCity">
                </ng-select>`);

            spyOn(fixture.componentInstance, 'onChange');

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();
            tick();

            fixture.componentInstance.select.select(fixture.componentInstance.cities[0]);

            expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(0);
        }));
    });
});

function selectOption(fixture, key: KeyCode, steps: number) {
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space); // open
    for (let i = 0; i < steps; i++) {
        triggerKeyDownEvent(getNgSelectElement(fixture), key);
    }
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter); // select
}

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
        declarations: [
            NgSelectBasicTestCmp,
            NgSelectFilterTestCmp,
            NgSelectModelChangesTestCmp,
            NgSelectCustomBindingsTestCmp,
            NgSelectSelectedSimpleCmp,
            NgSelectSelectedObjectCmp,
            NgSelectSelectedObjectByRefCmp,
            NgSelectSelectedSimpleMultipleCmp,
            NgSelectSelectedObjectMultipleCmp,
            NgSelectSelectedEmptyCmp,
            NgSelectEventsTestCmp
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
    template: ``
})
class NgSelectBasicTestCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
}

@Component({
    template: ``
})
class NgSelectSelectedSimpleCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity = 2;
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
}

@Component({
    template: ``
})
class NgSelectSelectedEmptyCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity = 2;
    cities = [];
}

@Component({
    template: ``
})
class NgSelectSelectedSimpleMultipleCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity = [2, 3];
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
}

@Component({
    template: ``
})
class NgSelectSelectedObjectMultipleCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity = [{ id: 2, name: 'Kaunas' }, { id: 3, name: 'Pabrade' }];
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
}

@Component({
    template: ``
})
class NgSelectSelectedObjectCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity = { id: 2, name: 'Kaunas' };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
}

@Component({
    template: ``
})
class NgSelectSelectedObjectByRefCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
    selectedCity = this.cities[1];
}

@Component({
    template: ``
})
class NgSelectCustomBindingsTestCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCityId: number;
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
        { id: 4, name: 'Klaipėda' },
    ];
}

@Component({
    template: ``,
    changeDetection: ChangeDetectionStrategy.Default
})
class NgSelectModelChangesTestCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
        { id: 4, name: 'Klaipėda' },
    ];
}

@Component({
    template: ``
})
class NgSelectFilterTestCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];

    customFilter = new Subject<string>();
}

@Component({
    template: ``
})
class NgSelectEventsTestCmp {
    @ViewChild(NgSelectComponent) select: NgSelectComponent;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];

    onChange($event) {
    }

    onFocus($event: Event) {
    }

    onBlur($event: Event) {
    }

    onOpen() {
    }

    onClose() {
    }
}
