import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
  <section class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <img src="/logo.png" alt="EduTrack Logo" class="logo-image" />
        <h1 class="logo-title">EduTrack</h1>
        <p class="logo-subtitle">UTN - Facultad Regional Venado Tuerto</p>
      </div>
      
      <div class="form-section">
        <h2 class="form-title">Iniciar sesión</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📧</span>
              Email
            </label>
            <input 
              formControlName="email" 
              type="email"
              class="form-input"
              placeholder="tu@email.com"
            />
            <div class="form-error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Email inválido
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🔒</span>
              Contraseña
            </label>
            <input 
              formControlName="password" 
              type="password"
              class="form-input"
              placeholder="••••••••"
            />
            <div class="form-error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Contraseña requerida
            </div>
          </div>
          
          <button 
            type="submit" 
            [disabled]="form.invalid" 
            class="btn-submit"
            [class.btn-disabled]="form.invalid"
          >
            <span class="btn-icon">🚀</span>
            Entrar
          </button>
        </form>
        
        <div class="footer-link">
          <p>¿No tenés cuenta? <a routerLink="/register" class="link">Registrate aquí</a></p>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .login-card {
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 440px;
      width: 100%;
      overflow: hidden;
      animation: slideIn 0.4s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 3rem 2rem;
      text-align: center;
      color: white;
    }

    .logo-image {
      width: 120px;
      height: 120px;
      object-fit: contain;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .logo-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .logo-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.95;
      font-weight: 300;
    }

    .form-section {
      padding: 2.5rem 2rem;
    }

    .form-title {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 2rem 0;
      color: #2d3748;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 0.5rem;
    }

    .label-icon {
      font-size: 1.2rem;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f7fafc;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-input::placeholder {
      color: #a0aec0;
    }

    .form-error {
      color: #e53e3e;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .form-error::before {
      content: '⚠️';
    }

    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 2rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:hover:not(.btn-disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .btn-submit:active:not(.btn-disabled) {
      transform: translateY(0);
    }

    .btn-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-icon {
      font-size: 1.3rem;
    }

    .footer-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .footer-link p {
      margin: 0;
      color: #718096;
      font-size: 0.95rem;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .login-container {
        padding: 1rem;
      }

      .logo-section {
        padding: 2rem 1.5rem;
      }

      .logo-icon {
        font-size: 3rem;
      }

      .logo-title {
        font-size: 2rem;
      }

      .form-section {
        padding: 2rem 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(){
    if(this.form.invalid) return;
    const {email, password} = this.form.value as any;
    this.auth.login(email, password).subscribe({
      next: (res) => {
        console.log('✅ Login exitoso, respuesta completa:', res);
        const token = res.data.token;
        console.log('🔑 Token recibido:', token);
        
        if (token) {
          this.auth.saveToken(token);
          console.log('💾 Token guardado en localStorage');
          this.router.navigate(['/subjects']);
        } else {
          console.error('⚠️ No se encontró el token en la respuesta');
          alert('Error: No se recibió el token de autenticación');
        }
      },
      error: (err) => {
        console.error('❌ Error completo:', err);
        let message = 'Error desconocido';
        
        if (err.status === 403) {
          message = 'Contraseña incorrecta';
        } else if (err.status === 404) {
          message = 'Usuario no encontrado';
        } else if (err.error?.error) {
          message = err.error.error;
        }
        
        alert(`Error al iniciar sesión: ${message}`);
      }
    });
  }
}
