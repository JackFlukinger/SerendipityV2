import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class StageService {

  private stage: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public $stage: Observable<number> = this.stage.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  public updateStage() {
    this.http.get("https://productinterestsurvey.com:44444/api/stage", { withCredentials: true }).subscribe(
      data  => {
        this.stage.next((data as any).stage);
        console.log(this.stage);
    }, error  => {
      console.log("Error", error);
    });
  }
}
