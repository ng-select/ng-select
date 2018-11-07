import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule.withServerTransition({ appId: 'ng-select' }),
    NgSelectModule.forRoot({
        notFoundText: 'Custom not found'
    }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
