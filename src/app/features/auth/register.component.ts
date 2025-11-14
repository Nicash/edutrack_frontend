import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MESSAGES } from '../../constants/messages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

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
  template: `
  <div class="register-container">
    <mat-card class="register-card">
      <mat-card-header class="header">
        <div class="logo-section">
          <img src="/logo.png" alt="EduTrack Logo" class="logo" />
          <mat-card-title>EduTrack</mat-card-title>
          <mat-card-subtitle>UTN - Facultad Regional Venado Tuerto</mat-card-subtitle>
        </div>
      </mat-card-header>
      
      <mat-card-content>
        <h2 class="title">Crear cuenta</h2>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre completo</mat-label>
            <input matInput type="text" formControlName="name" placeholder="Juan Pérez">
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="form.get('name')?.hasError('required')">
              El nombre es requerido
            </mat-error>
            <mat-error *ngIf="form.get('name')?.hasError('minlength')">
              Mínimo 3 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="tu@email.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Email inválido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="••••••••">
            <mat-icon matPrefix>lock</mat-icon>
            <mat-error *ngIf="form.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">
              Mínimo 6 caracteres
            </mat-error>
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="submit-btn"
            [disabled]="form.invalid || loading"
          >
            <mat-icon *ngIf="!loading">person_add</mat-icon>
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            {{ loading ? 'Creando cuenta...' : 'Registrarse' }}
          </button>
        </form>
      </mat-card-content>
      
      <mat-card-actions>
        <p class="login-link">
          ¿Ya tenés cuenta? 
          <a routerLink="/login" mat-button color="accent">Iniciar sesión</a>
        </p>
      </mat-card-actions>
    </mat-card>
  </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
      padding: 20px;
    }

    .register-card {
      width: 100%;
      max-width: 450px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .header {
      background: linear-gradient(135deg, #5e72e4 0%, #825ee4 100%);
      color: white;
      padding: 30px 20px;
      margin: -16px -16px 20px -16px;
    }

    .logo-section {
      text-align: center;
      width: 100%;
    }

    .logo {
      width: 100px;
      height: 100px;
      margin-bottom: 16px;
    }

    mat-card-title {
      font-size: 28px;
      margin-bottom: 8px;
      text-align: center;
      color: white !important;
    }

    mat-card-subtitle {
      font-size: 14px;
      text-align: center;
      color: rgba(255, 255, 255, 0.9) !important;
    }

    .title {
      text-align: center;
      margin-bottom: 24px;
      color: #333;
      font-weight: 500;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .submit-btn {
      margin-top: 16px;
      height: 48px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    mat-card-actions {
      justify-content: center;
      padding: 16px;
    }

    .login-link {
      text-align: center;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 600px) {
      .register-container {
        padding: 10px;
      }
      
      .logo {
        width: 80px;
        height: 80px;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.snackBar.open(MESSAGES.REQUIRED_FIELDS, 'Cerrar', { duration: 3000 });
      return;
    }

    const { name, email, password } = this.form.value as any;

    this.loading = true;

    this.auth.register(name, email, password).subscribe({
      next: (res) => {
        console.log('✅ Registro exitoso:', res);
        this.loading = false;
        
        this.snackBar.open(MESSAGES.REGISTER_SUCCESS, 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.loading = false;
        
        let message = MESSAGES.REGISTER_ERROR;
        
        if (err.status === 400) {
          message = err.error?.error || 'El email ya está registrado';
        } else if (err.status === 0) {
          message = MESSAGES.ERROR_NETWORK;
        } else if (err.status >= 500) {
          message = MESSAGES.ERROR_SERVER;
        } else if (err.error?.message) {
          message = err.error.message;
        }
        
        this.snackBar.open(`Error: ${message}`, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
