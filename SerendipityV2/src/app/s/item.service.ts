import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StageService } from './stage.service';



export interface Item {
  id: string,
  name: string,
  description: string,
  price: number,
  rating: number,
  numratings: number,
  image: string
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private item: BehaviorSubject<Item> =  new BehaviorSubject<Item>({id: null, name: null, description: null, price: null, rating: null, numratings: null, image: null});
  public $item: Observable<Item> = this.item.asObservable();

  constructor(
    private http: HttpClient,
    private StageService: StageService
  ) { }

  public getItem(callback) {
    this.http.get("http://localhost:8000/api/item").subscribe(
      data  => {
        if ((data as any).result == 'success') { //Item successfully found
          let id = (data as any).item.itemID;
          let name = (data as any).item.name;
          let description = (data as any).item.description;
          let price = parseFloat((data as any).item.price);
          let rating = parseFloat((data as any).item.rating);
          let numratings = parseInt((data as any).item.numratings);
          let image = (data as any).item.image;
          let newItem:Item = {id: id, name: name, description: description, price: price, rating: rating, numratings: numratings, image: image};
          this.item.next(newItem);
          console.log(newItem);
        } else if ((data as any).result == 'nextstage') { //If user has completed all ratings
          this.StageService.updateStage();
        } else { //Backend failure
          console.log("Backend failure");
        }
    }, error  => {
      console.log("Error", error);
    });
    callback();
  }

  public updateItem(wouldBuy: boolean, haveHeard: boolean, noRecNeeded: boolean, callback) {
    //this.http.post("http://localhost:8000/api/item").subscribe();
  }
}
