import { NgSelectComponent } from './ng-select.component';
import { ItemsList } from './items-list';

describe('ItemsList', () => {
    describe('select', () => {
        describe('single', () => {
            let list: ItemsList;
            beforeEach(() => {
                const cmp = ngSelect();
                list = itemsList(cmp);
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
                cmp = ngSelect();
                cmp.multiple = true;
                cmp.bindLabel = 'label';
                list = itemsList(cmp);
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

            it('should remove gouped item from filtered items when hideSelected=true and all child items are selected', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' }
                ]);
                list.select(list.items[1]); // K1
                list.select(list.items[2]); // K2

                expect(list.filteredItems.length).toBe(0); // remove all items since all child items was selected
                expect(list.selectedItems.length).toBe(2);
            });

            it('should remove all children items if group item is selected when hideSelected=true', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'G1' },
                    { label: 'K2', val: 'V2', groupKey: 'G1' }
                ]);
                list.select(list.items[1]); // K1
                list.select(list.items[0]); // G1

                expect(list.filteredItems.length).toBe(0); // remove all items since group was selected
            });

            it('should remove all children items if group item is selected when hideSelected=true and filter is used', () => {
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
        });
    });

    describe('unselect', () => {
        describe('single', () => {
            let list: ItemsList;
            let cmp: NgSelectComponent;
            beforeEach(() => {
                cmp = ngSelect();
                list = itemsList(cmp);
            });
            it('should unselect selected item', () => {
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
                cmp = ngSelect();
                cmp.multiple = true;
                list = itemsList(cmp);
            });

            it('should unselect selected items', () => {
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

            it('should unselect selected item and insert it back to filtered items list when hideSelected=true', () => {
                cmp.hideSelected = true;
                list.setItems([
                    { label: 'K1', val: 'V1' },
                    { label: 'K2', val: 'V2' },
                ]);

                list.select(list.items[0]);
                list.unselect(list.items[0]);

                expect(list.filteredItems.length).toBe(2);
            });

            it('should unselect selected group and insert it back to filtered items with child items when hideSelected=true', () => {
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

            it('should unselect selected item and insert it back to filtered with item parent group items when hideSelected=true', () => {
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

            it('should not inserted unselected group parent item to filtered items if it is already exsists', () => {
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
            cmp = ngSelect();
            list = itemsList(cmp);
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
});

function itemsList(cmp: NgSelectComponent): ItemsList {
    return new ItemsList(cmp);
}

function ngSelect(): NgSelectComponent {
    const cmp = new NgSelectComponent({}, null, null, null, null);
    return cmp;
}
