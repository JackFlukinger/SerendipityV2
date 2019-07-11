import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';


export interface Item {
  id: string,
  name: string,
  description: string,
  price: number,
  rating: number,
  numratings: number,
  categories: string[],
  image: string
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private item: BehaviorSubject<Item>;
  public $item: Observable<Item> = this.item.asObservable();

  constructor() { }

  public updateItem(rating: number, callback) {
    if (rating > 0) { //user is rating current item

    } else { //user is just getting new item


    }
  }
}
