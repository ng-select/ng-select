# NgSelect CDK (Headless) Component

The NgSelect CDK component provides all the core functionality of NgSelect without any predefined UI. This allows developers to build completely custom interfaces while maintaining all the selection, search, and dropdown logic.

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { NgSelectCdkComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-custom-select',
  template: `
    <ng-select-cdk 
      [items]="items"
      [(ngModel)]="selectedValue"
      (open)="onOpen()"
      (close)="onClose()"
      (change)="onChange($event)">
      
      <!-- Custom UI goes here -->
      <div class="custom-select-container">
        <!-- Selected value display -->
        <div class="selected-display" (click)="selectCdk.toggle()">
          @if (selectCdk.hasValue) {
            {{ selectCdk.selectedItems[0].label }}
          } @else {
            Select an option...
          }
          <span class="arrow">{{ selectCdk.isOpen() ? '▲' : '▼' }}</span>
        </div>
        
        <!-- Custom dropdown -->
        @if (selectCdk.isOpen()) {
          <div class="custom-dropdown">
            <!-- Search input -->
            <input 
              type="text"
              placeholder="Search..."
              (input)="selectCdk.filter($event.target.value)"
              [value]="selectCdk.searchTerm || ''"
              class="search-input">
            
            <!-- Options list -->
            <div class="options-list">
              @for (item of selectCdk.itemsList.filteredItems; track selectCdk.trackByOption($index, item)) {
                <div 
                  class="option"
                  [class.selected]="item.selected"
                  [class.highlighted]="item === selectCdk.itemsList.markedItem"
                  (click)="selectCdk.toggleItem(item)"
                  (mouseover)="selectCdk.onItemHover(item)">
                  {{ item.label }}
                </div>
              }
              
              @if (selectCdk.showNoItemsFound()) {
                <div class="no-items">No items found</div>
              }
            </div>
          </div>
        }
      </div>
    </ng-select-cdk>
  `,
  styles: [`
    .custom-select-container {
      position: relative;
      width: 200px;
    }
    
    .selected-display {
      border: 1px solid #ccc;
      padding: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .custom-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      border: 1px solid #ccc;
      background: white;
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    }
    
    .search-input {
      width: 100%;
      padding: 8px;
      border: none;
      border-bottom: 1px solid #eee;
    }
    
    .option {
      padding: 8px;
      cursor: pointer;
    }
    
    .option:hover, .option.highlighted {
      background-color: #f0f0f0;
    }
    
    .option.selected {
      background-color: #007bff;
      color: white;
    }
    
    .no-items {
      padding: 8px;
      color: #666;
      font-style: italic;
    }
  `]
})
export class CustomSelectComponent {
  items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  selectedValue: any;
  
  onOpen() {
    console.log('Dropdown opened');
  }
  
  onClose() {
    console.log('Dropdown closed');
  }
  
  onChange(value: any) {
    console.log('Value changed:', value);
  }
}
```

## Key Features

- **Headless**: No predefined UI - complete control over styling and layout
- **Full API**: All NgSelect functionality available (search, selection, keyboard navigation, etc.)
- **Reactive**: Uses Angular signals for state management
- **Accessible**: Maintains keyboard navigation and screen reader support
- **Template Support**: All existing template directives work
- **Forms Integration**: Full Angular forms support (reactive and template-driven)

## Available Properties and Methods

### State Properties
- `isOpen()` - Whether dropdown is open
- `selectedItems` - Array of selected items
- `hasValue` - Whether any items are selected
- `searchTerm` - Current search term
- `itemsList.filteredItems` - Filtered items based on search
- `itemsList.markedItem` - Currently highlighted item

### Methods
- `open()` - Open dropdown
- `close()` - Close dropdown
- `toggle()` - Toggle dropdown open/close
- `select(item)` - Select an item
- `unselect(item)` - Unselect an item
- `toggleItem(item)` - Toggle item selection
- `filter(term)` - Filter items by search term
- `onItemHover(item)` - Highlight item on hover

### Events
- `(open)` - Dropdown opened
- `(close)` - Dropdown closed
- `(change)` - Selection changed
- `(search)` - Search term changed
- `(add)` - Item added (multi-select)
- `(remove)` - Item removed (multi-select)

## Multi-Select Example

```typescript
@Component({
  template: `
    <ng-select-cdk 
      [items]="items"
      [multiple]="true"
      [(ngModel)]="selectedValues">
      
      <div class="multi-select">
        <!-- Selected items display -->
        <div class="selected-items">
          @for (item of selectCdk.selectedItems; track item) {
            <span class="selected-tag">
              {{ item.label }}
              <button (click)="selectCdk.unselect(item)">×</button>
            </span>
          }
        </div>
        
        <!-- Your custom dropdown UI here -->
      </div>
    </ng-select-cdk>
  `
})
export class MultiSelectComponent {
  items = ['Option 1', 'Option 2', 'Option 3'];
  selectedValues: any[] = [];
}
```

This CDK approach gives you complete freedom to create any UI design while leveraging the robust selection logic of NgSelect.