import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _token: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    public spinner: NgxSpinnerService
  ) { }

  canActivate(): boolean {
    this.auth.token.subscribe(res => {
      if (res) this._token = res;
    });

    if (!this._token) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
