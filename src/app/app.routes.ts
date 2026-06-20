import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      {
        path: 'courses',
        loadComponent: () => import('./pages/admin/course-management/course-list/course-list').then((m) => m.CourseList),
      },
      {
        path: 'courses/new',
        loadComponent: () => import('./pages/admin/course-management/course-form/course-form').then((m) => m.CourseForm),
      },
      {
        path: 'courses/:id/edit',
        loadComponent: () => import('./pages/admin/course-management/course-form/course-form').then((m) => m.CourseForm),
      },
    ],
  },
  {
    path: 'tutorial',
    loadComponent: () => import('./pages/tutorial/tutorial').then(m => m.Tutorial),
    children: [
      { path: '', redirectTo: 'angular', pathMatch: 'full' },
      { path: 'angular', loadComponent: () => import('./pages/tutorial/angular-course').then(m => m.AngularCourse) },
      { path: 'es6', loadComponent: () => import('./pages/tutorial/es6-course').then(m => m.Es6Course) },
      { path: 'azure', loadComponent: () => import('./pages/tutorial/azure-course').then(m => m.AzureCourse) },
      { path: 'gen-ai', loadComponent: () => import('./pages/tutorial/gen-ai-course').then(m => m.GenAiCourse) },
      { path: 'python', loadComponent: () => import('./pages/tutorial/python-course').then(m => m.PythonCourse) },
      { path: 'javascript', loadComponent: () => import('./pages/tutorial/javascript-course').then(m => m.JavascriptCourse) }
    ]
  },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: '**', redirectTo: 'dashboard' }
];
