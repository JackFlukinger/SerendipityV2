import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { UserService, User } from 'src/app/s/user.service';
import { Category, CategoriesService } from '../../s/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [ ],
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
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private CategoriesService: CategoriesService
  ) { }

  showDropdown: boolean;
  profileForm: FormGroup;

  likedcategories: number[];


  ngOnInit() {
    this.showDropdown = false;
    this.likedcategories=[]

    this.profileForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(0), Validators.max(110)]],
      gender: ['', [Validators.required, Validators.pattern("Male|Female|Other")]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.CategoriesService.loadCategories(cats => {
      for (const [key, value] of Object.entries(cats)) {
        this.categories.push(<Category> value);
      }});
  }

  onSubmit(){
    console.log("Form Submitted");
    let index = 0;

    let user: User = {
      email: this.profileForm.get('email').value,
      age: this.profileForm.get('age').value,
      gender: this.profileForm.get('gender').value,
      categories: this.likedcategories
    }

    console.log(user);

    //add user to backend using service
    //this.userservice.newUser()
  }

  getNumOfLikedCategories(){
    return 3;
    //return this.likedgenres.length;
  }

  toggleCat(index:number){
    if (this.likedcategories.indexOf(index) != -1) {
      this.likedcategories.splice(this.likedcategories.indexOf(index), 1);
    } else {
      this.likedcategories.push(index);
    }
    console.log("Has been clicked" + index);
    console.log(this.likedcategories);

}
}
