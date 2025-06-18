import { TestBed } from '@angular/core/testing';

import { CustomAlertsService } from './custom-alerts.service';

describe('CustomAlertsService', () => {
  let service: CustomAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
