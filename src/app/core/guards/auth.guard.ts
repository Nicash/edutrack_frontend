// ===================================
// SECCIÓN 1: IMPORTACIONES
// ===================================
// inject: Función de Angular para inyectar servicios en funciones standalone
import { inject } from '@angular/core';

// CanActivateFn: Tipo funcional para guards de ruta (nuevo enfoque de Angular)
// Router: Servicio para navegar entre rutas
import { CanActivateFn, Router } from '@angular/router';

// AuthService: Servicio personalizado que maneja la lógica de autenticación
import { AuthService } from '../services/auth.service';

// ===================================
// SECCIÓN 2: DEFINICIÓN DEL GUARD
// ===================================
/**
 * authGuard - Guard de autenticación funcional
 * 
 * Propósito: Proteger rutas que requieren que el usuario esté autenticado
 * 
 * ¿Cómo funciona?
 * - Se ejecuta ANTES de activar una ruta protegida (/subjects)
 * - Verifica si el usuario tiene sesión iniciada
 * - Si está autenticado: permite el acceso (return true)
 * - Si NO está autenticado: redirige al login (return UrlTree)
 */
export const authGuard: CanActivateFn = () => {
  // ===================================
  // SECCIÓN 3: INYECCIÓN DE DEPENDENCIAS
  // ===================================
  const auth = inject(AuthService);
  const router = inject(Router);
  
  // ===================================
  // SECCIÓN 4: LÓGICA DE VALIDACIÓN
  // ===================================
  // Operador ternario simple:
  // - Usuario autenticado → permitir acceso a /subjects
  // - Usuario NO autenticado → redirigir al /login
  return auth.isLoggedIn() 
    ? true 
    : router.createUrlTree(['/login']);
};
