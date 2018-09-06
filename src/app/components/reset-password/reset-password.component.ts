import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MyValidators } from "../../services/my-validators.service";
import { AuthService } from "../../services/auth.service";
import { DialogService } from "../../services/dialog.service";
import { Router } from "@angular/router";

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
    private dialog: DialogService,
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
      this.dialog.success(`We just sent an email to ${email}! If you didn't receive it, please check the spam folder`,
        `All Done!`);
      this.router.navigate(['/login']);
    }).catch(err => {
      this.dialog.error(`No user with this email address has been found`, 'Error!');
      this.restoreForm.reset();
    });
  }
}
