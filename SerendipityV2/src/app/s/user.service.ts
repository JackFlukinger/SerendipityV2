import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private http: HttpClient,
    private StageService: StageService
  ) { }

  newUser(user, err) {
    this.http.post("https://productinterestsurvey.com:44444/api/users", {
        "age":  user.age,
        "gender":  user.gender,
        "email":  user.email,
        "categories": user.categories
      }, { withCredentials: true }).subscribe(
      data  => {
        if ((data as any).result == "success") {
          console.log("success");
          this.StageService.updateStage();
        } else {
          err();
        }
    }, error  => {
      console.log("Error", error);
    });
  }
}
