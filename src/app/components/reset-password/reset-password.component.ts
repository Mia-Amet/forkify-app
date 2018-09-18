import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MyValidators } from "../../services/my-validators.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { SnackService } from "../../services/snack.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  restoreForm: FormGroup;

  constructor(
    public validators: MyValidators,
    private auth: AuthService,
    private snack: SnackService,
    private router: Router
  ) { }

  ngOnInit() {
    this.restoreForm = new FormGroup({
      email: new FormControl('',
        [Validators.required, Validators.minLength(5), Validators.email])
    });
  }

  onRestore() {
    const email = this.restoreForm.value.email;
    this.auth.resetPassword(email)
      .then(res => {
      this.snack.success(`We just sent an email to ${email}!`);
      this.router.navigate(['/login']);
    }).catch(err => {
      this.snack.error(`No user with this email address has been found`);
      this.restoreForm.reset();
    });
  }
}
