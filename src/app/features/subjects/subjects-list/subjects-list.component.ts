// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================
import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectService, Subject } from '../../../core/services/subject.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { MESSAGES } from '../../../constants/messages';

// Importaciones de Angular Material

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// ======================================================================
// SECCIÓN 2: CONFIGURACIÓN DEL COMPONENTE
// ======================================================================

@Component({
  selector: 'app-subjects-list',
  standalone: true,
  imports: [
    NgFor, 
    NgIf, 
    FormsModule, 
    CalendarComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.css']
})

// ======================================================================
// SECCIÓN 3: LÓGICA DEL COMPONENTE
// ======================================================================
/**
 * SubjectsListComponent - Componente CRUD de materias
 * 
 * Responsabilidades:
 * - Listar todas las materias del usuario
 * - Filtrar materias por nombre (búsqueda reactiva)
 * - Agregar nuevas materias
 * - Editar materias existentes
 * - Eliminar materias con confirmación
 * - Mostrar calendario académico
 */

export class SubjectsListComponent {

  // ======================================================================
  // SUBSECCIÓN 3.1: INYECCIÓN DE DEPENDENCIAS
  // ======================================================================

  private api = inject(SubjectService);    // Servicio CRUD de materias
  private auth = inject(AuthService);      // Servicio de autenticación (para verificar rol)
  private router = inject(Router);         // Router para navegación
  private snackBar = inject(MatSnackBar);  // Notificaciones Material
  private dialog = inject(MatDialog);      // Diálogos de confirmación

  // ======================================================================
  // SUBSECCIÓN 3.2: ESTADO REACTIVO (SIGNALS)
  // ======================================================================
  /**
   * all - Signal que contiene todas las materias
   * Signal permite notificar cambios automáticamente al template
   */

  all = signal<Subject[]>([]);

  /**
   * query - Signal que contiene el texto de búsqueda
   * Usado para filtrar materias en tiempo real
   */

  query = signal('');

  /**
   * filtered - Computed signal que filtra materias automáticamente
   * Se recalcula cada vez que cambia 'query' o 'all'
   */

  filtered = computed(() => {
    const k = this.query().toLowerCase();
    return this.all().filter(s => s.name.toLowerCase().includes(k));
  });

  // ======================================================================
  // SUBSECCIÓN 3.3: INDICADORES DE CARGA
  // ======================================================================

  loading = false;     // Carga general de materias
  loadingAdd = false;  // Carga al agregar nueva materia

  // ======================================================================
  // SUBSECCIÓN 3.4: FORMULARIO DE NUEVA MATERIA
  // ======================================================================

  newName = '';
  newObjective = '';
  newContent = '';

  // ======================================================================
  // SUBSECCIÓN 3.2B: ESTADO DE FILTRO DE SUSCRIPCIONES
  // ======================================================================
  
  showOnlySubscribed = false;  // Estado del filtro de suscripciones

  // ======================================================================
  // SUBSECCIÓN 3.5: CONSTRUCTOR E INICIALIZACIÓN
  // ======================================================================
  /**
   * Constructor - Se ejecuta al crear el componente
   * Carga las materias al iniciar
   */

  constructor() {
    // Si no es admin, por defecto mostrar solo materias suscritas
    if (!this.auth.isAdmin()) {
      this.showOnlySubscribed = true;
    }
    this.reload();
  }

  // ======================================================================
  // SUBSECCI�N 3.5C: M�TODOS DE FILTRO Y NAVEGACI�N
  // ======================================================================
  
  /**
   * toggleFilter - Alterna entre mostrar todas las materias o solo las suscritas
   */
  toggleFilter() {
    this.showOnlySubscribed = !this.showOnlySubscribed;
    this.reload();
  }

  /**
   * goToSubscriptions - Navega a la p�gina de gesti�n de suscripciones
   */
  goToSubscriptions() {
    this.router.navigate(['/subscriptions']);
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  // ======================================================================
  // SUBSECCIÓN 3.6: MÉTODO RELOAD (CARGAR MATERIAS)
  // ======================================================================
  /**
   * reload - Recarga todas las materias desde el backend
   * 
   * Se ejecuta:
   * - Al iniciar el componente (constructor)
   * - Después de agregar, editar o eliminar una materia
   * 
   * Flujo:
   * 1. Activa indicador de carga
   * 2. Llama al servicio para obtener todas las materias
   * 3. Si es exitoso: actualiza el signal 'all'
   * 4. Si hay error: muestra mensaje según código HTTP
   */

  reload() {
    this.loading = true;
    
    // Admin siempre ve todas las materias, usuarios normales pueden filtrar
    const observable = (this.showOnlySubscribed && !this.auth.isAdmin())
      ? this.api.getMySubscriptions()
      : this.api.list();
    
    observable.subscribe({
      next: (response: any) => {
        // Si es respuesta de suscripciones, viene en response.data
        const subjects = response.data || response;
        this.all.set(subjects);  // Actualizar materias
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        
        // Determinar mensaje de error según código HTTP
        let message = MESSAGES.ERROR_LOADING;
        
        if (err.status === 401) {
          message = MESSAGES.ERROR_UNAUTHORIZED;  // Token inválido/expirado
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;       // Sin conexión
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;        // Error del servidor
        }
        
        // Mostrar notificación de error
        this.snackBar.open(message, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  // ===================================
  // SUBSECCIÓN 3.7: MÉTODO ADD (AGREGAR MATERIA)
  // ===================================
  /**
   * add - Agrega una nueva materia
   * 
   * Validaciones:
   * - Nombre no puede estar vacío
   * - Objetivo no puede estar vacío
   * - Contenido no puede estar vacío
   * 
   * Flujo:
   * 1. Valida los campos del formulario
   * 2. Crea objeto Subject con los datos
   * 3. Activa indicador de carga
   * 4. Llama al servicio para crear la materia
   * 5. Si es exitoso:
   *    - Muestra notificación de éxito
   *    - Limpia el formulario
   *    - Recarga la lista de materias
   * 6. Si hay error: muestra mensaje según código HTTP
   */

  add() {

    // ===================================
    // PASO 1: VERIFICAR PERMISOS
    // ===================================
    if (!this.auth.isAdmin()) {
      this.snackBar.open('No tienes permisos para agregar materias', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // ===================================
    // PASO 2: VALIDACIONES
    // ===================================
    if (!this.newName.trim()) {
      this.snackBar.open('El nombre de la materia no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (!this.newObjective.trim()) {
      this.snackBar.open('El objetivo no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    if (!this.newContent.trim()) {
      this.snackBar.open('El contenido no puede estar vacío', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    
    // ===================================
    // PASO 2: CREAR OBJETO MATERIA
    // ===================================
    const newSubject: Subject = {
      name: this.newName.trim(),
      objective: this.newObjective.trim(),
      content: this.newContent.trim()
    };
    
    // ===================================
    // PASO 3: LLAMAR AL BACKEND
    // ===================================
    this.loadingAdd = true;  // Activar indicador de carga
    
    this.api.add(newSubject)
      .subscribe({

        // ===================================
        // CASO ÉXITO: Materia creada
        // ===================================

        next: (subject) => {
          this.loadingAdd = false;
          
          // Notificar éxito
          this.snackBar.open(MESSAGES.SUBJECT_ADDED, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          // Limpiar formulario
          this.newName = '';
          this.newObjective = '';
          this.newContent = '';
          
          // Recargar lista de materias
          this.reload();
        },

        // ===================================
        // CASO ERROR: No se pudo crear
        // ===================================

        error: (err) => {
          this.loadingAdd = false;
          
          // Determinar mensaje según código HTTP
          let message = MESSAGES.ERROR_SAVING;
          
          if (err.status === 400) {
            // Nombre duplicado o datos inválidos
            message = err.error?.error || MESSAGES.SUBJECT_EXISTS;
          } else if (err.status === 401) {
            message = MESSAGES.ERROR_UNAUTHORIZED;
          } else if (err.status === 0) {
            message = MESSAGES.ERROR_NETWORK;
          } else if (err.status >= 500) {
            message = MESSAGES.ERROR_SERVER;
          }
          
          // Mostrar error
          this.snackBar.open(`No se pudo agregar la materia: ${message}`, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
  }

  // ===================================
  // SUBSECCIÓN 3.8: MÉTODO EDIT (EDITAR MATERIA)
  // ===================================
  /**
   * edit - Edita el nombre de una materia existente
   * 
   * Flujo:
   * 1. Muestra prompt nativo para ingresar nuevo nombre
   * 2. Valida que el nombre no esté vacío y sea diferente
   * 3. Llama al servicio para actualizar
   * 4. Si es exitoso:
   *    - Muestra notificación de éxito
   *    - Recarga la lista
   * 5. Si hay error: muestra mensaje según código HTTP
   * 
   * @param s - Materia a editar
   */

  edit(s: Subject) {

    // ===================================
    // VERIFICAR PERMISOS
    // ===================================
    if (!this.auth.isAdmin()) {
      this.snackBar.open('No tienes permisos para editar materias', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // Pedir nuevo nombre mediante prompt nativo
    const name = prompt('Nuevo nombre', s.name);
    if (!name || name.trim() === '') return;  // Cancelado o vacío
    
    // Validar que sea diferente al actual
    if (name.trim() === s.name) {
      this.snackBar.open('El nombre es el mismo', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }
    
    // Actualizar materia en el backend
    this.api.update(s._id!, { ...s, name: name.trim() }).subscribe({

      // ===================================
      // CASO ÉXITO: Materia actualizada
      // ===================================

      next: () => {
        this.snackBar.open(MESSAGES.SUBJECT_UPDATED, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.reload();
      },

      // ===================================
      // CASO ERROR: No se pudo actualizar
      // ===================================

      error: (err) => {
        let message = MESSAGES.ERROR_SAVING;
        
        if (err.status === 401) {
          message = MESSAGES.ERROR_UNAUTHORIZED;
        } else if (err.status === 404) {
          message = 'Materia no encontrada';
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;
        } else if (err.error?.message) {
          message = err.error.message;
        }
        
        this.snackBar.open(`Error al editar: ${message}`, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  // ===================================
  // SUBSECCIÓN 3.9: MÉTODO REMOVE (ELIMINAR MATERIA)
  // ===================================
  /**
   * remove - Elimina una materia previa confirmación
   * 
   * Flujo:
   * 1. Abre diálogo de confirmación con nombre de la materia
   * 2. Si el usuario confirma:
   *    - Llama al servicio para eliminar
   *    - Si es exitoso: muestra notificación y recarga lista
   *    - Si hay error: muestra mensaje según código HTTP
   * 3. Si cancela: no hace nada
   * 
   * @param s - Materia a eliminar
   */

  remove(s: Subject) {

    // ===================================
    // VERIFICAR PERMISOS
    // ===================================
    if (!this.auth.isAdmin()) {
      this.snackBar.open('No tienes permisos para eliminar materias', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // Abrir diálogo de confirmación Material
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar materia',
        message: `${MESSAGES.SUBJECT_DELETE_CONFIRM}\n\n"${s.name}"`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    // Escuchar resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // Si el usuario confirmó (result === true)
        // Llamar al backend para eliminar
        this.api.remove(s.name).subscribe({

          // ===================================
          // CASO ÉXITO: Materia eliminada
          // ===================================

          next: () => {
            this.snackBar.open(MESSAGES.SUBJECT_DELETED, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.reload();
          },

          // ===================================
          // CASO ERROR: No se pudo eliminar
          // ===================================
          
          error: (err) => {
            let message = MESSAGES.ERROR_SAVING;
            
            if (err.status === 401) {
              message = MESSAGES.ERROR_UNAUTHORIZED;
            } else if (err.status === 404) {
              message = 'Materia no encontrada';
            } else if (err.status === 0) {
              message = MESSAGES.ERROR_NETWORK;
            } else if (err.status >= 500) {
              message = MESSAGES.ERROR_SERVER;
            } else if (err.error?.message) {
              message = err.error.message;
            }
            
            this.snackBar.open(`Error al eliminar: ${message}`, 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }
}


