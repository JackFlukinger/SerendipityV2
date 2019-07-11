import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../../s/item.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({height:0}),
        animate('0.2s ease-out', style({height:'*'}))
      ]),
      transition(':leave', [   // :enter is alias to 'void => *'
        style({height:'*'}),
        animate('0.2s ease-out', style({height:0}))
      ])
    ])
  ]
})
export class ItemComponent implements OnInit {
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
    this.ItemService.updateItem;
  }

}
