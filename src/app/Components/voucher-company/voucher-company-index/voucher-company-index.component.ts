import { Component, OnInit } from '@angular/core';
import { VariablesGlobalesService } from 'src/app/helper/variables-globales.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Paginador } from 'src/app/helper/paginador';
import { EnumEstado, EnumCodigoRespuesta } from 'src/app/helper/enum';
import { MatDialog } from '@angular/material/dialog';
import { DialogoVerService } from 'src/app/helper/dialogo-ver.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { VoucherCompanyService } from 'src/app/services/voucher-company.service';
import { Dialogo } from 'src/app/models/dialogo';
import { CambioEstadoEmpresa } from 'src/app/models/cambio-estado-empresa';
import { VoucherEmpresa } from 'src/app/models/voucher-empresa';
import { VoucherCompanyFormComponent } from '../voucher-company-form/voucher-company-form.component';
import { IfStmt } from '@angular/compiler';
import { cmbService } from 'src/app/models/cmbService';
import { HostListener } from '@angular/core';
export interface DialogData {
  tituloI: string;
  idI: number;
  //name: VoucherEmpresa;
}

@Component({
  selector: 'app-voucher-company-index',
  templateUrl: './voucher-company-index.component.html',
  styleUrls: ['./voucher-company-index.component.css'],
})
export class VoucherCompanyIndexComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public listaEmpresas: Array<VoucherEmpresa> = new Array<VoucherEmpresa>();
  public NList: number;
  public _empresa: VoucherEmpresa;
  public mensageError: string = '';
  public mensageErrorListado: string = '';
  public _Paginador: Paginador = new Paginador();
  enumEstado = EnumEstado;
  radioSeleccionado: number = this.enumEstado.Todos;
  textoCriterio: string = '';
  user = null;
  usuarioSession = null;
  titulo: string;
  services: cmbService[];
  service_code: string;

  constructor(
    private global: VariablesGlobalesService,
    private companyService: VoucherCompanyService,
    private dialog: MatDialog,
    private dialogService: DialogoVerService,
    private router: Router,
    private storageService: StorageService,
    private toastr: ToastrService
  ) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code == 'Enter') {
      this.obtenerListado();
    }
  }

  ngOnInit(): void {
    this.usuarioSession = this.storageService.getCurrentUser();
    this.services = this.usuarioSession.list_code_service;
    this.service_code = this.services[0].code;
    this.obtenerListado();
    console.log(this.services);
    if (this.dialog.afterAllClosed) {
      this.obtenerListado();
    }
  }

  empresa(id: number): void {
    this.router.navigate(['/backoffice/empresas/empresa/' + id.toString()]);
  }

  empresaM(idC: number) {
    const dialogRef = this.dialog.open(VoucherCompanyFormComponent, {
      width: '400px',
      disableClose: true,
      data: {
        tituloI: this.titulo,
        idI: idC,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Este es el resultado del afterclosed >>' + result);
      this.obtenerListado();
    });
  }

  cambiarEstado(id: number, visible: number, nombreEmpresa: string) {
    this.mensageError = '';
    let obj: Dialogo = new Dialogo();
    let nombreEstado =
      visible == EnumEstado.Habilitado ? 'deshabilitar' : 'habilitar';
    let RnombreEstado: string =
      visible == EnumEstado.Habilitado ? 'deshabilitado' : 'habilitado';
    obj.titulo = 'Confirmación';
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea ' +
      nombreEstado +
      ' la empresa<br>' +
      '<strong>' +
      nombreEmpresa +
      '</strong>' +
      '?</span>';
    obj.txBtOk = 'Aceptar';
    obj.txBtCancel = 'Cancelar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.blockUI.start();
          this.companyService
            .cambiarEstado(
              new CambioEstadoEmpresa(
                id,
                visible == EnumEstado.Habilitado
                  ? EnumEstado.Deshabilitado
                  : EnumEstado.Habilitado
              )
            )
            .subscribe((resultado) => {
              if (resultado.status == EnumCodigoRespuesta.Correcto) {
                this.obtenerListado();
                this.toastr.success(
                  'La empresa ' +
                    nombreEmpresa +
                    ' ha sido ' +
                    RnombreEstado +
                    ' exitosamente!'
                );
              } else {
                this.mensageError = resultado.message;
              }
              this.blockUI.stop();
            });
          this.blockUI.stop();
          this.obtenerListado();
        }
      });
  }

  obtenerListado() {
    this.blockUI.start();
    console.log(this.service_code);
    this.companyService
      .obtenerLista(
        this.radioSeleccionado,
        this.textoCriterio,
        this.service_code
      )
      .subscribe(
        (resultado) => {
          this.listaEmpresas = new Array<VoucherEmpresa>();
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.listaEmpresas = resultado.data;
            if (this.listaEmpresas.length === 0) {
              this.mensageErrorListado =
                'No se encontraron resultados para su criterio de búsqueda';
            }
          } else {
            this.mensageErrorListado = resultado.message;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.mensageError = error.errorMessage;
          this.blockUI.stop();
        }
      );
  }

  Clear() {
    this.textoCriterio = '';
  }
}
