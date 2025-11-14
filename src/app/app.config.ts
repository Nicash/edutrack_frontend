// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// ======================================================================
// SECCIÓN 2: CONFIGURACIÓN DE LA APLICACIÓN
// ======================================================================

/**
 * appConfig - Configuración global de la aplicación Angular
 * 
 * Este archivo es el punto de configuración central donde se registran
 * todos los servicios, interceptores y funcionalidades globales que
 * necesita la aplicación para funcionar.
 * 
 * Es similar al antiguo app.module.ts pero para aplicaciones standalone.
 * Se ejecuta al iniciar la app (en main.ts).
 */

export const appConfig: ApplicationConfig = {

  providers: [

    // ===================================
    // 1. DETECCIÓN DE CAMBIOS
    // ===================================
    // Optimiza la detección de cambios de Angular agrupando eventos

    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // ===================================
    // 2. SISTEMA DE RUTAS
    // ===================================
    // Registra todas las rutas definidas en app.routes.ts

    provideRouter(routes),
    
    // ===================================
    // 3. CLIENTE HTTP CON INTERCEPTORES
    // ===================================
    // Habilita HttpClient para hacer peticiones al backend
    // y registra el interceptor JWT para agregar tokens automáticamente

    provideHttpClient(withInterceptors([jwtInterceptor])),
    
    // ===================================
    // 4. ANIMACIONES DE ANGULAR MATERIAL
    // ===================================
    // Habilita las animaciones necesarias para Material Design
    
    provideAnimationsAsync(),
  ],
};
