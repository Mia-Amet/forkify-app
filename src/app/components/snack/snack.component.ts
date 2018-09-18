import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";
import { SnackData } from "../../services/snack.service";

@Component({
  selector: 'snack',
  templateUrl: './snack.component.html',
  styleUrls: ['./snack.component.scss']
})
export class SnackComponent {
  timeout;

  constructor(
    public snackRef: MatSnackBarRef<SnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackData
  ) {
    this.timeout = setTimeout(() => {
      this.snackRef.dismiss();
    }, 3000);
  }

  onEnter() {
    clearTimeout(this.timeout);
  }

  onLeave() {
    this.timeout = setTimeout(() => {
      this.snackRef.dismiss();
    }, 1500);
  }

  onClose(): void {
    this.snackRef.dismiss();
  }
}
