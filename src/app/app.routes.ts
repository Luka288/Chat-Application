import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home page',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },
];
