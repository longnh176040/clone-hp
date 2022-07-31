import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  private readonly snackbarConfig = {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    duration: 2500
  }

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, this.snackbarConfig);
  }
}
