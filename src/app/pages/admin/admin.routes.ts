import { Routes } from '@angular/router';
import { Admin } from './admin';

export const adminRoutes: Routes = [
  {
    path: '',
    component: Admin,
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      {
        path: 'courses',
        loadComponent: () => import('./course-management/course-list/course-list').then((m) => m.CourseList),
      },
      {
        path: 'courses/new',
        loadComponent: () => import('./course-management/course-form/course-form').then((m) => m.CourseForm),
      },
      {
        path: 'courses/:id/edit',
        loadComponent: () => import('./course-management/course-form/course-form').then((m) => m.CourseForm),
      },
    ],
  },
];
