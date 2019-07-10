import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../s/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(
    private CategoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.CategoriesService.loadCategories();
  }

}
