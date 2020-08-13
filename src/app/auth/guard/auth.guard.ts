import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    
    constructor (
        private authService: AuthService,
        private router: Router) {}

    canActivate () {
        if(this.authService.loggedIn()) {
            this.router.navigate(['/home/plan']);
        }
        return !this.authService.loggedIn();
    }
}