import { Component, OnInit, Inject } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Dialogo } from 'src/app/models/dialogo';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css'],
})
export class DialogoComponent implements OnInit {
  dialogo: Dialogo;
  mostrarBtCancel = false;

  constructor(
    public thisDialogoRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogo = data;
    this.mostrarBtCancel = this.dialogo.txBtCancel.length > 0;
  }

  ngOnInit() {}

  accionBoton01() {
    this.thisDialogoRef.close(true);
  }

  accionBoton02() {
    this.thisDialogoRef.close(false);
  }
}
