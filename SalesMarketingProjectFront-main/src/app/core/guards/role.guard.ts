import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];
  const userRole = authService.getUserRole();

  if (authService.isLoggedIn() && userRole === expectedRole) {
    return true;
  }

  if (authService.isLoggedIn() && userRole === 'entry') {
    router.navigate(['/sales/add']);
    return false;
  }

  router.navigate(['/auth/login']);
  return false;
};
