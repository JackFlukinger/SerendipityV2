import { Injectable } from '@angular/core';
import { StageService } from './stage.service';

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

  constructor(
    private StageService: StageService
  ) { }

  newUser(user: User, err) {
    this.http.post("http://localhost:8000/api/users", {
        "age":  user.age,
        "gender":  user.gender,
        "email":  user.email,
        "categories": user.categories
      }).subscribe(
      data  => {
        if ((data as any).result == "success") {
          this.StageService.updateStage();
        } else {
          err();
        }
    }, error  => {
      console.log("Error", error);
    });
  }
}
