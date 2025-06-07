import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'teacher',
    loadComponent: () => import('./teacher/teacher.page').then(m => m.TeacherPage),
  },
  {
    path: 'teachers',
    redirectTo: 'teacher',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
