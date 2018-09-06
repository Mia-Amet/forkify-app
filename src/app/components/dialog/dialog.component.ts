import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogData } from "../../services/dialog.service";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  timeout;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.timeout = setTimeout(() => {
      this.dialogRef.close();
    }, 4000);
  }

  onEnter() {
    clearTimeout(this.timeout);
  }

  onLeave() {
    this.timeout = setTimeout(() => {
      this.dialogRef.close();
    }, 2000);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
