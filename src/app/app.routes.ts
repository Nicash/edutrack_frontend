import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [publicGuard], loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [publicGuard], loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'subjects', canActivate: [authGuard], loadComponent: () => import('./features/subjects/subjects-list/subjects-list.component').then(m => m.SubjectsListComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'subjects' },
  { path: '**', redirectTo: 'subjects' },
];
