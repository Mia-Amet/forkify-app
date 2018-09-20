import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService,
    public spinner: NgxSpinnerService
  ) { }

  canActivate(): Observable<boolean> | boolean {
    return this.auth.authState.pipe(
      map(auth => {
        if (auth) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      first()
    );
  }
}
