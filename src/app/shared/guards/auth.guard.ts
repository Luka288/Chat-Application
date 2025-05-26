import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const fireAuth = inject(Auth);
  const router = inject(Router);

  return new Promise((resolve) => {
    onAuthStateChanged(fireAuth, (user) => {
      resolve(user ? router.navigateByUrl('/chats') : true);
    });
  });
};
