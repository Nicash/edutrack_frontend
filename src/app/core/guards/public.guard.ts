// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================

// inject: Función de Angular para inyectar servicios en funciones standalone

import { inject } from '@angular/core';

// CanActivateFn: Tipo funcional para guards de ruta (nuevo enfoque de Angular)
// Router: Servicio para navegar entre rutas

import { CanActivateFn, Router } from '@angular/router';

// AuthService: Servicio personalizado que maneja la lógica de autenticación

import { AuthService } from '../services/auth.service';

// ======================================================================
// SECCIÓN 2: DEFINICIÓN DEL GUARD
// ======================================================================

/**
 * publicGuard - Guard para rutas públicas (login/register) (MEJORADO)
 * 
 * Propósito: Proteger rutas públicas para que usuarios YA AUTENTICADOS no puedan acceder
 * 
 * ¿Cómo funciona?
 * - Se ejecuta ANTES de activar rutas públicas como /login o /register
 * - Verifica si el usuario ya tiene sesión iniciada
 * - Si YA está autenticado: redirige a /subjects (return UrlTree)
 * - Si NO está autenticado: permite el acceso a la página pública (return true)
 * 
 * Caso de uso: Evitar que un usuario logueado vuelva a ver el login
 */

export const publicGuard: CanActivateFn = () => {

  // ======================================================================
  // SECCIÓN 3: INYECCIÓN DE DEPENDENCIAS
  // ======================================================================

  // Inyectamos el servicio de autenticación para verificar el estado del usuario
  const auth = inject(AuthService);
  
  // Inyectamos el router para crear UrlTree de redirección
  const router = inject(Router);
  
  // ======================================================================
  // SECCIÓN 4: LÓGICA DE VALIDACIÓN INVERSA SIMPLIFICADA
  // ======================================================================

  // Verificamos si el usuario YA está logueado y retornamos el resultado apropiado:
  // - Si está logueado: retornamos UrlTree hacia /subjects (Angular redirige automáticamente)
  // - Si NO está logueado: retornamos true para permitir acceso
  
  return auth.isLoggedIn() 
    ? router.createUrlTree(['/subjects'])  // Usuario autenticado → redirigir a subjects
    : true;                                 // Usuario NO autenticado → permitir acceso
};
