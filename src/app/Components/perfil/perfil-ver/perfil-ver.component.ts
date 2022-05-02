import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Perfil } from 'src/app/models/perfil';
import { PermisoLista } from 'src/app/models/permiso-lista';
import { EnumEstado } from 'src/app/helper/enum';

@Component({
  selector: 'app-perfil-ver',
  templateUrl: './perfil-ver.component.html',
  styleUrls: ['./perfil-ver.component.css'],
})
export class PerfilVerComponent implements OnInit {
  perfil: Perfil;
  listaPermisos: Array<PermisoLista>;
  habilitado: boolean = false;

  constructor(
    public dialogoRef: MatDialogRef<PerfilVerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.perfil = this.data;
    this.listaPermisos = this.perfil.listaPermisos;
    if (this.listaPermisos[0].id == 0)
      this.listaPermisos = new Array<PermisoLista>();
    this.habilitado = this.perfil.status == EnumEstado.Habilitado;
  }

  aceptar() {
    this.dialogoRef.close();
  }
}
