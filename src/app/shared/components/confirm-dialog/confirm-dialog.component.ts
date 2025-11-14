// ======================================================================
// SECCIÓN 1: IMPORTACIONES
// ======================================================================

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// ======================================================================
// SECCIÓN 2: INTERFAZ DE DATOS
// ======================================================================
/**
 * ConfirmDialogData - Estructura de datos para el diálogo de confirmación
 * 
 * Campos:
 * - title: Título del diálogo (ej: "Eliminar materia")
 * - message: Mensaje de confirmación (ej: "¿Está seguro?")
 * - confirmText: Texto del botón de confirmar (opcional, default: "Confirmar")
 * - cancelText: Texto del botón de cancelar (opcional, default: "Cancelar")
 */

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

// ======================================================================
// SECCIÓN 3: CONFIGURACIÓN DEL COMPONENTE
// ======================================================================

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p style="white-space: pre-line;">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ data.cancelText || 'Cancelar' }}</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">{{ data.confirmText || 'Confirmar' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px 0;
    }
    p {
      margin: 0;
      font-size: 14px;
    }
  `]
})

// ======================================================================
// SECCIÓN 4: LÓGICA DEL COMPONENTE
// ======================================================================
/**
 * ConfirmDialogComponent - Diálogo reutilizable de confirmación
 * 
 * Responsabilidades:
 * - Mostrar un mensaje de confirmación al usuario
 * - Devolver true si confirma, false si cancela
 * 
 * Uso:
 * ```typescript
 * const dialogRef = this.dialog.open(ConfirmDialogComponent, {
 *   data: { title: 'Título', message: 'Mensaje' }
 * });
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result) {
 *     // Usuario confirmó
 *   }
 * });
 * ```
 */

export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  /**
   * onConfirm - Se ejecuta al hacer clic en "Confirmar"
   * Cierra el diálogo y devuelve true
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * onCancel - Se ejecuta al hacer clic en "Cancelar"
   * Cierra el diálogo y devuelve false
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
