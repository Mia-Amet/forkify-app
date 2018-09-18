import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";
import { SnackComponent } from "../components/snack/snack.component";

export interface SnackData {
  type: 'success' | 'error',
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(
    private matSnack: MatSnackBar
  ) { }

  success(message: string) {
    const data: SnackData = { type: 'success', message };
    const config: MatSnackBarConfig = {
      panelClass: 'snack-bar-success',
      data
    };
    this.matSnack.openFromComponent(SnackComponent, config);
  }

  error(message: string) {
    const data: SnackData = { type: 'error', message };
    const config: MatSnackBarConfig = {
      panelClass: 'snack-bar-error',
      data
    };
    this.matSnack.openFromComponent(SnackComponent, config);
  }
}
