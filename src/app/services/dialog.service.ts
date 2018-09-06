import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from "../components/dialog/dialog.component";

export interface DialogData {
  type: 'success' | 'error',
  message: string,
  title: string,
  action?: string
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public mDialog: MatDialog
  ) { }

  openDialog(options: object): void {
    const dialogRef = this.mDialog.open(DialogComponent, options);
  }

  success(message: string, title: string, action?: string): void {
    const config = {
      data: {
        type: 'success',
        message,
        title,
        action: action ? action : null
      }
    };
    this.openDialog(config);
  }

  error(message: string, title: string, action?: string): void {
    const config = {
      data: {
        type: 'error',
        message,
        title,
        action: action ? action : null
      }
    };
    this.openDialog(config);
  }
}

