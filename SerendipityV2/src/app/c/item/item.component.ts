import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../../s/item.service';

@Component({
  selector: 'app-random',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  constructor(
    private ItemService:ItemService
  ) { }

  ngOnInit() {
  }

}
