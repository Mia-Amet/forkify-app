import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.auth.isAuth()) this.router.navigate(['/login']);
  }

  onLogout() {
    this.auth.logout().then(res => {
      // dialog
      this.router.navigate(['/login']);
      console.log(res);
    }).catch(err => console.log(err));
  }
}
