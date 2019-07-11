import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../../s/item.service';
import { style, state, animate, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
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
export class ItemComponent implements OnInit {

  loading: boolean;

  q1answer: boolean;
  q2answer: boolean;
  q3answer: boolean;

  responses: string[];


  constructor(
    private ItemService:ItemService,
  ) { }

  name: string;
  description: string;
  price: number;
  rating: number;
  numratings: number;
  image: string;


  ngOnInit() {
    this.q1answer = null;
    this.q2answer = null;
    this.q3answer = null;


    this.loading = true;

    this.ItemService.getItem(func => {
      this.loading = false;
    });
  }

  submitRating(){
    let wouldBuy = this.q1answer.toString();
    let haveHeard = this.q2answer.toString();
    let noRecNeeded = this.q3answer.toString();
    
    //this.ItemService.updateItem(wouldBuy, haveHeard, noRecNeeded,(func => {}));
    console.log([wouldBuy, haveHeard, noRecNeeded]);
  }

}
