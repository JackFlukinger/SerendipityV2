import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerendipitousComponent } from './serendipitous.component';

describe('SerendipitousComponent', () => {
  let component: SerendipitousComponent;
  let fixture: ComponentFixture<SerendipitousComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerendipitousComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerendipitousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
