import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngSelectModule } from 'ang-select';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, AngSelectModule, FormsModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
