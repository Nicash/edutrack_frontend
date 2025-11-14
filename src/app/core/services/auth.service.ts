// ======================================================================
// IMPORTACIONES
// ======================================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// ======================================================================
// INTERFACES DE TIPOS
// ======================================================================

// Estructura del usuario devuelto por el backend
export interface User {
  _id: string;
  email: string;
  name: string;
}

// Respuesta del endpoint POST /auth/login
export interface LoginResponse {
  message: string;
  data: {
    token: string;  // JWT token para autenticación
    user: User;     // Datos del usuario logueado
  };
}

// Respuesta del endpoint POST /auth/register
export interface RegisterResponse {
  message: string;
  user: User;
}

// ======================================================================
// SERVICIO DE AUTENTICACIÓN
// ======================================================================

/**
 * AuthService - Servicio centralizado de autenticación
 * 
 * Responsabilidades:
 * - Comunicación con endpoints de auth del backend (/auth/login, /auth/register)
 * - Gestión del token JWT en localStorage
 * - Verificación del estado de autenticación
 */

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiUrl; // URL base del backend

  // ===================================
  // MÉTODOS DE AUTENTICACIÓN HTTP
  // ===================================
  
  /**
   * login - Iniciar sesión
   * @returns Observable con token y datos del usuario
   */
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password });
  }
  
  /**
   * register - Registrar nuevo usuario
   * @returns Observable con datos del usuario creado
   */
  register(name: string, email: string, password: string) {
    return this.http.post<RegisterResponse>(`${this.base}/auth/register`, { name, email, password });
  }
  
  // ===================================
  // MÉTODOS DE GESTIÓN DE TOKEN
  // ===================================
  
  /**
   * isLoggedIn - Verifica si hay sesión activa
   * @returns true si existe token en localStorage, false si no
   */
  isLoggedIn() { 
    return !!localStorage.getItem('edutrack_token'); 
  }
  
  /**
   * saveToken - Guarda el token JWT en localStorage
   * Se ejecuta después de login exitoso
   */
  saveToken(t: string) { 
    localStorage.setItem('edutrack_token', t); 
  }
  
  /**
   * getToken - Obtiene el token actual
   * @returns Token JWT o null si no existe
   */
  getToken() {
    return localStorage.getItem('edutrack_token');
  }
  
  /**
   * logout - Cierra sesión eliminando el token
   */
  logout() { 
    localStorage.removeItem('edutrack_token'); 
  }
}
