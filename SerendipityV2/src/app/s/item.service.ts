import { Injectable } from '@angular/core';

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

  constructor() { }
}
