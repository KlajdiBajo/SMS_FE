import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'teacher',
    loadComponent: () => import('./pages/teacher/teacher.page').then(m => m.TeacherPage),
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses.component').then(m => m.CoursesComponent),
  },
  {
    path: 'teachers',
    redirectTo: 'teacher',
    pathMatch: 'full',
  },
  {
    path: 'courses',
    redirectTo: 'courses',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
