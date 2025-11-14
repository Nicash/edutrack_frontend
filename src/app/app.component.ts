import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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