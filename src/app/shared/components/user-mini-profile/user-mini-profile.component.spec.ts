import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMiniProfileComponent } from './user-mini-profile.component';

describe('UserMiniProfileComponent', () => {
  let component: UserMiniProfileComponent;
  let fixture: ComponentFixture<UserMiniProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMiniProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMiniProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
