import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { VoucherEmpresa } from 'src/app/models/voucher-empresa';
import { DialogoVerService } from 'src/app/helper/dialogo-ver.service';
import { VoucherCompanyService } from 'src/app/services/voucher-company.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Validador } from 'src/app/helper/validador';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumCodigoRespuesta, EnumEstado } from 'src/app/helper/enum';
import { Dialogo } from 'src/app/models/dialogo';
import { Location } from '@angular/common';
import { cmbService } from 'src/app/models/cmbService';
import { DialogData } from '../voucher-company-index/voucher-company-index.component';

@Component({
  selector: 'app-voucher-company-form',
  templateUrl: './voucher-company-form.component.html',
  styleUrls: ['./voucher-company-form.component.css'],
})
export class VoucherCompanyFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  idEmpresa;
  Empresa: VoucherEmpresa = new VoucherEmpresa();
  mensageError = '';
  accion = '';
  habilitado = false;
  titulo;
  mostrarDatos = true;
  services: cmbService[];

  constructor(
    private activeteRoute: ActivatedRoute,
    private location: Location,
    private dialogService: DialogoVerService,
    private companyService: VoucherCompanyService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private validador: Validador,
    private toastr: ToastrService,
    private session: StorageService,
    public dialogoRef: MatDialogRef<VoucherCompanyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.mensageError = '';
    this.idEmpresa = this.data.idI;
    this.services = this.session.getCurrentUser().list_code_service;
    if (this.idEmpresa == 0) {
      this.accion = 'Guardar';
      this.titulo = 'Nueva empresa externa';
      this.habilitado = true;
      this.mostrarDatos = true;
      this.Empresa.service_code = this.services[0].code;
    } else {
      this.titulo = 'Editar empresa externa';
      this.accion = 'Actualizar';
      this.mostrarDatos = true;

      this.blockUI.start(),
        this.companyService.obtenerPorId(this.idEmpresa).subscribe(
          (resultado) => {
            if (resultado.status == EnumCodigoRespuesta.Correcto) {
              this.Empresa = resultado.data;

              this.habilitado = this.Empresa.visible == EnumEstado.Habilitado;
              console.log(this.habilitado + 'Habilitado?');
              console.log(this.Empresa.visible + 'Visible?');

              //this.obtenerEmpresas();
            } else {
              this.mensageError = resultado.message;
            }
            this.blockUI.stop();
          },
          (error) => {
            this.mensageError = error.errorMessage;
            this.blockUI.stop();
          }
        );
    }
  }

  guardadoCorrecto() {
    const accion = this.Empresa.id == 0 ? 'Guardado' : 'Actualizado';
    this.toastr.success(accion + ' correctamente');
  }
  guardar() {
    debugger;
    this.mensageError = '';
    if (!this.validarGuardar()) {
      return;
    }
    this.Empresa.visible = this.habilitado
      ? EnumEstado.Habilitado
      : EnumEstado.Deshabilitado;

    this.companyService
      .guardar(this.Empresa, this.Empresa.service_code)
      .subscribe(
        (resultado) => {
          switch (resultado.status) {
            case EnumCodigoRespuesta.Correcto:
              this.guardadoCorrecto();
              break;
            case EnumCodigoRespuesta.Error_Validacion:
              this.mensageError = resultado.data;
              break;
            default:
              this.mensageError = resultado.message;
              break;
          }
          //this.cancel();
          //this.blockUI.stop();
        },
        (error) => {
          this.mensageError = error.errorMessage;
          //this.blockUI.stop();
        }
      );
    //this.guardadoCorrecto();
    this.cancel();
  }

  ValidarAlfanumerico(event) {
    return this.validador.ValidarAlfabetico(event);
  }

  ValidarNumerico(event) {
    return this.validador.ValidarSoloNumero(event);
  }
  validarGuardar() {
    this.mensageError = '';
    if (this.Empresa.name == '') {
      this.mensageError = 'Debe ingresar un nombre válido.';
      return false;
    }
    return true;
  }
  cancel() {
    this.dialogoRef.close();
  }

  cancelar() {
    this.dialogoRef.close();
    let obj: Dialogo = new Dialogo();
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea cancelar la operación y<br>volver a la lista de empresas?</span>';
    obj.titulo = 'Confirmación';
    obj.txBtOk = 'Aceptar';
    obj.txBtCancel = 'Cancelar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          //this.location.back();
        }
      });
  }
  /* getServiceCode() {
    const code = this.service_Code.map(({ code }) => code);
    return code;
  } */
}
