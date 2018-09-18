import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SwitchLanguageService } from "./services/switch-language.service";
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Forkify';
  isAuth: boolean;

  constructor(
    private router: Router,
    private switchLanguageService: SwitchLanguageService,
    private auth: AuthService
  ) {
    this.switchLanguageService.setDefaultLanguage();
  }

  ngOnInit() {
    this.auth.authState.subscribe(res => this.isAuth = !!res);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
