// ======================================================================
// IMPORTACIONES
// ======================================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// ======================================================================
// INTERFAZ DE MATERIA
// ======================================================================

/**
 * Subject - Estructura de una materia
 * Campos opcionales (?) se agregan automáticamente por el backend
 */

export interface Subject { 
  _id?: string;           // ID generado por MongoDB (opcional porque no existe antes de crear)
  name: string;           // Nombre de la materia (requerido)
  objective: string;      // Objetivo de la materia (requerido)
  content: string;        // Contenido/temario (requerido)
  createdAt?: string;     // Fecha de creación (la agrega el backend)
  updatedAt?: string;     // Fecha de actualización (la agrega el backend)
}

// ======================================================================
// SERVICIO DE MATERIAS
// ======================================================================

/**
 * SubjectService - Servicio para gestionar materias (CRUD completo)
 * 
 * Responsabilidades:
 * - Comunicación con endpoints /subject del backend
 * - Operaciones CRUD: Crear, Leer, Actualizar, Eliminar materias
 */

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private http = inject(HttpClient);           // Cliente HTTP para hacer peticiones
  private base = environment.apiUrl;           // URL base del backend (ej: http://localhost:3000)

  // ===================================
  // MÉTODOS CRUD
  // ===================================
  
  /**
   * list - Obtiene todas las materias
   * GET /subject/getAll
   * @returns Observable con array de materias
   */

  list() { 
    return this.http.get<Subject[]>(`${this.base}/subject/getAll`); 
  }
  
  /**
   * getByName - Busca una materia por nombre
   * GET /subject/get?name=nombreMateria
   * @param name - Nombre de la materia a buscar
   * @returns Observable con la materia encontrada
   */

  getByName(name: string) { 
    return this.http.get<Subject>(`${this.base}/subject/get`, { params: { name } }); 
  }
  
  /**
   * add - Crea una nueva materia
   * POST /subject/add
   * @param s - Datos de la materia a crear (sin _id, createdAt, updatedAt)
   * @returns Observable con la materia creada (incluye _id y fechas)
   */

  add(s: Subject) { 
    return this.http.post<Subject>(`${this.base}/subject/add`, s); 
  }
  
  /**
   * update - Actualiza una materia existente
   * PUT /subject/update/:id
   * @param id - ID de la materia a actualizar
   * @param s - Nuevos datos de la materia
   * @returns Observable con la materia actualizada
   */

  update(id: string, s: Subject) { 
    return this.http.put<Subject>(`${this.base}/subject/update/${id}`, s); 
  }
  
  /**
   * remove - Elimina una materia por nombre
   * DELETE /subject/delete?name=nombreMateria
   * @param name - Nombre de la materia a eliminar
   * @returns Observable con respuesta del backend
   */
  
  remove(name: string) { 
    return this.http.delete(`${this.base}/subject/delete`, { params: { name } }); 
  }

  // ===================================
  // M�TODOS DE SUSCRIPCI�N
  // ===================================

  /**
   * getAllWithStatus - Obtiene todas las materias con indicador de suscripción
   * GET /subscription/all-with-status
   * @returns Observable con array de materias incluyendo campo isSubscribed
   */
  getAllWithStatus() {
    return this.http.get<any>(`${this.base}/subscription/all-with-status`);
  }

  /**
   * getMySubscriptions - Obtiene solo las materias a las que está suscrito el usuario
   * GET /subscription/my-subscriptions
   * @returns Observable con array de materias suscritas
   */
  getMySubscriptions() {
    return this.http.get<any>(`${this.base}/subscription/my-subscriptions`);
  }

  /**
   * subscribe - Suscribe al usuario a una materia
   * POST /subscription/subscribe
   * @param subjectId - ID de la materia a suscribirse
   * @returns Observable con respuesta del backend
   */
  subscribe(subjectId: string) {
    return this.http.post<any>(`${this.base}/subscription/subscribe`, { subjectId });
  }

  /**
   * unsubscribe - Desuscribe al usuario de una materia
   * POST /subscription/unsubscribe
   * @param subjectId - ID de la materia a desuscribirse
   * @returns Observable con respuesta del backend
   */
  unsubscribe(subjectId: string) {
    return this.http.post<any>(`${this.base}/subscription/unsubscribe`, { subjectId });
  }

  /**
   * toggleSubscription - Alterna el estado de suscripci�n de una materia
   * @param subjectId - ID de la materia
   * @param isSubscribed - Estado actual de suscripci�n
   * @returns Observable con respuesta del backend
   */
  toggleSubscription(subjectId: string, isSubscribed: boolean) {
    return isSubscribed ? this.unsubscribe(subjectId) : this.subscribe(subjectId);
  }
}
