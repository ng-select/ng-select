import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngSelectModule } from 'quickstart-lib';

import { AppComponent } from './app.component';
import { SelectWithTemplatesComponent } from './select-with-templates.component';
import { SelectBindingsComponent } from './select-bindings.component';
import { SelectSearchComponent } from './select-search.component';

@NgModule({
  imports: [BrowserModule, AngSelectModule, CommonModule, FormsModule],
  declarations: [AppComponent, SelectWithTemplatesComponent, SelectBindingsComponent, SelectSearchComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

