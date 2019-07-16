import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StageService } from './stage.service';



export interface Item {
  id: string,
  name: string,
  description: string,
  price: string,
  rating: number,
  numratings: number,
  image: string,
  left: number
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private item: BehaviorSubject<Item> =  new BehaviorSubject<Item>({id: null, name: null, description: null, price: null, rating: null, numratings: null, image: null, left: null});
  public $item: Observable<Item> = this.item.asObservable();

  constructor(
    private http: HttpClient,
    private StageService: StageService
  ) { }

  public getItem(callback) {
    this.http.get("http://productinterestsurvey.com:8000/api/item").subscribe(
      data  => {
        if ((data as any).result == 'success') { //Item successfully found
          let id = (data as any).item.itemID;
          let name = (data as any).item.name;
          let description = (data as any).item.description;
          if (description == 'None') {description = '';}
          let price = (data as any).item.price;
          if (!(parseFloat(price) >= 0)) {price = 'No Price Listed';}
          else {price = '$' + price.toFixed(2);}
          let rating = parseFloat((data as any).item.rating);
          if (!(rating >= 0)) {rating = 0;}
          let numratings = parseInt((data as any).item.numratings);
          if (!(numratings>=0)) {numratings = 0;}
          let image = (data as any).item.image;
          let left = parseInt((data as any).left);
          let newItem:Item = {id: id, name: name, description: description, price: price, rating: rating, numratings: numratings, image: image, left: left};
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

  public rateItem(wouldBuy: boolean, haveHeard: boolean, noRecNeeded: boolean, callback) {
    this.http.post("http://productinterestsurvey.com:8000/api/item", {
        "itemID": this.item.value.id,
        "wouldBuy":  wouldBuy,
        "haveHeard":  haveHeard,
        "noRecNeeded":  noRecNeeded
      }).subscribe(
      data  => {
        if ((data as any).result == "success") {
          console.log("success");
          this.getItem(callback);
        } else {
          console.log("Backend Error");
        }
    }, error  => {
      console.log("Error", error);
    });
  }
}
