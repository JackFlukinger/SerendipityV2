import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { CategoriesComponent } from './c/categories/categories.component';
import { ItemviewComponent } from './c/itemview/itemview.component';
import { RandomComponent } from './c/random/random.component';
import { SerendipitousComponent } from './c/serendipitous/serendipitous.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    ItemviewComponent,
    RandomComponent,
    SerendipitousComponent
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
