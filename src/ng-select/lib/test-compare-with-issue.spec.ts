import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from './ng-select.component';
import { NgSelectModule } from './ng-select.module';

@Component({
  template: `
    <ng-select 
      [items]="items" 
      groupBy="group" 
      bindLabel="description" 
      bindValue="item" 
      [compareWith]="isMatch" 
      [(ngModel)]="selectedItem">
    </ng-select>
  `,
  standalone: false,
})
class CompareWithIssueTestComponent {
  @ViewChild(NgSelectComponent) select: NgSelectComponent;
  
  items: any[] = [];
  selectedItem: any = { code: 'A', value: 'description' };
  
  isMatch(toCompare: any, selected: any) {
    console.log('compareWith called with:', toCompare, selected);
    return toCompare && selected && toCompare.code === selected.code;
  }
}

describe('compareWith issue test', () => {
  let fixture: ComponentFixture<CompareWithIssueTestComponent>;
  let component: CompareWithIssueTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompareWithIssueTestComponent],
      imports: [NgSelectModule, FormsModule]
    });
    
    fixture = TestBed.createComponent(CompareWithIssueTestComponent);
    component = fixture.componentInstance;
  });

  it('should call compareWith when items are updated from empty to populated', fakeAsync(() => {
    // Initially items is empty but selectedItem is set
    expect(component.items.length).toBe(0);
    expect(component.selectedItem).toEqual({ code: 'A', value: 'description' });
    
    // Spy on compareWith function
    spyOn(component, 'isMatch').and.callThrough();
    
    fixture.detectChanges();
    tick();
    
    // Initially no compareWith should be called since items is empty
    expect(component.isMatch).not.toHaveBeenCalled();
    expect(component.select.hasValue).toBe(true);
    expect(component.select.selectedItems.length).toBe(1);
    
    // Now update items to contain the matching item
    component.items = [
      { 
        description: 'alternate description', 
        item: { code: 'A', value: 'description' }, 
        group: 'some group' 
      }
    ];
    
    fixture.detectChanges();
    tick();
    
    // compareWith should be called when items are updated
    expect(component.isMatch).toHaveBeenCalled();
    
    // The selected item should be properly mapped to the new item
    expect(component.select.selectedItems.length).toBe(1);
    expect(component.select.selectedItems[0].value).toEqual({
      description: 'alternate description',
      item: { code: 'A', value: 'description' },
      group: 'some group'
    });
  }));
});