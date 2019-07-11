import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../../s/item.service';
<<<<<<< HEAD
import { trigger, style, animate, transition } from '@angular/animations';
=======
import { style, state, animate, transition, trigger } from '@angular/animations';
>>>>>>> 6c1332752c761eac082b0384ef3d907c596c6204

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: [
<<<<<<< HEAD
    trigger('slide', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({height:0}),
        animate('0.2s ease-out', style({height:'*'}))
      ]),
      transition(':leave', [   // :enter is alias to 'void => *'
        style({height:'*'}),
        animate('0.2s ease-out', style({height:0}))
=======
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
>>>>>>> 6c1332752c761eac082b0384ef3d907c596c6204
      ])
    ])
  ]
})
export class ItemComponent implements OnInit {
<<<<<<< HEAD
=======

  loading: boolean;

>>>>>>> 6c1332752c761eac082b0384ef3d907c596c6204
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
<<<<<<< HEAD
    this.ItemService.updateItem;
=======
    this.loading = true;

    this.ItemService.getItem(func => {
      this.loading = false;
    });
>>>>>>> 6c1332752c761eac082b0384ef3d907c596c6204
  }

}
