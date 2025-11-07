import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  template: `
    <nav class="topbar" *ngIf="auth.isLoggedIn()">
      <div class="nav-content">
        <a routerLink="/subjects" class="brand">
          <img src="/logo.png" alt="EduTrack Logo" class="brand-icon" />
          <span class="brand-text">EduTrack</span>
        </a>
        <div class="nav-actions">
          <button (click)="logout()" class="btn-logout">
            <span class="icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
    <router-outlet/>
  `,
  styles: [`
    .topbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      transition: transform 0.2s ease;
    }

    .brand:hover {
      transform: scale(1.05);
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      object-fit: contain;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .brand-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .nav-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-logout:active {
      transform: translateY(0);
    }

    .icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .nav-content {
        padding: 1rem;
      }

      .brand-text {
        display: none;
      }

      .btn-logout {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    if (confirm('¿Estás seguro que querés cerrar sesión?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }
}