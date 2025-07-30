import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgSelectCdkComponent } from './ng-select-cdk.component';
import { NgSelectConfig } from './config.service';
import { ConsoleService } from './console.service';

describe('NgSelectCdkComponent', () => {
	let component: NgSelectCdkComponent;
	let fixture: ComponentFixture<NgSelectCdkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NgSelectCdkComponent, ReactiveFormsModule],
			providers: [NgSelectConfig, ConsoleService]
		}).compileComponents();

		fixture = TestBed.createComponent(NgSelectCdkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should implement ControlValueAccessor', () => {
		expect(component.writeValue).toBeDefined();
		expect(component.registerOnChange).toBeDefined();
		expect(component.registerOnTouched).toBeDefined();
		expect(component.setDisabledState).toBeDefined();
	});

	it('should initialize with empty selection', () => {
		expect(component.selectedItems).toEqual([]);
		expect(component.hasValue).toBeFalsy();
	});

	it('should handle items input', () => {
		const items = ['option1', 'option2', 'option3'];
		component.items.set(items);
		component.ngOnChanges({ items: { currentValue: items, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
		
		expect(component.itemsList.items.length).toBeGreaterThan(0);
	});

	it('should open and close dropdown', () => {
		expect(component.isOpen()).toBeFalsy();
		
		component.open();
		expect(component.isOpen()).toBeTruthy();
		
		component.close();
		expect(component.isOpen()).toBeFalsy();
	});

	it('should select and unselect items', () => {
		const items = ['option1', 'option2'];
		component.items.set(items);
		component.ngOnChanges({ items: { currentValue: items, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
		
		const firstItem = component.itemsList.items[0];
		expect(firstItem.selected).toBeFalsy();
		
		component.select(firstItem);
		expect(firstItem.selected).toBeTruthy();
		expect(component.hasValue).toBeTruthy();
		
		component.unselect(firstItem);
		expect(firstItem.selected).toBeFalsy();
		expect(component.hasValue).toBeFalsy();
	});

	it('should filter items', () => {
		const items = ['apple', 'banana', 'cherry'];
		component.items.set(items);
		component.ngOnChanges({ items: { currentValue: items, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
		
		component.filter('ap');
		expect(component.itemsList.filteredItems.length).toBe(1);
		expect(component.itemsList.filteredItems[0].label).toBe('apple');
	});

	it('should work with reactive forms', () => {
		const control = new FormControl();
		component.registerOnChange((value) => control.setValue(value));
		
		const items = ['option1', 'option2'];
		component.items.set(items);
		component.ngOnChanges({ items: { currentValue: items, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
		
		const firstItem = component.itemsList.items[0];
		component.select(firstItem);
		
		expect(control.value).toBe('option1');
	});

	it('should emit events', () => {
		const changeEmitSpy = spyOn(component.changeEvent, 'emit');
		const openEmitSpy = spyOn(component.openEvent, 'emit');
		const closeEmitSpy = spyOn(component.closeEvent, 'emit');
		
		component.open();
		expect(openEmitSpy).toHaveBeenCalled();
		
		component.close();
		expect(closeEmitSpy).toHaveBeenCalled();
		
		const items = ['option1'];
		component.items.set(items);
		component.ngOnChanges({ items: { currentValue: items, previousValue: undefined, firstChange: true, isFirstChange: () => true } });
		
		const firstItem = component.itemsList.items[0];
		component.select(firstItem);
		expect(changeEmitSpy).toHaveBeenCalled();
	});
});