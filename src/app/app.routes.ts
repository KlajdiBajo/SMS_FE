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
    path: 'teachers',
    redirectTo: 'teacher',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },  {
    path: 'student',
    loadComponent: () => import('./pages/student/student.page').then( m => m.StudentPage)
  },

];
