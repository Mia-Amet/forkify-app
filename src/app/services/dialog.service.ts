import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { SettingsComponent } from "../components/settings/settings.component";
import { DialogComponent } from "../components/dialog/dialog.component";
import {BehaviorSubject, Observable} from "rxjs";

export interface DialogData {
  id: string;
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private isOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public settingsState = this.isOpened.asObservable();

  constructor(
    private dialog: MatDialog
  ) { }

  emitSettingsState(value: boolean): void {
    this.isOpened.next(value);
  }

  openSettings(): MatDialogRef<SettingsComponent> {
    const config: MatDialogConfig = {
      id: 'user-settings',
      panelClass: 'user-settings',
      hasBackdrop: true,
      data: null
    };
    this.emitSettingsState(true);
    const settingsRef = this.dialog.open(SettingsComponent, config);
    settingsRef.afterClosed().subscribe(() => this.emitSettingsState(false));
    return settingsRef;
  }

  openDialog(id: string, title: string, text: string): Observable<boolean> {
    const data: DialogData = { id, title, text };
    const config: MatDialogConfig = {
      id: 'confirm-dialog',
      panelClass: 'confirm-dialog',
      hasBackdrop: true,
      width: '360px',
      position: {
        top: '24%',
        right: '36%'
      },
      data
    };
    const dialogRef = this.dialog.open(DialogComponent, config);
    return dialogRef.afterClosed();
  }
}
