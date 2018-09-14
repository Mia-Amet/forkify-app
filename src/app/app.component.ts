import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Forkify';
  isToken: boolean;
  private uid: string;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.token.subscribe(res => this.isToken = !!res);
    this.auth.uid.subscribe(res => this.uid = res);

    if (!this.uid) {
      this.auth.user.subscribe(res => {
        this.auth.emitUid(res.uid);
      });
    }
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.auth.emitUid('');
  }
}
