import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { Category, CategoriesService } from '../../s/categories.service';
import { User, UserService } from '../../s/user.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [ ],
  animations: [
  trigger('fade', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity: 0}),
      animate('0.2s 0.2s ease-in', style({opacity: 1}))
    ]),
    transition(':leave', [   // :enter is alias to 'void => *'
      style({opacity:1}),
      animate('0.2s ease-in', style({opacity:0}))
    ])
  ]),
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
    private CategoriesService: CategoriesService,
    private UserService: UserService
  ) { }

  showDropdown: boolean;
  loading: boolean;
  selectedCategory: number;
  profileForm: FormGroup;
  serverError: boolean;

  likedcategories: number[];

  consent: boolean;


  ngOnInit() {
    this.consent = false;
    this.showDropdown = false;
    this.selectedCategory = -1;
    this.loading = false;
    this.likedcategories=[]
    this.serverError = false;

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
    this.loading = true;
    let index = 0;

    let user: User = {
      email: this.profileForm.get('email').value,
      age: this.profileForm.get('age').value,
      gender: this.profileForm.get('gender').value,
      categories: this.likedcategories
    }

    console.log(user);

    //add user to backend using service
    this.UserService.newUser(user, fun => {
      this.loading = false;
      this.serverError = true;
    });
  }

  toggleBigCat(index:number){
    if (this.selectedCategory == index) {
        this.selectedCategory = -1;
    } else {
      this.selectedCategory = index;
    }
  }

  toggleSubCat(index:number) {
    if (this.likedcategories.indexOf(index) != -1) {
      this.likedcategories.splice(this.likedcategories.indexOf(index), 1);
    } else {
      this.likedcategories.push(index);
    }
    console.log("Has been clicked" + index);
    console.log(this.likedcategories);
  }

  acceptConsent(){
    this.consent=true;
  }
}
