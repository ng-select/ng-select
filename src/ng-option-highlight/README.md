## Getting started
### Step 1: Install `ng-option-highlight`:

#### NPM
```shell
npm install --save @ng-select/ng-option-highlight
```
#### YARN
```shell
yarn add @ng-select/ng-option-highlight
```
### Step 2: Import the NgOptionHighlightModule:
```js
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';

@NgModule({
  declarations: [AppComponent],
  imports: [
      NgSelectModule, 
      NgOptionHighlightModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 3: Add directive in your template: 

```html
<ng-select>
    ...
    <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
        <span [ngOptionHighlight]="search">{{item.title}}</span>
    </ng-template>
</ng-select>
```


## Development

### Build

Run `ng build ng-option-highlight` to build the project. The build artifacts will be stored in the `dist/` directory.

### Publishing

After building your library with `ng build ng-option-highlight`, go to the dist folder `cd dist/ng-option-highlight` and run `npm publish`.

### Running unit tests

Run `ng test ng-option-highlight` to execute the unit tests via [Karma](https://karma-runner.github.io).
