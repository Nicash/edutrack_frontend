// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================

import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf } from '@angular/common';
import { MESSAGES } from './constants/messages';

// Importaciones de Angular Material

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

// ======================================================================
// SECCIÓN 2: CONFIGURACIÓN DEL COMPONENTE
// ======================================================================

@Component({
  selector: 'app-root',
  standalone: true,  // Componente standalone (no necesita módulo)
  imports: [RouterOutlet, RouterLink, NgIf, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

// ======================================================================
// SECCIÓN 3: LÓGICA DEL COMPONENTE
// ======================================================================
/**
 * AppComponent - Componente raíz de la aplicación
 * 
 * Responsabilidades:
 * - Renderizar la barra de navegación (toolbar)
 * - Gestionar el logout del usuario
 * - Mostrar/ocultar opciones según estado de autenticación
 */

export class AppComponent {

  // ======================================================================
  // SUBSECCIÓN 3.1: INYECCIÓN DE DEPENDENCIAS
  // ======================================================================

  auth = inject(AuthService);              // Servicio de autenticación (público para usar en template)
  private router = inject(Router);         // Router para navegación programática
  private snackBar = inject(MatSnackBar);  // Snackbar para notificaciones
  private dialog = inject(MatDialog);      // Dialog para confirmaciones

  // ======================================================================
  // SUBSECCIÓN 3.2: MÉTODO DE LOGOUT
  // ======================================================================
  /**
   * logout - Cierra la sesión del usuario
   * 
   * Flujo:
   * 1. Abre diálogo de confirmación (Material Dialog)
   * 2. Si el usuario confirma:
   *    - Elimina el token de localStorage
   *    - Redirige al login
   *    - Muestra notificación de éxito
   * 3. Si cancela: no hace nada
   */
  
  logout() {
    // Abrir diálogo de confirmación
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cerrar sesión',
        message: MESSAGES.LOGOUT_CONFIRM,
        confirmText: 'Cerrar sesión',
        cancelText: 'Cancelar'
      }
    });

    // Escuchar el resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result) {  // Si el usuario confirmó (result === true)
        this.auth.logout();                  // Eliminar token
        this.router.navigate(['/login']);    // Redirigir a login
        this.snackBar.open(MESSAGES.LOGOUT_SUCCESS, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}