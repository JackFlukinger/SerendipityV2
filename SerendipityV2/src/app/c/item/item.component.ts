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
        style({opacity: 0}),
        animate('0.2s 0.2s ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [   // :enter is alias to 'void => *'
        style({opacity:1}),
        animate('0.2s ease-in', style({opacity:0}))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('.2s ease-in-out', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('.2s ease-in-out', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('expand', [
      transition(':enter', [
        style({width: '0'}),
        animate('.2s linear', style({width: '*'}))
      ]),
      transition(':leave', [
        animate('.2s linear', style({width: '0'}))
      ])
    ])
  ]
})
export class ItemComponent implements OnInit {

  loading: boolean;

  openq: number;
  q1answer: boolean;
  q2answer: boolean;
  q3answer: boolean;


  responses: string[];


  constructor(
    public ItemService:ItemService,
  ) { }


  ngOnInit() {
    this.openq = 1;
    this.q1answer = null;
    this.q2answer = null;
    this.q3answer = null;

    this.loading = true;

    this.ItemService.getItem(func => {
      this.loading = false;
    });
  }

  submitRating(){
    let wouldBuy = this.q1answer;
    let haveHeard = this.q2answer;
    let noRecNeeded = this.q3answer;
    this.loading = true;
    this.ItemService.rateItem(wouldBuy, haveHeard, noRecNeeded, func => {
      this.resetResponses();
      this.loading = false;
    });
    console.log([wouldBuy, haveHeard, noRecNeeded]);

  }

  resetResponses(){
    this.q1answer = null;
    this.q2answer = null;
    this.q3answer = null;
    this.openq = 1;
  }

  getUnanswered() {
    if (this.q1answer == null) {
      return 1;
    } else if (this.q2answer == null) {
      return 2;
    } else if (this.q3answer == null) {
      return 3;
    } else {
      return null;
    }
  }

}
