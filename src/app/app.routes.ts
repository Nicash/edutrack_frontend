// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

// ======================================================================
// SECCIÓN 2: DEFINICIÓN DE RUTAS
// ======================================================================

/**
 * routes - Configuración del sistema de navegación de la aplicación
 * 
 * Este archivo define todas las rutas (URLs) disponibles en la aplicación
 * y qué componente se debe mostrar en cada una.
 * 
 * Características implementadas:
 * - Lazy Loading: Los componentes se cargan solo cuando se navega a ellos
 * - Guards: Protección de rutas según estado de autenticación
 * - Redirecciones: Manejo de rutas inválidas o raíz
 */

export const routes: Routes = [
  
  // ===================================
  // RUTAS PÚBLICAS (sin autenticación)
  // ===================================
  // Solo accesibles si NO estás logueado (gracias a publicGuard)
  { 
    path: 'login', 
    canActivate: [publicGuard], // Redirige a /subjects si ya estás logueado
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    canActivate: [publicGuard], // Redirige a /subjects si ya estás logueado
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) 
  },
  
  // ===================================
  // RUTAS PRIVADAS (requieren autenticación)
  // ===================================
  // Solo accesibles si ESTÁS logueado (gracias a authGuard)
  {
    path: 'subjects',
    canActivate: [authGuard], // Redirige a /login si no est�s logueado
    loadComponent: () => import('./features/subjects/subjects-list/subjects-list.component').then(m => m.SubjectsListComponent)
  },
  {
    path: 'subscriptions',
    canActivate: [authGuard], // Redirige a /login si no est�s logueado
    loadComponent: () => import('./features/subjects/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent)
  },
  
  // ===================================
  // REDIRECCIONES
  // ===================================
  // Ruta raíz: Redirige a /subjects (pantalla principal)
  { path: '', pathMatch: 'full', redirectTo: 'subjects' },
  
  // Ruta no encontrada: Cualquier URL inválida redirige a /subjects
  { path: '**', redirectTo: 'subjects' },
];

