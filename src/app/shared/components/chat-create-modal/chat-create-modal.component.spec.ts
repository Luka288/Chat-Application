import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCreateModalComponent } from './chat-create-modal.component';

describe('ChatCreateModalComponent', () => {
  let component: ChatCreateModalComponent;
  let fixture: ComponentFixture<ChatCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
