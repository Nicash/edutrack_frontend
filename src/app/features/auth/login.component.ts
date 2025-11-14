// ===================================
// SECCIÓN 1: IMPORTACIONES
// ===================================
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
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

// ======================================================================
// SECCIÓN 3: LÓGICA DEL COMPONENTE
// ===================================
/**
 * LoginComponent - Componente de inicio de sesión
 * 
 * Responsabilidades:
 * - Renderizar formulario de login con validaciones
 * - Enviar credenciales al backend
 * - Guardar token JWT al recibir respuesta exitosa
 * - Manejar errores de autenticación
 * - Redirigir a /subjects tras login exitoso
 */

export class LoginComponent {

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

  loading = false;  // Indicador de carga (activa spinner durante petición HTTP)

  // ======================================================================
  // SUBSECCIÓN 3.3: FORMULARIO REACTIVO
  // ======================================================================
  /**
   * form - Formulario reactivo con validaciones
   * 
   * Campos:
   * - email: requerido + validación de formato email
   * - password: requerido + mínimo 6 caracteres
   */

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // ======================================================================
  // SUBSECCIÓN 3.4: MÉTODO DE ENVÍO
  // ======================================================================
  /**
   * onSubmit - Maneja el envío del formulario de login
   * 
   * Flujo:
   * 1. Valida que el formulario sea válido
   * 2. Extrae email y password
   * 3. Activa indicador de carga
   * 4. Llama al servicio de autenticación
   * 5. Si es exitoso:
   *    - Guarda el token en localStorage
   *    - Muestra notificación de éxito
   *    - Redirige a /subjects
   * 6. Si hay error:
   *    - Muestra mensaje de error específico según código HTTP
   */

  onSubmit() {

    // Validación del formulario
    if (this.form.invalid) {
      this.snackBar.open(MESSAGES.REQUIRED_FIELDS, 'Cerrar', { duration: 3000 });
      return;
    }

    // Extraer valores del formulario
    const { email, password } = this.form.value as any;

    // Activar indicador de carga
    this.loading = true;

    // Llamar al backend
    this.auth.login(email, password).subscribe({

      // ===================================
      // CASO ÉXITO: Token recibido correctamente
      // ===================================

      next: (res) => {
        const token = res.data.token;
        
        if (token) {
          // Guardar token en localStorage
          this.auth.saveToken(token);
          // Notificar éxito
          this.snackBar.open(MESSAGES.LOGIN_SUCCESS, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Redirigir a página de materias
          this.router.navigate(['/subjects']);
        } else {
          // Token no recibido (error inesperado)
          this.snackBar.open('Error: No se recibió el token', 'Cerrar', { duration: 4000 });
        }
        
        this.loading = false;
      },
      
      // ===================================
      // CASO ERROR: Credenciales incorrectas o problema del servidor
      // ===================================

      error: (err) => {
        this.loading = false;
        
        // Determinar mensaje según código de error HTTP
        let message = MESSAGES.LOGIN_ERROR;
        
        if (err.status === 403) {
          message = 'Contraseña incorrecta';
        } else if (err.status === 404) {
          message = 'Usuario no encontrado';
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;
        } else if (err.error?.error) {
          message = err.error.error;
        }
        
        // Mostrar error al usuario
        this.snackBar.open(`Error: ${message}`, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
