import { NgSelectComponent } from './ng-select.component';
import { ItemsList } from './items-list';

fdescribe('ItemsList', () => {
    describe('select', () => {
        describe('single', () => {
            let list: ItemsList;
            beforeEach(() => {
                const cmp = ngSelect();
                list = itemsList(cmp);
            });

            it('should add only one item to selected items', () => {
                list.select({ value: 'val' });
                expect(list.value.length).toBe(1);
                expect(list.value[0].value).toBe('val');

                list.select({ value: 'val2' });
                expect(list.value.length).toBe(1);
                expect(list.value[0].value).toBe('val2');
            });
        })

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
                expect(list.value.length).toBe(1);

                list.select({ value: 'val2' });
                expect(list.value.length).toBe(2);
            });

            it('should skip when item already selected', () => {
                list.select({ selected: true });

                expect(list.value.length).toBe(0);
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
                    { label: 'K1', val: 'V1', groupKey: 'K1' },
                    { label: 'K2', val: 'V2', groupKey: 'K1' }
                ]);
                list.select(list.items[1]);
                list.select(list.items[2]);

                expect(list.filteredItems.length).toBe(0);
            });

            it('should remove all children item if group item is selected when hideSelected=true', () => {
                cmp.hideSelected = true;
                cmp.groupBy = 'groupKey';
                list.setItems([
                    { label: 'K1', val: 'V1', groupKey: 'K1' },
                    { label: 'K2', val: 'V2', groupKey: 'K1' }
                ]);
                list.select(list.items[0]);

                expect(list.filteredItems.length).toBe(0);
            });
        });
    });

    fdescribe('unselect', () => {
        let list: ItemsList;
        beforeEach(() => {
            const cmp = ngSelect();
            list = itemsList(cmp);
        });
        describe('single', () => {
            it('should unselect selected item', () => {
                list.setItems([
                    { label: 'K1', val: 'V1' }
                ]);
    
                list.select(list.items[0]);
                list.unselect(list.items[0]);
    
                expect(list.value.length).toBe(0);
            })
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
