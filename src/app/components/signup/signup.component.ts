import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MyValidators } from "../../services/my-validators.service";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    public validators: MyValidators,
    private dialog: DialogService
  ) { }

  ngOnInit() {
    if (this.auth.isAuth()) this.router.navigate(['/']);

    this.signupForm = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.minLength(5), Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8), MyValidators.passwordCheck]),
      confirmPassword: new FormControl('',
        [Validators.required, Validators.minLength(8)])
    }, MyValidators.passwordMatch);
  }

  onSignup() {
    if (this.signupForm.invalid) {
      const controls = Object.keys(this.signupForm.controls);
      console.log(controls);
      controls.forEach(controlName => this.signupForm.get(controlName).markAsDirty());
      return;
    }

    this.auth.signup(this.signupForm.value.email, this.signupForm.value.password)
      .then(res => {
      this.dialog.success('Thank you for signing up to Forkify', 'Success!');
      this.router.navigate(['/']);
    }).catch(err => {
      this.dialog.error(`${err.message}`, `Error!`);
      this.signupForm.reset();
    });
  }
}
