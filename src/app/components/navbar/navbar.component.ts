import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsComponent } from "../settings/settings.component";
import { AuthService } from "../../services/auth.service";
import { SnackService } from "../../services/snack.service";
import { DialogService } from "../../services/dialog.service";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  settingsOpened: boolean = false;
  settingsRef: MatDialogRef<SettingsComponent>;

  @Output() logout: EventEmitter<void> = new EventEmitter();

  constructor(
    private auth: AuthService,
    private snack: SnackService,
    private settingsService: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.settingsService.settingsState.subscribe(res => this.settingsOpened = res);
  }

  onLogout(): void {
    this.auth.logout().then(() => {
      localStorage.clear();
      this.logout.emit();
    }).catch(err => console.log(err));
  }

  onClick(): void {
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
