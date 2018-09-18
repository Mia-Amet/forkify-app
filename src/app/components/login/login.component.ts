import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { MyValidators } from "../../services/my-validators.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SnackService } from "../../services/snack.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    public validators: MyValidators,
    private snack: SnackService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.minLength(5), Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), MyValidators.passwordCheck])
    });

    this.auth.user.subscribe(user => {
      if (user !== null) this.router.navigate(['/']);
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      const controls = Object.keys(this.loginForm.controls);
      controls.forEach(controlName => this.loginForm.get(controlName).markAsDirty());
      return;
    }

    this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        if (res !== null) {
          localStorage.setItem('uid', res.user.uid);
          this.snack.success(`Hello, ${this.loginForm.value.email.split('@')[0]}`);
          this.router.navigate(['/']);
        }
      }).catch(err => {
        this.snack.error(`${err.message}`);
        this.loginForm.reset();
    });
  }
}
