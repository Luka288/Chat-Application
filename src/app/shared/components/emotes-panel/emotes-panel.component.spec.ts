import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotesPanelComponent } from './emotes-panel.component';

describe('EmotesPanelComponent', () => {
  let component: EmotesPanelComponent;
  let fixture: ComponentFixture<EmotesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotesPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmotesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
