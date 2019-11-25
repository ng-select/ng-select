import { NgSelectConfig } from './config.service';
import { ItemsList } from './items-list';
import { NgSelectComponent } from './ng-select.component';
import { DefaultSelectionModel } from './selection-model';

describe('ItemsList', () => {
    describe('select', () => {
        describe('single', () => {
            let list: ItemsList;
            beforeEach(() => {
                const cmp = ngSelectFactory();
                cmp.bindLabel = 'label';
                list = itemsListFactory(cmp);
            });

            it('should add only one item to selected items', () => {
                list.select({ value: 'val' });
                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].value).toBe('val');

                list.select({ value: 'val2' });
                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].value).toBe('val2');
            });
        });

        describe('multiple', () => {
            let list: ItemsList;
            let cmp: NgSelectComponent;
            beforeEach(() => {
                cmp = ngSelectFactory();
                cmp.multiple = true;
                cmp.bindLabel = 'label';
                list = itemsListFactory(cmp);
            });

            it('should add item to selected items', () => {
                list.select({ value: 'val' });
                expect(list.selectedItems.length).toBe(1);

                list.select({ value: 'val2' });
                expect(list.selectedItems.length).toBe(2);
            });

            it('should skip when item already selected', () => {
                list.select({ selected: true });

                expect(list.selectedItems.length).toBe(0);
            });

            it('should select only group item when at least one child was selected and then group item was selected', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' }
                ]);
                list.select(list.items[1]); // K1
                list.select(list.items[0]); // G1

                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0]).toBe(list.items[0]);
            });

            it('should items from different groups', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    // G1
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                    // G2
                    { label: 'K3', val: 'V3', groupKey: 'G2' },
                    { label: 'K4', val: 'V4', groupKey: 'G2' }
                ]);

                list.select(list.items[0]); // K1
                list.select(list.items[4]); // K3

                expect(list.selectedItems.length).toBe(2);
            });

            
            it('should not select disabled items when selecting group', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1', disabled: true }
                ]);
                list.select(list.items[0]); // G1

                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].label).toBe('K1');
            });

            it('should select group when disabled items are selected', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1', disabled: true }
                ]);
                list.select(list.items[2]) // K2
                list.select(list.items[0]); // G1

                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].label).toBe('G1');
            });


            it('should remove item from filtered items when hideSelected=true', () => {
                cmp.hideSelected = true;
                list.setItems([
                    { label: 'K1', val: 'V1' },
                    { label: 'K2', val: 'V2' },
                    { label: 'K3', val: 'V3' },
                    { label: 'K4', val: 'V4' }
                ]);

                list.select(list.items[0]);
                list.select(list.items[1]);

                expect(list.filteredItems.length).toBe(2);
            });

            it('should remove group from filtered items when hideSelected=true and all child group items are selected', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    // G1
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                    // G2
                    { label: 'K3', val: 'V3', groupKey: 'G2' },
                    { label: 'K4', val: 'V4', groupKey: 'G2' }
                ]);
                list.select(list.items[1]); // K1
                list.select(list.items[2]); // K2

                expect(list.filteredItems.length).toBe(3);
            });

            it('should remove all group and group children items if group is selected when hideSelected=true', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    // G1
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                    // G2
                    { label: 'K3', val: 'V3', groupKey: 'G2' },
                    { label: 'K4', val: 'V4', groupKey: 'G2' }
                ]);
                list.select(list.items[1]); // K1
                list.select(list.items[0]); // G1

                expect(list.filteredItems.length).toBe(3); // should contain only second group items
            });

            it('should remove all children items if group is selected when hideSelected=true and filter is used', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' }
                ]);
                list.filter('K');
                list.select(list.items[0]); // G1

                expect(list.filteredItems.length).toBe(0); // remove all items since group was selected
            });

            describe('group as model', () => {
                beforeEach(() => {
                    cmp.selectableGroupAsModel = false;
                    cmp.groupBy = 'groupKey';
                    list.setItems([
                        { label: 'K1', val: 'V1', groupKey: 'G1' },
                        { label: 'K2', val: 'V2', groupKey: 'G1' },
                        { label: 'K3', val: 'V3', groupKey: 'G2'},
                        { label: 'K4', val: 'V4', groupKey: 'G2', disabled: true},
                    ]);
                });

                it('should select all group children', () => {
                    list.select(list.items[0]);
                    expect(list.selectedItems.length).toBe(2);
                    expect(list.selectedItems[0].label).toBe('K1');
                    expect(list.selectedItems[1].label).toBe('K2');
                });

                it('should select all group children when child already selected', () => {
                    list.select(list.items[1]);
                    list.select(list.items[0]);
                    expect(list.selectedItems.length).toBe(2);
                    expect(list.selectedItems[0].label).toBe('K1');
                    expect(list.selectedItems[1].label).toBe('K2');
                });

                it('should not select disabled items', () => {
                    list.select(list.items[3]); // G2
                    expect(list.selectedItems.length).toBe(1);
                    expect(list.selectedItems[0].label).toBe('K3');
                });
            })
        });
    });

    describe('un-select', () => {
        describe('single', () => {
            let list: ItemsList;
            let cmp: NgSelectComponent;
            beforeEach(() => {
                cmp = ngSelectFactory();
                cmp.bindLabel = 'label';
                list = itemsListFactory(cmp);
            });
            it('should un-select selected item', () => {
                list.setItems([
                    { label: 'K1', val: 'V1' }
                ]);

                list.select(list.items[0]);
                list.unselect(list.items[0]);

                expect(list.selectedItems.length).toBe(0);
            });
        });

        describe('multiple', () => {
            let list: ItemsList;
            let cmp: NgSelectComponent;
            beforeEach(() => {
                cmp = ngSelectFactory();
                cmp.multiple = true;
                cmp.bindLabel = 'label';
                list = itemsListFactory(cmp);
            });

            it('should un-select selected items', () => {
                list.setItems([
                    { label: 'K1', val: 'V1' },
                    { label: 'K2', val: 'V2' },
                ]);

                list.select(list.items[0]);
                list.select(list.items[1]);
                list.unselect(list.items[0]);
                list.unselect(list.items[1]);

                expect(list.selectedItems.length).toBe(0);
            });

            it('should un-select grouped selected item', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                ]);

                list.select(list.items[1]); // K1
                list.select(list.items[2]); // K2
                list.unselect(list.items[1]);

                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0]).toBe(list.items[2]);
            });

            it('should un-select grouped selected item when group was selected', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                ]);

                list.select(list.items[0]); // G1
                list.unselect(list.items[1]); // K1

                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].label).toBe(list.items[2].label); // should select only K2
            });

            it('should not unselect disabled items within a group', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1', disabled: true },
                    { label: 'K3', val: 'V3', groupKey: 'G2' },
                    { label: 'K4', val: 'V4', groupKey: 'G2', disabled: true },
                ]);

                list.select(list.findByLabel('K2'));
                list.select(list.findByLabel('K4'));
                list.select(list.findByLabel('G1'));
                list.select(list.findByLabel('G2'));
                expect(list.selectedItems.length).toBe(2);
                expect(list.selectedItems[0].label).toBe('G1');
                expect(list.selectedItems[1].label).toBe('G2');

                list.unselect(list.findByLabel('G1'));
                expect(list.selectedItems.length).toBe(2);
                expect(list.selectedItems[0].label).toBe('G2');
            });

            it('should not unselect disabled items within a group (groupAsModel=false)', () => {
                cmp.groupBy = 'groupKey';
                cmp.selectableGroupAsModel = false;
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1', disabled: true },
                ]);

                list.select(list.items[2]); // K2
                list.select(list.items[0]); // G1
                expect(list.selectedItems.length).toBe(2);
                expect(list.selectedItems.find(x => x.label === 'K1')).toBeDefined();
                expect(list.selectedItems.find(x => x.label === 'K2')).toBeDefined();

                list.unselect(list.items[0]); // G1
                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].label).toBe('K2');
            });

            it('should not affect disabled items when un-selecting a group', () => {
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                    { label: 'K3', val: 'V3', groupKey: 'G1', disabled: true },
                ]);

                list.select(list.items[0]); // G1
                list.unselect(list.items[1]); // K1
                expect(list.selectedItems.length).toBe(1);
                expect(list.selectedItems[0].label).toBe('K2');
            });

            it('should un-select selected item and insert it back to filtered items list when hideSelected=true', () => {
                cmp.hideSelected = true;
                list.setItems([
                    { label: 'K1', val: 'V1' },
                    { label: 'K2', val: 'V2' },
                ]);

                list.select(list.items[0]);
                list.unselect(list.items[0]);

                expect(list.filteredItems.length).toBe(2);
            });

            it('should un-select selected group and insert it back to filtered items when hideSelected=true', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' }
                ]);

                list.select(list.items[0]);
                expect(list.filteredItems.length).toBe(0);
                list.unselect(list.items[0]);
                expect(list.filteredItems.length).toBe(3);
            });

            it('should un-select selected item and insert it back to filtered items with parent group when hideSelected=true', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' }
                ]);

                list.select(list.items[1]);
                expect(list.filteredItems.length).toBe(0);
                list.unselect(list.items[1]);
                expect(list.filteredItems.length).toBe(2);
            });

            it('should not inserted unselected group parent item to filtered items if it is already exists', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    // G1
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' },
                    // G2
                    { label: 'K3', val: 'V3', groupKey: 'G2' },
                    { label: 'K4', val: 'V4', groupKey: 'G2' },
                ]);

                list.select(list.items[1]);
                list.select(list.items[2]);
                list.select(list.items[4]);
                list.unselect(list.items[1]);
                list.unselect(list.items[2]);

                expect(list.filteredItems.length).toBe(5);
                expect(list.selectedItems.length).toBe(1);
            });
        });
    });

    describe('filter', () => {
        let list: ItemsList;
        let cmp: NgSelectComponent;
        beforeEach(() => {
            cmp = ngSelectFactory();
            cmp.bindLabel = 'label';
            list = itemsListFactory(cmp);
        });

        it('should find item from items list', () => {
            list.setItems([
                { label: 'K1 part1 part2', val: 'V1' },
                { label: 'K2 part1 part2', val: 'V2' },
                { label: 'K3 part1 part2.2', val: 'V3' },
                { label: 'K4 part1 part2.2', val: 'V4' },
                { label: 'K5 part1 part2.2 part3', val: 'V5' },
            ]);

            list.filter('part1');
            expect(list.filteredItems.length).toBe(5);

            list.filter('part2.2');
            expect(list.filteredItems.length).toBe(3);

            list.filter('part3');
            expect(list.filteredItems.length).toBe(1);

            list.filter('nope');
            expect(list.filteredItems.length).toBe(0);
        });

        it('should find item from grouped items list', () => {
            cmp.groupBy = 'groupKey';
            list.setItems([
                // G1 group
                { label: 'K1 part1 part2', val: 'V1', groupKey: 'G1' },
                { label: 'K2 part1 part2', val: 'V2', groupKey: 'G1' },
                // G2 group
                { label: 'K3 part1 part2.2', val: 'V3', groupKey: 'G2' },
                { label: 'K4 part1 part2.2', val: 'V4', groupKey: 'G2' },
                { label: 'K5 part1 part2.2 part3', val: 'V5', groupKey: 'G2' },
            ]);

            list.filter('part1');
            expect(list.filteredItems.length).toBe(7); // 5 items + 2 groups

            list.filter('part2.2');
            expect(list.filteredItems.length).toBe(4); // 3 item + 1 group

            list.filter('part3');
            expect(list.filteredItems.length).toBe(2); // 1 item + 1 group

            list.filter('nope');
            expect(list.filteredItems.length).toBe(0);
        });

        it('should exclude child item if its parent is already selected when hideSelected=true', () => {
            cmp.groupBy = 'groupKey';
            cmp.hideSelected = true;
            list.setItems([
                { label: 'K1', val: 'V1', groupKey: 'G1' },
                { label: 'K2', val: 'V2', groupKey: 'G1' },
            ]);

            list.select(list.items[0]); // select group;
            list.filter('K1');
            expect(list.filteredItems.length).toBe(0);
        });
    });

    describe('map selected', () => {
        let list: ItemsList;
        let cmp: NgSelectComponent;
        beforeEach(() => {
            cmp = ngSelectFactory();
            cmp.multiple = true;
            cmp.bindLabel = 'name';
            cmp.bindValue = 'name';
            cmp.groupBy = 'country';
            cmp.selectableGroupAsModel = false;
            list = itemsListFactory(cmp);
        });

        it('should map selected items from items', () => {
            list.select(list.mapItem({ name: 'Adam' }, null));
            list.select(list.mapItem({ name: 'Samantha' }, null));
            list.select(list.mapItem({ name: 'Amalie' }, null));

            list.setItems([
                { name: 'Adam', country: 'United States' },
                { name: 'Samantha', country: 'United States' },
                { name: 'Amalie', country: 'Argentina' }]);

            list.mapSelectedItems();

            expect(list.selectedItems.length).toBe(3);
            expect(list.selectedItems[0].parent.label).toBe('United States');
            expect(list.selectedItems[0].selected).toBeTruthy();
            expect(list.items[0].label).toBe('United States');
            expect(list.items[0].selected).toBeTruthy();
        });

        it('should retain items order', () => {
            list.select(list.mapItem({ name: 'Samantha' }, null));
            list.select(list.mapItem({ name: 'Other' }, null));
            list.select(list.mapItem({ name: 'Amalie' }, null));

            list.setItems([
                { name: 'Samantha', country: 'United States' },
                { name: 'Amalie', country: 'Argentina' }]);

            list.mapSelectedItems();

            expect(list.selectedItems.length).toBe(3);
            expect(list.selectedItems[0].label).toBe('Samantha');
            expect(list.selectedItems[1].label).toBe('Other');
            expect(list.selectedItems[2].label).toBe('Amalie');
        });
    });

    describe('markSelectedOrDefault', () => {
        let list: ItemsList;
        let cmp: NgSelectComponent;

        beforeEach(() => {
            cmp = ngSelectFactory();
            list = itemsListFactory(cmp);
            const items = Array.from(Array(30)).map((_, index) => (`item-${index}`));
            list.setItems(items);
        });

        it('should mark first item', () => {
            list.markSelectedOrDefault(true);
            expect(list.markedIndex).toBe(0);
        });

        it('should keep marked item if it is above last selected item', () => {
            list.select(list.items[10]);
            list.markSelectedOrDefault();
            expect(list.markedIndex).toBe(10);

            list.markNextItem();
            list.markNextItem();
            list.markNextItem();
            list.markSelectedOrDefault();
            expect(list.markedIndex).toBe(13);
        });

        it('should mark first after last marked item was filtered out', () => {
            list.markSelectedOrDefault(true);
            list.markNextItem();
            list.filter('item-0');
            list.markSelectedOrDefault(true);
            expect(list.markedIndex).toBe(0);
            list.markNextItem();
            expect(list.markedIndex).toBe(0);
        });
    });

    function itemsListFactory(cmp: NgSelectComponent): ItemsList {
        return new ItemsList(cmp, new DefaultSelectionModel());
    }

    function ngSelectFactory(): NgSelectComponent {
        return new NgSelectComponent(null, null, new NgSelectConfig(), () => new DefaultSelectionModel(), {} as any, null, null);
    }
});
