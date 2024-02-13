import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible.');
      this.router.navigate(['/login']);
      return false;
    }
  
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));
      const rolesPermitidos = route.data['roles'];
  
      if (rolesPermitidos) {
        if (decodedPayload && rolesPermitidos.includes(decodedPayload.rol)) {
          return true; 
        }
      } else {
        return true; 
      }
    } catch (error) {
      console.error('Error al decodificar el token: ', error);
    }
  
    this.router.navigate(['/login']); 
    return false;
  }
}