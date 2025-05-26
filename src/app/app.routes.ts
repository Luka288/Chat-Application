import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { userCheckGuard } from './shared/guards/user-check.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    title: 'Home page',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
    canActivate: [authGuard],
  },

  {
    path: 'chats',
    title: 'Chat page',
    loadComponent: () =>
      import('./features/chat-page/chat-page.component').then(
        (c) => c.ChatPageComponent
      ),
    canActivate: [userCheckGuard],
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
