import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario';
import { PermisoLista } from 'src/app/models/permiso-lista';
import { EnumEstado } from 'src/app/helper/enum';
@Component({
  selector: 'app-user-ver',
  templateUrl: './user-ver.component.html',
  styleUrls: ['./user-ver.component.css'],
})
export class UserVerComponent implements OnInit {
  usuario: Usuario;
  listaPermisos: Array<PermisoLista>;
  habilitado: boolean = false;

  constructor(
    public dialogoRef: MatDialogRef<UserVerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.usuario = this.data;
    // this.listaPermisos = this.usuario.listaPermisos; DHM
    if (this.listaPermisos[0].id == 0)
      this.listaPermisos = new Array<PermisoLista>();
    this.habilitado = this.usuario.status == EnumEstado.Habilitado;
  }

  aceptar() {
    this.dialogoRef.close();
  }
}
