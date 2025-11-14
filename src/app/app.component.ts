import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NgIf } from '@angular/common';
import { MESSAGES } from './constants/messages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf, MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  logout() {
    if (confirm(MESSAGES.LOGOUT_CONFIRM)) {
      this.auth.logout();
      this.router.navigate(['/login']);
      this.snackBar.open(MESSAGES.LOGOUT_SUCCESS, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
}