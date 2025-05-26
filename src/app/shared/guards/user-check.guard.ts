import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { onAuthStateChanged } from 'firebase/auth';

export const userCheckGuard: CanActivateFn = (route, state) => {
  const fireAuth = inject(Auth);
  const router = inject(Router);

  return new Promise((resolve) => {
    onAuthStateChanged(fireAuth, (user) => {
      resolve(user ? true : router.navigateByUrl('/home'));
    });
  });
};
