import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard para rutas públicas (login/register)
// Si ya está logueado, redirige a /subjects
export const publicGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.isLoggedIn()) {
    router.navigate(['/subjects']);
    return false;
  }
  
  return true;
};
