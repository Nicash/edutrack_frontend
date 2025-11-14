import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf } from '@angular/common';
import { MESSAGES } from './constants/messages';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  logout() {
    if (confirm(MESSAGES.LOGOUT_CONFIRM)) {
      this.auth.logout();
      this.router.navigate(['/login']);
      this.toast.success(MESSAGES.LOGOUT_SUCCESS);
    }
  }
}