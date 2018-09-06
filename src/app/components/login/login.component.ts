import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { MyValidators } from "../../services/my-validators.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DialogService } from "../../services/dialog.service";

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
    private dialog: DialogService
  ) { }

  ngOnInit() {
    if (this.auth.isAuth()) this.router.navigate(['/']);

    this.loginForm = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.minLength(5), Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), MyValidators.passwordCheck])
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      const controls = Object.keys(this.loginForm.controls);
      console.log(controls);
      controls.forEach(controlName => this.loginForm.get(controlName).markAsDirty());
      return;
    }

    this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
      .then(res => {
        this.dialog.success('Redirecting to the main page...', 'Success!');
        this.router.navigate(['/']);
      }).catch(err => {
        this.dialog.error(`${err.message}`, `Error!`);
        this.loginForm.reset();
    });
  }

  onFbLogin() {
    // this.auth.signinWithFb()
    //   .then(res => {
    //     this.dialog.success('Redirecting to the main page...', 'Success!');
    //     this.router.navigate(['/']);
    //   }).catch(err => {
    //     console.log(err);
    //     this.dialog.error('Oops... It seems the app is not deployed yet', 'Error!');
    //     this.loginForm.reset();
    // });

    this.dialog.error('Oops... It seems the app is not deployed yet', 'Error!');
    this.loginForm.reset();
  }

  onGoogleLogin() {
    this.auth.signinWithGoogle()
      .then(res => {
        this.dialog.success('Redirecting to the main page...', 'Success!');
        this.router.navigate(['/']);
      }).catch(err => {
      this.dialog.error(`${err.message}`, `Error!`);
      this.loginForm.reset();
    });
  }
}
