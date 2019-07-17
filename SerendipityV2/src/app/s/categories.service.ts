import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Category {
  id: number,
  name: string,
  children: Category[]
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {


  constructor(
    private http: HttpClient
  ) { }

  public loadCategories(callback) {
    this.http.get("https://productinterestsurvey.com:44444/api/categories", { withCredentials: true }).subscribe(
      data  => {
        let cats = {}; //Populated with categories
        (data as any).categories.forEach(category => {
          if (category.parentID == null) {
            let id = parseInt(category.baseID);
            let name = category.categoryName;
            let children:Category[] = [];
            let cat:Category = {id: id, name: name, children: children};
            cats[id] = cat;
          }
        });
        (data as any).categories.forEach(category => {
          if (category.parentID != null) {
            let id = parseInt(category.baseID);
            let name = category.categoryName;
            let parentID = parseInt(category.parentID);
            let children:Category[] = [];
            let cat:Category = {id: id, name: name, children: children};
            cats[parentID].children.push(cat);
          }
        });
        callback(cats);
    }, error  => {
      console.log("Error retrieving categories:", error);
    });
  }
}
