import { Component } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { StageService } from './s/stage.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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

export class AppComponent {
  showDefinition = false;

  constructor(
    private StageService: StageService,
  ) { }

  ngOnInit() {
    this.StageService.updateStage();
    console.log(this.StageService.$stage);
  }

}
