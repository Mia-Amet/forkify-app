import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  token: string;

  @Output() logout: EventEmitter<void> = new EventEmitter();

  constructor(
    private auth: AuthService,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    this.auth.token.subscribe(res => {
      if (res) this.token = res;
    });
  }

  onLogout() {
    this.auth.logout().then(res => {
      this.logout.emit();
    }).catch(err => {
      this.dialog.success(`Oops... ${err.message}`, 'Error!');
    });
  }
}
