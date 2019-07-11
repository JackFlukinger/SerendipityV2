import { Component, OnInit, Input } from '@angular/core';
import { Item, ItemService } from '../../s/item.service';
import { style, state, animate, transition, trigger, AnimationMetadataType } from '@angular/animations';


@Component({
  selector: 'app-itemview',
  templateUrl: './itemview.component.html',
  styleUrls: ['./itemview.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate('0.2s 0.2s ease-in', style({opacity:1}))
      ]),
      transition(':leave', [   // :enter is alias to 'void => *'
        style({opacity:1}),
        animate('0.2s ease-in', style({opacity:0}))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('.5s .2s ease-in-out', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('.2s ease-in-out', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class ItemviewComponent implements OnInit {
  @Input() anItem: Item; //recieves input from selector call in random

  loading: boolean = true;
  name: string;
  description: string;
  price: number;
  rating: number;
  numratings: number;
  image: string;

  constructor(
    private ItemService: ItemService
  ) { }

  ngOnInit() {
    this.ItemService.updateItem(-1, {});
  }

  setItemInfo(item: Item){
    this.name = item.name;
    this.description= item.description;
    this.price = item.price;
    this.rating = item.rating;
    this.numratings = item.numratings;
    this.image = item.image;
  }
}
