import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})

export class HomeGuard implements CanActivate, CanLoad {
    
    constructor(
        private authService: AuthService,
        private router: Router) {}

    canActivate() {
      return this.canLoad();
    } 

    canLoad() {
      if(!this.authService.loggedIn()) {
        this.router.navigate[('/login')];
      }
      return this.authService.loggedIn();
    }
}