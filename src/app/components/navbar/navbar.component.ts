import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { SnackService } from "../../services/snack.service";
import { SettingsService } from "../../services/settings.service";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  settingsOpened: boolean = false;
  settingsRef: MatDialogRef<any>;

  @Output() logout: EventEmitter<void> = new EventEmitter();

  constructor(
    private auth: AuthService,
    private snack: SnackService,
    private settingsService: SettingsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.settingsService.settingsState.subscribe(res => this.settingsOpened = res);
  }

  onLogout() {
    this.auth.logout().then(res => {
      localStorage.clear();
      this.logout.emit();
    }).catch(err => console.log(err));
  }

  onClick() {
    if (!this.settingsOpened) {
      this.settingsRef = this.settingsService.openSettings();
    } else {
      this.settingsRef.close();
    }
  }

  public isLinkActive(url: string): boolean {
    const reg = url === '/' ? /\/\?/ : /\/favorites\?/;
    return reg.test(this.router.url);
  }
}
