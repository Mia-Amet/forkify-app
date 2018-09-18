import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MyValidators } from "../../services/my-validators.service";
import { SnackService } from "../../services/snack.service";
import {AngularFirestoreCollection} from "angularfire2/firestore";

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
    private snack: SnackService
  ) { }

  ngOnInit() {
    this.auth.user.subscribe(user => {
      if (user !== null) this.router.navigate(['/']);
    });

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
      controls.forEach(controlName => this.signupForm.get(controlName).markAsDirty());
      return;
    }

    this.auth.signup(this.signupForm.value.email, this.signupForm.value.password)
      .then(res => {
        if (res !== null) {
          localStorage.setItem('uid', res.user.uid);
          this.snack.success(`Nice to meet you, ${this.signupForm.value.email.split('@')[0]}`);
          this.router.navigate(['/']);
        }
      }).catch(err => {
        this.snack.error(`${err.message}`);
        this.signupForm.reset();
      });
  }
}
