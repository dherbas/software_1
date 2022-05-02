import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from '../Components/component/dialogo/dialogo.component';

@Injectable({
  providedIn: 'root',
})
export class DialogoVerService {
  constructor(private dialog: MatDialog) {}

  abrirDialogo(objeto: any, ancho?: string, alto?: string) {
    if (ancho == undefined) {
      ancho = '400px';
    }
    return this.dialog.open(DialogoComponent, {
      data: objeto,
      width: ancho,
      height: alto,
      panelClass: '',
      disableClose: true,
    });
  }
}
