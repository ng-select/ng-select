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

    describe('Model change detection', () => {
        it('should update ngModel on value change', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            // select second city
            selectOption(fixture, KeyCode.ArrowDown, 1);

            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.selectedCity).toEqual(jasmine.objectContaining(fixture.componentInstance.cities[1]));

            // clear select
            fixture.componentInstance.select.clear();
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.selectedCity).toEqual(null);
            discardPeriodicTasks();
        }));

        it('should update internal model on ngModel change', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            // select first city
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.selectedItems).toEqual([jasmine.objectContaining(fixture.componentInstance.cities[0])]);

            // clear model
            fixture.componentInstance.selectedCity = null;
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.selectedItems).toEqual([]);
            discardPeriodicTasks();
        }));

        it('should update internal model after it was toggled with *ngIf', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select *ngIf="visible"
                        [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            // select first city
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            tickAndDetectChanges(fixture);

            // toggle to hide/show
            fixture.componentInstance.toggleVisible();
            tickAndDetectChanges(fixture);
            fixture.componentInstance.toggleVisible();
            tickAndDetectChanges(fixture);

            fixture.componentInstance.selectedCity = null;
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.selectedItems).toEqual([]);
        }));

        it('should set items correctly after ngModel set first', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            const cities = [{ id: 7, name: 'Pailgis' }];
            fixture.componentInstance.selectedCity = { id: 7, name: 'Pailgis' };
            tickAndDetectChanges(fixture);
            fixture.componentInstance.cities = cities;
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.selectedItems).toEqual([jasmine.objectContaining(cities[0])]);
        }));

        it('should bind ngModel even if items are empty', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.componentInstance.cities = [];
            tickAndDetectChanges(fixture);

            fixture.componentInstance.selectedCity = { id: 7, name: 'Pailgis' };
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.selectedItems).toEqual([jasmine.objectContaining({ id: 7, name: 'Pailgis' })]);
        }));

        it('should preserve latest selected value when items are changing', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            tickAndDetectChanges(fixture);

            fixture.componentInstance.select.select(fixture.componentInstance.cities[1]);
            tickAndDetectChanges(fixture);

            fixture.componentInstance.cities = [...fixture.componentInstance.cities];
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.selectedCity).toEqual(fixture.componentInstance.cities[1]);

            fixture.componentInstance.select.clear();
            fixture.componentInstance.cities = [...fixture.componentInstance.cities];
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.selectedCity).toBeNull();
        }));

        it('should clear previous value when setting new model', fakeAsync(() => {
            const fixture = createTestingModule(
                NgSelectModelChangesTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [clearable]="true"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            tickAndDetectChanges(fixture);

            const lastSelection: any = fixture.componentInstance.select.selectedItems[0];
            expect(lastSelection.selected).toBeTruthy();

            fixture.componentInstance.selectedCity = null;
            tickAndDetectChanges(fixture);
            expect(lastSelection.selected).toBeFalsy();
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
            tickAndDetectChanges(fixture);
            expect(fixture.componentInstance.selectedCityId).toEqual(1);

            // from model to component
            fixture.componentInstance.selectedCityId = 2;
            tickAndDetectChanges(fixture);
            expect(fixture.componentInstance.select.selectedItems).toEqual([jasmine.objectContaining(fixture.componentInstance.cities[1])]);
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

            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.selectedCity).toEqual(jasmine.objectContaining(fixture.componentInstance.cities[0]));

            // from model to component
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];

            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.selectedItems).toEqual([jasmine.objectContaining(fixture.componentInstance.cities[1])]);
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

                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining({ id: 2, name: 'Kaunas', selected: true })];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should select by bindLabel when binding to object', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedObjectCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining({ id: 2, name: 'Kaunas', selected: true })];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should select by object reference', fakeAsync(() => {
                const fixture = createTestingModule(
                    NgSelectSelectedObjectByRefCmp,
                    `<ng-select [items]="cities"
                        bindLabel="name"
                        placeholder="select value"
                        [(ngModel)]="selectedCity">
                    </ng-select>`);

                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining({ id: 2, name: 'Kaunas', selected: true })];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
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

                tickAndDetectChanges(fixture);
                expect(fixture.componentInstance.select.selectedItems).toEqual([]);
            }));
        });

        describe('multiple', () => {
            const result = [
                jasmine.objectContaining({ id: 2, name: 'Kaunas', selected: true }),
                jasmine.objectContaining({ id: 3, name: 'Pabrade', selected: true })];
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

                tickAndDetectChanges(fixture);

                expect(fixture.componentInstance.select.selectedItems).toEqual(result)
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

                tickAndDetectChanges(fixture);
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
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
                        [multiple]="multiple"
                        [(ngModel)]="selectedCity">
                </ng-select>`);
        });

        describe('space', () => {
            it('should open dropdown', () => {
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
                expect(fixture.componentInstance.select.isOpen).toBe(true);
            });

            it('should open empty dropdown if no items', fakeAsync(() => {
                fixture.componentInstance.cities = [];
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
                tickAndDetectChanges(fixture);
                const text = fixture.debugElement.query(By.css('.ng-option')).nativeElement.innerHTML;
                expect(text).toContain('No items found');
            }));

            it('should open dropdown and mark first item', () => {
                const result = fixture.componentInstance.cities[0];
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
                expect(fixture.componentInstance.select.itemsList.markedItem).toEqual(jasmine.objectContaining(result));
            });
        });

        describe('arrows', () => {
            it('should select next value on arrow down', () => {
                selectOption(fixture, KeyCode.ArrowDown, 1);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[1])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            });

            it('should select first value on arrow down when current value is last', fakeAsync(() => {
                fixture.componentInstance.selectedCity = fixture.componentInstance.cities[2];
                tickAndDetectChanges(fixture);
                selectOption(fixture, KeyCode.ArrowDown, 1);
                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[0])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should skip disabled option and select next one', fakeAsync(() => {
                const city: any = fixture.componentInstance.cities[0];
                city.disabled = true;
                selectOption(fixture, KeyCode.ArrowDown, 1);
                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[1])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should select previous value on arrow up', fakeAsync(() => {
                fixture.componentInstance.selectedCity = fixture.componentInstance.cities[1];
                tickAndDetectChanges(fixture);
                selectOption(fixture, KeyCode.ArrowUp, 1);
                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[0])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should select last value on arrow up', () => {
                selectOption(fixture, KeyCode.ArrowUp, 1);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[2])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            });
        });

        describe('esc', () => {
            it('should close opened dropdown', () => {
                fixture.componentInstance.select.isOpen = true;
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
                expect(fixture.componentInstance.select.isOpen).toBe(false);
            });
        });

        describe('tab', () => {
            it('should close dropdown when there are no items', fakeAsync(() => {
                fixture.componentInstance.select.onFilter({ target: { value: 'random stuff' } });
                tick(200);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
                expect(fixture.componentInstance.select.isOpen).toBeFalsy()
            }));

            it('should close dropdown', () => {
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
                expect(fixture.componentInstance.select.selectedItems).toEqual([]);
                expect(fixture.componentInstance.select.isOpen).toBeFalsy()
            });

            it('should close dropdown and keep selected value', fakeAsync(() => {
                fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Tab);
                tickAndDetectChanges(fixture);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[0])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
                expect(fixture.componentInstance.select.isOpen).toBeFalsy()
            }));
        });

        describe('backspace', () => {
            it('should remove selected value', fakeAsync(() => {
                fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
                expect(fixture.componentInstance.select.selectedItems).toEqual([]);
            }));

            it('should not remove selected value if filter is set', fakeAsync(() => {
                fixture.componentInstance.select.filterValue = 'a';
                fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[0])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should not remove selected value when clearable is false', fakeAsync(() => {
                fixture.componentInstance.select.clearable = false;
                fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[0])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));

            it('should do nothing when there is no selection', fakeAsync(() => {
                const clear = spyOn(fixture.componentInstance.select, 'clear');
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
                expect(clear).not.toHaveBeenCalled();
            }));

            it('should remove last selected value when multiple', fakeAsync(() => {
                fixture.componentInstance.multiple = true;
                fixture.componentInstance.cities = [...fixture.componentInstance.cities];
                tickAndDetectChanges(fixture);
                selectOption(fixture, KeyCode.ArrowDown, 1);
                selectOption(fixture, KeyCode.ArrowDown, 1);
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Backspace);
                const result = [jasmine.objectContaining(fixture.componentInstance.cities[1])];
                expect(fixture.componentInstance.select.selectedItems).toEqual(result);
            }));
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
    });

    describe('Custom templates', () => {
        it('display custom header template', async(() => {
            const fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities" [(ngModel)]="selectedCity">
                    <ng-template ng-label-tmp let-item="item">
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
            tickAndDetectChanges(fixture);
            expect((<NgOption[]>fixture.componentInstance.select.selectedItems).length).toBe(2);
        }));

        it('should toggle selected item', fakeAsync(() => {
            selectOption(fixture, KeyCode.ArrowDown, 0);
            selectOption(fixture, KeyCode.ArrowDown, 2);
            tickAndDetectChanges(fixture);
            expect((<NgOption[]>fixture.componentInstance.select.selectedItems).length).toBe(2);

            selectOption(fixture, KeyCode.ArrowDown, 1);
            tickAndDetectChanges(fixture);
            expect((<NgOption[]>fixture.componentInstance.select.selectedItems).length).toBe(1);
            expect(fixture.componentInstance.select.selectedItems[0].name).toBe('Pabrade');
        }));

        it('should not toggle item on enter when dropdown is closed', () => {
            selectOption(fixture, KeyCode.ArrowDown, 0);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Esc);
            expect((<NgOption[]>fixture.componentInstance.select.selectedItems).length).toBe(1);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect((<NgOption[]>fixture.componentInstance.select.selectedItems).length).toBe(1);
        });
    });

    describe('tagging', () => {
        it('should select default tag', fakeAsync(() => {
            let fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    [addTag]="true"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            tickAndDetectChanges(fixture);
            fixture.componentInstance.select.onFilter({ target: { value: 'new tag' } });
            tickAndDetectChanges(fixture);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect(fixture.componentInstance.selectedCity.name).toBe('new tag');
        }));

        it('should select custom tag', fakeAsync(() => {
            let fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    [addTag]="tagFunc"
                    placeholder="select value"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            tickAndDetectChanges(fixture);
            fixture.componentInstance.select.onFilter({ target: { value: 'custom tag' } });
            tickAndDetectChanges(fixture);
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect(<any>fixture.componentInstance.selectedCity).toEqual(jasmine.objectContaining({
                id: 'custom tag', name: 'custom tag', custom: true
            }));
        }));
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

        it('shoud be visible when no value selected', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.ng-placeholder')).nativeElement;
                expect(el.innerText).toBe('select value');
            });
        }));

        it('should not be visible when value is selected', async(() => {
            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const el = fixture.debugElement.query(By.css('.ng-placeholder'));
                expect(el.nativeElement.hasAttribute('hidden')).toBe(true);
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

            tick(200);
            fixture.componentInstance.select.onFilter({ target: { value: 'vilnius' } });
            tick(200);

            const result = [jasmine.objectContaining({ id: 1, name: 'Vilnius' })];
            expect(fixture.componentInstance.select.itemsList.filteredItems).toEqual(result);
        }));

        it('should mark first item on filter', fakeAsync(() => {
            fixture = createTestingModule(
                NgSelectFilterTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity">
                </ng-select>`);

            tick(200);
            fixture.componentInstance.select.onFilter({ target: { value: 'pab' } });
            tick(200);

            const result = jasmine.objectContaining(fixture.componentInstance.cities[2]);
            expect(fixture.componentInstance.select.itemsList.markedItem).toEqual(result)
            triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
            expect(fixture.componentInstance.select.selectedItems).toEqual([result]);
        }));

        it('should clear filterValue on selected item', fakeAsync(() => {
            fixture = createTestingModule(
                NgSelectFilterTestCmp,
                `<ng-select [items]="cities"
                    bindLabel="name"
                    [(ngModel)]="selectedCity"
                    [multiple]="true">
                </ng-select>`);

            fixture.componentInstance.select.filterValue = 'Hey! Whats up!?';
            selectOption(fixture, KeyCode.ArrowDown, 1);
            tickAndDetectChanges(fixture);
            expect(fixture.componentInstance.select.filterValue).toBe(null);
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
            });

            it('should push term to custom observable', fakeAsync(() => {
                fixture.componentInstance.customFilter.subscribe(term => {
                    expect(term).toBe('vilnius');
                });
                tick(200);
                fixture.componentInstance.select.onFilter({ target: { value: 'vilnius' } });
                tickAndDetectChanges(fixture);
            }));

            it('should mark first item when typeahead results are loaded', fakeAsync(() => {
                fixture.componentInstance.customFilter.subscribe();
                fixture.componentInstance.select.onFilter({ target: { value: 'buk' } });
                fixture.componentInstance.cities = [{ id: 4, name: 'Bukiskes' }];
                tickAndDetectChanges(fixture);
                triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter);
                expect(fixture.componentInstance.select.selectedItems).toEqual([jasmine.objectContaining({ id: 4, name: 'Bukiskes' })])
            }));

            it('should start and stop loading indicator', fakeAsync(() => {
                fixture.componentInstance.customFilter.subscribe();
                fixture.componentInstance.select.onFilter({ target: { value: 'buk' } });
                expect(fixture.componentInstance.select.isLoading).toBeTruthy();
                fixture.componentInstance.cities = [{ id: 4, name: 'Bukiskes' }];
                tickAndDetectChanges(fixture);
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
            tickAndDetectChanges(fixture);

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
            tickAndDetectChanges(fixture);

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
            tickAndDetectChanges(fixture);

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
            tickAndDetectChanges(fixture);

            fixture.componentInstance.select.select(fixture.componentInstance.cities[0]);

            expect(fixture.componentInstance.onChange).toHaveBeenCalledTimes(1);
        }));
    });

    describe('Clear icon click', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;
        let clickIcon: DebugElement = null;

        beforeEach(fakeAsync(() => {
            fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            tickAndDetectChanges(fixture);
            clickIcon = fixture.debugElement.query(By.css('.ng-clear-zone'));
        }));

        it('should clear model on clear icon click', fakeAsync(() => {
            clickIcon.triggerEventHandler('click', { stopPropagation: () => { } });
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.selectedCity).toBe(null);
        }));

        it('should not open dropdown on clear click', fakeAsync(() => {
            clickIcon.triggerEventHandler('click', { stopPropagation: () => { } });
            tickAndDetectChanges(fixture);

            expect(fixture.componentInstance.select.isOpen).toBe(false);
        }));
    });

    describe('Arrow icon click', () => {
        let fixture: ComponentFixture<NgSelectBasicTestCmp>;
        let arrowIcon: DebugElement = null;

        beforeEach(fakeAsync(() => {
            fixture = createTestingModule(
                NgSelectBasicTestCmp,
                `<ng-select [items]="cities"
                        bindLabel="name"
                        [(ngModel)]="selectedCity">
                </ng-select>`);

            fixture.componentInstance.selectedCity = fixture.componentInstance.cities[0];
            tickAndDetectChanges(fixture);
            arrowIcon = fixture.debugElement.query(By.css('.ng-arrow-zone'));
        }));

        it('should toggle dropdown', fakeAsync(() => {
            const clickArrow = () => arrowIcon.triggerEventHandler('click', { stopPropagation: () => { } });
            // open
            clickArrow();
            tickAndDetectChanges(fixture);
            expect(fixture.componentInstance.select.isOpen).toBe(true);

            // close
            clickArrow();
            tickAndDetectChanges(fixture);
            expect(fixture.componentInstance.select.isOpen).toBe(false);

            // open
            clickArrow();
            tickAndDetectChanges(fixture);
            expect(fixture.componentInstance.select.isOpen).toBe(true);
        }));
    });
});

function tickAndDetectChanges(fixture) {
    fixture.detectChanges();
    tick();
}

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
    multiple = false;
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
    ];
    tagFunc(term) {
        return { id: term, name: term, custom: true }
    }
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

    visible = true;
    selectedCity: { id: number; name: string };
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pabrade' },
        { id: 4, name: 'Klaipėda' },
    ];

    toggleVisible() {
        this.visible = !this.visible;
    }
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
