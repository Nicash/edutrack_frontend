// ======================================================================
// IMPORTACIONES
// ======================================================================

import { HttpInterceptorFn } from '@angular/common/http';

// ======================================================================
// INTERCEPTOR JWT
// ======================================================================

/**
 * jwtInterceptor - Interceptor HTTP funcional
 * 
 * Propósito: Agregar automáticamente el token JWT a los headers de TODAS las peticiones HTTP
 * 
 * ¿Cómo funciona?
 * 1. Se ejecuta antes de CADA request HTTP (GET, POST, PUT, DELETE, etc.)
 * 2. Busca el token en localStorage
 * 3. Si existe token: clona el request y agrega header "Authorization: Bearer {token}"
 * 4. Si NO existe token: deja pasar el request sin modificar
 * 
 * ¿Por qué es necesario?
 * El backend protege las rutas y valida el token en cada petición.
 * Sin este interceptor, tendríamos que agregar manualmente el header en cada llamada HTTP.
 */

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // ======================================================================
  // SECCIÓN 1: OBTENER TOKEN
  // ======================================================================
  
  const token = localStorage.getItem('edutrack_token');

  // ======================================================================
  // SECCIÓN 2: AGREGAR HEADERS (TOKEN + NGROK)
  // ======================================================================

  // Preparar headers adicionales
  const headers: { [key: string]: string } = {
    'ngrok-skip-browser-warning': '69420'  // Header requerido por ngrok
  };

  // Agregar token JWT si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Clonar request con todos los headers
  const clonedReq = req.clone({ setHeaders: headers });
  
  // Continuar con el request modificado
  return next(clonedReq);
};
