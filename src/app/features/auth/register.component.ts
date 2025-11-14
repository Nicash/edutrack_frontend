// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================

import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MESSAGES } from '../../constants/messages';

// Importaciones de Angular Material

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

// ======================================================================
// SECCIÓN 2: CONFIGURACIÓN DEL COMPONENTE
// ======================================================================

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    RouterLink, 
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

// ======================================================================
// SECCIÓN 3: LÓGICA DEL COMPONENTE
// ======================================================================
/**
 * RegisterComponent - Componente de registro de nuevos usuarios
 * 
 * Responsabilidades:
 * - Renderizar formulario de registro con validaciones
 * - Enviar datos del nuevo usuario al backend
 * - Manejar respuestas exitosas y errores
 * - Redirigir a login tras registro exitoso
 */

export class RegisterComponent {

  // ======================================================================
  // SUBSECCIÓN 3.1: INYECCIÓN DE DEPENDENCIAS
  // ======================================================================

  private fb = inject(FormBuilder);        // Constructor de formularios reactivos
  private auth = inject(AuthService);      // Servicio de autenticación
  private router = inject(Router);         // Router para navegación
  private snackBar = inject(MatSnackBar);  // Notificaciones Material

  // ======================================================================
  // SUBSECCIÓN 3.2: ESTADO DEL COMPONENTE
  // ======================================================================

  loading = false;  // Indicador de carga durante petición HTTP

  // ======================================================================
  // SUBSECCIÓN 3.3: FORMULARIO REACTIVO
  // ======================================================================
  /**
   * form - Formulario reactivo con validaciones
   * 
   * Campos:
   * - name: requerido + mínimo 3 caracteres
   * - email: requerido + validación de formato email
   * - password: requerido + mínimo 6 caracteres
   */

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // ======================================================================
  // SUBSECCIÓN 3.4: MÉTODO DE ENVÍO
  // ======================================================================
  /**
   * onSubmit - Maneja el envío del formulario de registro
   * 
   * Flujo:
   * 1. Valida que el formulario sea válido
   * 2. Extrae name, email y password
   * 3. Activa indicador de carga
   * 4. Llama al servicio de autenticación para registrar
   * 5. Si es exitoso:
   *    - Muestra notificación de éxito
   *    - Redirige a /login para que el usuario inicie sesión
   * 6. Si hay error:
   *    - Muestra mensaje de error específico (ej: email duplicado)
   * 
   * Nota: El registro NO devuelve token, el usuario debe hacer login después
   */

  onSubmit() {

    // Validación del formulario
    if (this.form.invalid) {
      this.snackBar.open(MESSAGES.REQUIRED_FIELDS, 'Cerrar', { duration: 3000 });
      return;
    }

    // Extraer valores del formulario
    const { name, email, password } = this.form.value as any;

    // Activar indicador de carga
    this.loading = true;

    // Llamar al backend para registrar
    this.auth.register(name, email, password).subscribe({

      // ===================================
      // CASO ÉXITO: Usuario creado correctamente
      // ===================================
      next: (res) => {
        this.loading = false;
        
        // Notificar éxito
        this.snackBar.open(MESSAGES.REGISTER_SUCCESS, 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Redirigir a login para que inicie sesión
        this.router.navigate(['/login']);
      },

      // ===================================
      // CASO ERROR: Email duplicado u otro problema
      // ===================================
      
      error: (err) => {
        this.loading = false;
        
        // Determinar mensaje según código de error HTTP
        let message = MESSAGES.REGISTER_ERROR;
        
        if (err.status === 400) {
          // Email duplicado o datos inválidos
          message = err.error?.error || 'El email ya está registrado';
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;
        } else if (err.error?.message) {
          message = err.error.message;
        }
        
        // Mostrar error al usuario
        this.snackBar.open(`Error: ${message}`, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
