import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userCheckGuard } from './user-check.guard';

describe('userCheckGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userCheckGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
