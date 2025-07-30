import { fakeAsync, TestBed } from '@angular/core/testing';
import { ItemsList } from './items-list';
import { NgSelectComponent } from './ng-select.component';
import { DefaultSelectionModel } from './selection-model';
import { ComponentRef } from '@angular/core';
import { provideNgSelect } from './ng-select.module';

describe('ItemsList', () => {
	describe('select', () => {
		describe('single', () => {
			let list: ItemsList;
			beforeEach(async () => {
				const { component, componentRef } = await ngSelectFactory();
				componentRef.setInput('bindLabel', 'label');
				list = itemsListFactory(component);
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
			let cmpRef: ComponentRef<NgSelectComponent>;
			beforeEach(async () => {
				const { component, componentRef } = await ngSelectFactory();
				cmp = component;
				cmpRef = componentRef;
				componentRef.setInput('multiple', true);
				componentRef.setInput('bindLabel', 'label');
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
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1' },
				]);
				list.select(list.items[1]); // K1
				list.select(list.items[0]); // G1

				expect(list.selectedItems.length).toBe(1);
				expect(list.selectedItems[0]).toBe(list.items[0]);
			});

			it('should mark first item when last item has being selected', () => {
				list.setItems([
					{ label: 'T1', val: 'V1' },
					{ label: 'T2', val: 'V2' },
					{ label: 'T3', val: 'V3' },
				]);
				const lastIndex = list.items.length - 1;
				list.markNextItem();
				list.markNextItem();
				list.markNextItem();
				list.select(list.items[lastIndex]); // 1
				list.markNextItem();
				expect(list.selectedItems.length).toBe(1);
				expect(list.markedIndex).toBe(0);
			});

			it('should items from different groups', () => {
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					// G1
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1' },
					// G2
					{ label: 'K3', val: 'V3', groupKey: 'G2' },
					{ label: 'K4', val: 'V4', groupKey: 'G2' },
				]);

				list.select(list.items[0]); // K1
				list.select(list.items[4]); // K3

				expect(list.selectedItems.length).toBe(2);
			});

			it('should not select disabled items when selecting group', () => {
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1', disabled: true },
				]);
				list.select(list.items[0]); // G1

				expect(list.selectedItems.length).toBe(1);
				expect(list.selectedItems[0].label).toBe('K1');
			});

			it('should select group when disabled items are selected', () => {
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1', disabled: true },
				]);
				list.select(list.items[2]); // K2
				list.select(list.items[0]); // G1

				expect(list.selectedItems.length).toBe(1);
				expect(list.selectedItems[0].label).toBe('G1');
			});

			it('should remove item from filtered items when hideSelected=true', () => {
				cmpRef.setInput('hideSelected', true);
				list.setItems([
					{ label: 'K1', val: 'V1' },
					{ label: 'K2', val: 'V2' },
					{ label: 'K3', val: 'V3' },
					{ label: 'K4', val: 'V4' },
				]);

				list.select(list.items[0]);
				list.select(list.items[1]);

				expect(list.filteredItems.length).toBe(2);
			});

			it('should remove group from filtered items when hideSelected=true and all child group items are selected', () => {
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					// G1
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1' },
					// G2
					{ label: 'K3', val: 'V3', groupKey: 'G2' },
					{ label: 'K4', val: 'V4', groupKey: 'G2' },
				]);
				list.select(list.items[1]); // K1
				list.select(list.items[2]); // K2

				expect(list.filteredItems.length).toBe(3);
			});

			it('should remove all group and group children items if group is selected when hideSelected=true', () => {
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					// G1
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1' },
					// G2
					{ label: 'K3', val: 'V3', groupKey: 'G2' },
					{ label: 'K4', val: 'V4', groupKey: 'G2' },
				]);
				list.select(list.items[1]); // K1
				list.select(list.items[0]); // G1

				expect(list.filteredItems.length).toBe(3); // should contain only second group items
			});

			it('should remove all children items if group is selected when hideSelected=true and filter is used', () => {
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1' },
				]);
				list.filter('K');
				list.select(list.items[0]); // G1

				expect(list.filteredItems.length).toBe(0); // remove all items since group was selected
			});

			describe('group as model', () => {
				beforeEach(() => {
					cmpRef.setInput('selectableGroupAsModel', false);
					cmpRef.setInput('groupBy', 'groupKey');
					list.setItems([
						{ label: 'K1', val: 'V1', groupKey: 'G1' },
						{ label: 'K2', val: 'V2', groupKey: 'G1' },
						{ label: 'K3', val: 'V3', groupKey: 'G2' },
						{ label: 'K4', val: 'V4', groupKey: 'G2', disabled: true },
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
			});
		});
	});

	describe('un-select', () => {
		describe('single', () => {
			let list: ItemsList;
			let cmp: NgSelectComponent;
			beforeEach(async () => {
				const { component, componentRef } = await ngSelectFactory();
				cmp = component;
				list = itemsListFactory(cmp);
			});
			it('should un-select selected item', () => {
				list.setItems([{ label: 'K1', val: 'V1' }]);

				list.select(list.items[0]);
				list.unselect(list.items[0]);

				expect(list.selectedItems.length).toBe(0);
			});
		});

		describe('multiple', () => {
			let list: ItemsList;
			let cmp: NgSelectComponent;
			let cmpRef: ComponentRef<NgSelectComponent>;
			beforeEach(async () => {
				const { component, componentRef } = await ngSelectFactory();
				cmp = component;
				cmpRef = componentRef;
				componentRef.setInput('multiple', true);
				componentRef.setInput('bindLabel', 'label');
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
				cmpRef.setInput('groupBy', 'groupKey');
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
				cmpRef.setInput('groupBy', 'groupKey');
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
				cmpRef.setInput('groupBy', 'groupKey');
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
				cmpRef.setInput('groupBy', 'groupKey');
				cmpRef.setInput('selectableGroupAsModel', false);
				list.setItems([
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1', disabled: true },
				]);

				list.select(list.items[2]); // K2
				list.select(list.items[0]); // G1
				expect(list.selectedItems.length).toBe(2);
				expect(list.selectedItems.find((x) => x.label === 'K1')).toBeDefined();
				expect(list.selectedItems.find((x) => x.label === 'K2')).toBeDefined();

				list.unselect(list.items[0]); // G1
				expect(list.selectedItems.length).toBe(1);
				expect(list.selectedItems[0].label).toBe('K2');
			});

			it('should not affect disabled items when un-selecting a group', () => {
				cmpRef.setInput('groupBy', 'groupKey');
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
				cmpRef.setInput('hideSelected', true);
				list.setItems([
					{ label: 'K1', val: 'V1' },
					{ label: 'K2', val: 'V2' },
				]);

				list.select(list.items[0]);
				list.unselect(list.items[0]);

				expect(list.filteredItems.length).toBe(2);
			});

			it('should un-select selected group and insert it back to filtered items when hideSelected=true', () => {
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([
					{ label: 'K1', val: 'V1', groupKey: 'G1' },
					{ label: 'K2', val: 'V2', groupKey: 'G1' },
				]);

				list.select(list.items[0]);
				expect(list.filteredItems.length).toBe(0);
				list.unselect(list.items[0]);
				expect(list.filteredItems.length).toBe(3);
			});

			it('should un-select selected item and insert it back to filtered items with parent group when hideSelected=true', () => {
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
				list.setItems([{ label: 'K1', val: 'V1', groupKey: 'G1' }]);

				list.select(list.items[1]);
				expect(list.filteredItems.length).toBe(0);
				list.unselect(list.items[1]);
				expect(list.filteredItems.length).toBe(2);
			});

			it('should not inserted unselected group parent item to filtered items if it is already exists', () => {
				cmpRef.setInput('hideSelected', true);
				cmpRef.setInput('groupBy', 'groupKey');
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
		let cmpRef: ComponentRef<NgSelectComponent>;
		beforeEach(async () => {
			const { component, componentRef } = await ngSelectFactory();
			cmp = component;
			cmpRef = componentRef;
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

		it('should find item from grouped items list', fakeAsync(() => {
			cmpRef.setInput('groupBy', 'groupKey');
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
		}));

		it('should exclude child item if its parent is already selected when hideSelected=true', () => {
			cmpRef.setInput('hideSelected', true);
			cmpRef.setInput('groupBy', 'groupKey');
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
		let cmpRef: ComponentRef<NgSelectComponent>;
		beforeEach(async () => {
			const { component, componentRef } = await ngSelectFactory();
			cmp = component;
			cmpRef = componentRef;
			componentRef.setInput('bindLabel', 'name');
			componentRef.setInput('multiple', true);
			cmpRef.setInput('selectableGroupAsModel', false);
			cmpRef.setInput('groupBy', 'country');
			list = itemsListFactory(cmp);
		});

		it('should map selected items from items', () => {
			list.select(list.mapItem({ name: 'Adam' }, null));
			list.select(list.mapItem({ name: 'Samantha' }, null));
			list.select(list.mapItem({ name: 'Amalie' }, null));

			list.setItems([
				{ name: 'Adam', country: 'United States' },
				{ name: 'Samantha', country: 'United States' },
				{ name: 'Amalie', country: 'Argentina' },
			]);

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
				{ name: 'Amalie', country: 'Argentina' },
			]);

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

		beforeEach(async () => {
			const { component, componentRef } = await ngSelectFactory();
			cmp = component;
			list = itemsListFactory(cmp);
			const items = Array.from(Array(30)).map((_, index) => `item-${index}`);
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

	describe('pre-grouped items', () => {
		describe('parent items without children', () => {
			let list: ItemsList;
			let cmp: NgSelectComponent;
			let cmpRef: ComponentRef<NgSelectComponent>;

			beforeEach(async () => {
				const { component, componentRef } = await ngSelectFactory();
				cmp = component;
				cmpRef = componentRef;
				componentRef.setInput('bindLabel', 'title');
				componentRef.setInput('bindValue', 'id');
				componentRef.setInput('selectableGroup', true);
				componentRef.setInput('selectableGroupAsModel', false);
				componentRef.setInput('groupBy', 'subprojects');
				list = itemsListFactory(cmp);
			});

			it('should render and allow selection of parent items with empty children arrays', () => {
				// Test data simulating the issue - parent item with empty children array
				const projects = [
					{
						id: 'p0',
						title: 'Project 0',
						subprojects: [], // Empty children array
					},
				];

				list.setItems(projects);

				// Should have 1 item: the parent with empty children
				expect(list.items.length).toBe(1);

				// Find the parent item with empty children (Project 0)
				const parentWithoutChildren = list.items.find(item => 
					item.value && item.value.id === 'p0'
				);

				// Parent item should exist
				expect(parentWithoutChildren).toBeDefined();
				
				// Parent item should be selectable (not disabled)
				expect(parentWithoutChildren.disabled).toBe(false);
				
				// Parent should have empty children array
				expect(parentWithoutChildren.children).toEqual([]);

				// Should be able to select the parent item
				list.select(parentWithoutChildren);
				expect(list.selectedItems).toContain(parentWithoutChildren);
				expect(parentWithoutChildren.selected).toBe(true);
			});

			it('should handle multiple parent items with empty children arrays', () => {
				const projects = [
					{
						id: 'p0',
						title: 'Project 0',
						subprojects: [],
					},
					{
						id: 'p2',
						title: 'Project Empty',
						subprojects: [],
					},
					{
						id: 'p1',
						title: 'Project A',
						subprojects: [
							{ title: 'Subproject 1 of A', id: 's1p1' },
						],
					},
				];

				list.setItems(projects);

				// Should have 4 items: 3 parents + 1 subproject
				expect(list.items.length).toBe(4);

				// Find parent items without children
				const emptyParents = list.items.filter(item => 
					item.value && (item.value.id === 'p0' || item.value.id === 'p2')
				);

				expect(emptyParents.length).toBe(2);
				
				// Both should be selectable
				emptyParents.forEach(parent => {
					expect(parent.disabled).toBe(false);
					expect(parent.children).toEqual([]);
				});
			});
		});
	});

	function itemsListFactory(cmp: NgSelectComponent): ItemsList {
		return new ItemsList(cmp, new DefaultSelectionModel());
	}

	async function ngSelectFactory(): Promise<{
		component: NgSelectComponent,
		componentRef: ComponentRef<NgSelectComponent>,
	}> {
		await TestBed.configureTestingModule({
			imports: [NgSelectComponent],
			providers: [
				provideNgSelect(),
			]
		}).compileComponents();

		const fixture = TestBed.createComponent(NgSelectComponent);

		const component = fixture.componentInstance;
		const componentRef = fixture.componentRef;
		fixture.detectChanges();

		return {
			component,
			componentRef,
		}
	}
});
