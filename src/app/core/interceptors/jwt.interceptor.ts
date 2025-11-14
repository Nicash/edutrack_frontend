// Interceptor funcional de Angular que automáticamente agrega el token JWT a todas las peticiones HTTP
import { HttpInterceptorFn } from '@angular/common/http';

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
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1️⃣ Obtener el token guardado en localStorage (si existe)
  const token = localStorage.getItem('edutrack_token');
  console.log('🔑 Token en localStorage:', token ? 'Sí existe' : 'No existe');
  
  // 2️⃣ Si hay token, agregarlo al header Authorization
  if (token) {
    // Clonar el request original y agregar el header (los requests son inmutables)
    const clonedReq = req.clone({ 
      setHeaders: { Authorization: `Bearer ${token}` } 
    });
    console.log('📤 Request con token:', clonedReq.url);
    // Enviar el request modificado con el token
    return next(clonedReq);
  }
  
  // 3️⃣ Si NO hay token, enviar el request original sin modificar
  console.log('📤 Request sin token:', req.url);
  return next(req);
};
