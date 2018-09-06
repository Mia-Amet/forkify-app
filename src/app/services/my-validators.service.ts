import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class MyValidators {

  public static passwordCheck(control: FormControl): ValidationErrors | null {
    if (!/[0-9]/.test(control.value)) return { noDigit: true };
    if (!/[a-z]/.test(control.value)) return { noLetter: true };

    return null;
  }

  public static passwordMatch(form: FormGroup): ValidationErrors | null {
    if (form.value.password !== form.value.confirmPassword) {
      const error: ValidationErrors = { missMatch: true };
      form.get('confirmPassword').setErrors(error);
      return error;
    }

    return null;
  }

  public getErrorMsg(control: AbstractControl): string {
    if (!control.errors) return;

    if (control.errors.hasOwnProperty('required')) return 'Input is required';
    if (control.errors.hasOwnProperty('minlength')) {
      return `Must be at least ${control.errors['minlength']['requiredLength']} chars`;
    }
    if (control.errors.hasOwnProperty('email')) return 'Invalid input: must contain email';
    if (control.errors.hasOwnProperty('noDigit')) return 'Must contain at least 1 digit';
    if (control.errors.hasOwnProperty('noLetter')) return 'Must contain at least 1 regular letter';
    if (control.errors.hasOwnProperty('missMatch')) return 'Passwords do not match';

    return 'Invalid input';
  }
}
