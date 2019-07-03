import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
