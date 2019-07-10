import { Component, OnInit } from '@angular/core';
import { Category, CategoriesService } from '../../s/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories:Category[] = [];

  constructor(
    private CategoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.CategoriesService.loadCategories(cats => {
      for (const [key, value] of Object.entries(cats)) {
        this.categories.push(<Category> value);
      }
    });
  }

}
