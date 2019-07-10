import { Injectable } from '@angular/core';

export interface User {
  age: number;
  gender: string;
  email: string;
  categories: number[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  newUser() {

  }
}
