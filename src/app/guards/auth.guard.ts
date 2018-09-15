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
    this.spinner.show();

    this.auth.token.subscribe(res => {
      if (res) this._token = res;
    });

    if (!this._token) {
      setTimeout(() => {
        this.router.navigate(['/login']);
        this.spinner.hide();
      }, 1000);

      return false;
    }

    this.spinner.hide();
    return true;
  }
}
