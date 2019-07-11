import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { CategoriesComponent } from './c/categories/categories.component';
import { ItemviewComponent } from './c/itemview/itemview.component';
import { ItemComponent } from './c/item/item.component';
import { CompleteComponent } from './c/complete/complete.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    ItemviewComponent,
    ItemComponent,
    CompleteComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
