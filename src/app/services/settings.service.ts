import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material";
import { SettingsComponent } from "../components/settings/settings.component";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private isOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public settingsState = this.isOpened.asObservable();

  constructor(
    private dialog: MatDialog
  ) { }

  emitSettingsState(value: boolean): void {
    this.isOpened.next(value);
  }

  openSettings(): MatDialogRef<SettingsComponent> {
    this.emitSettingsState(true);

    const settingsRef = this.dialog.open(SettingsComponent, {});
    settingsRef.afterClosed().subscribe(res => this.emitSettingsState(false));

    return settingsRef;
  }
}
