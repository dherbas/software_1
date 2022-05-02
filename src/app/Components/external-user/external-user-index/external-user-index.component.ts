import { Component, OnInit } from '@angular/core';
import { VariablesGlobalesService } from 'src/app/helper/variables-globales.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Usuario } from 'src/app/models/usuario';
import {
  EnumEstado,
  EnumCodigoRespuesta,
  EnumTipoBusquedaUsuario,
} from 'src/app/helper/enum';
import { UsuarioService } from './../../../services/usuario.service';

import { DialogoVerService } from 'src/app/helper/dialogo-ver.service';
import { Router } from '@angular/router';

import { Dialogo } from 'src/app/models/dialogo';
import { CambioEstado } from 'src/app/models/cambio-estado';
import { Paginador } from 'src/app/helper/paginador';
import { StorageService } from 'src/app/services/storage.service';

import { ToastrService } from 'ngx-toastr';
import { ResetearContraseña } from 'src/app/models/resetearcontraseña';
import { Company } from 'src/app/models/filter';
import { VoucherCompanyService } from 'src/app/services/voucher-company.service';
import { cmbService } from 'src/app/models/cmbService';

@Component({
  selector: 'app-external-user-index',
  templateUrl: './external-user-index.component.html',
  styleUrls: ['./external-user-index.component.css'],
})
export class ExternalUserIndexComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public listaUsuarios: Array<Usuario> = new Array<Usuario>();
  public _usuario: Usuario;
  public mensageError: string = '';
  public mensageErrorListado: string = '';
  public _Paginador: Paginador = new Paginador();
  enumEstado = EnumEstado;
  enumTipoBusqueda = EnumTipoBusquedaUsuario;
  radioSeleccionado: number = this.enumEstado.Todos;
  textoCriterio: string = '';
  tipoBusqueda = this.enumTipoBusqueda.Username;
  user = null;
  usuarioSession = null;
  idCompanySelected = -1;
  listCompany: Company[] = [];

  service_code: string;
  services: cmbService[];

  constructor(
    private global: VariablesGlobalesService,
    private usuarioService: UsuarioService,

    private dialogService: DialogoVerService,
    private router: Router,
    private storageService: StorageService,
    private toastr: ToastrService,
    private companyService: VoucherCompanyService
  ) { }

  ngOnInit() {
    this.usuarioSession = this.storageService.getCurrentUser();
    this.getlistComany();
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.obtenerListado();
    }
  }

  getlistComany() {
    this.blockUI.start();
    this.services = this.storageService.getCurrentSession().user.list_code_service;
    this.service_code = this.services[0].code;
    this.companyService
      .obtenerLista(this.enumEstado.Todos, '', this.service_code)
      .subscribe(
        (resp) => {
          if (resp.status == EnumCodigoRespuesta.Correcto) {
            this.listCompany = resp.data;
            this.obtenerListado();
          } else {
            this.mensageError = resp.message;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.toastr.error('Error desconocido, contacte con el administrador');
          this.mensageError =
            'Error desconocido, contacte con el administrador';
        }
      );
  }
  
  usuario(id: number): void {
    this.router.navigate([
      '/backoffice/usuario-externo/usuario-externo/' + id.toString(),
    ]);
  }

  resetearPassword(id: number, nombreUsuario: string) {
    this.mensageError = ' ';
    let obj: Dialogo = new Dialogo();
    obj.titulo = 'Resetear contraseña';
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea resetear la contraseña del usuario ' +
      '<strong>' +
      nombreUsuario +
      '</strong>' +
      '?</span>';
    obj.txBtOk = 'Aceptar';
    obj.txBtCancel = 'Cancelar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.blockUI.start();
          this.usuarioService
            .resetPassword(new ResetearContraseña(id))
            .subscribe((resultado) => {
              if (resultado.status == EnumCodigoRespuesta.Correcto) {
                let obj2: Dialogo = new Dialogo();
                obj2.titulo = 'Contraseña reseteada';
                obj2.html =
                  '<span class="da-texto-popup-bo">La contraseña del usuario "' +
                  nombreUsuario +
                  '" fue reseteada con éxito.' +
                  '<br> Su nueva contraseña es ' +
                  '<strong>' +
                  this.usuarioService.Password +
                  '</strong>' +
                  '</span>';
                obj2.txBtOk = 'Cerrar';
                this.dialogService
                  .abrirDialogo(obj2)
                  .afterClosed()
                  .subscribe((resp) => {
                    if (resp) {
                      this.obtenerListado();
                    }
                  });
                //this.obtenerListado();
                /* this.toastr.success(
                  'La contraseña del usuario ' +
                    nombreUsuario +
                    ' ha sido reseteado exitosamente!'
                ); */
              } else {
                this.mensageError = resultado.message;
              }
              this.blockUI.stop();
            });
          this.blockUI.stop();
        }
      });
  }
  cambiarEstado(id: number, estado: number, nombreUsuario: string) {
    this.mensageError = '';
    let obj: Dialogo = new Dialogo();
    let nombreEstado: string =
      estado == EnumEstado.Habilitado ? 'deshabilitar' : 'habilitar';
    let RnombreEstado: string =
      estado == EnumEstado.Habilitado ? 'deshabilitado' : 'habilitado';
    obj.titulo = 'Confirmación';
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea ' +
      nombreEstado +
      ' el usuario<br>' +
      '<strong>' +
      nombreUsuario +
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
          this.usuarioService
            .cambiarEstado(
              new CambioEstado(
                id,
                estado == EnumEstado.Habilitado
                  ? EnumEstado.Deshabilitado
                  : EnumEstado.Habilitado
              )
            )
            .subscribe((resultado) => {
              if (resultado.status == EnumCodigoRespuesta.Correcto) {
                this.obtenerListado();
                this.toastr.success(
                  'El usuario ' +
                  nombreUsuario +
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
    const list_code_services = this.storageService.getListCodeServices();

    this.usuarioService
      .obtenerListaUsuarioExterno(
        list_code_services,
        this.radioSeleccionado,
        this.tipoBusqueda,
        this.textoCriterio,
        this.idCompanySelected
      )
      .subscribe(
        (resultado) => {
          this.listaUsuarios = new Array<Usuario>();
          debugger;
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.listaUsuarios = resultado.data;
            if (this.listaUsuarios.length === 0) {
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
  changeCompany() {
    this.listaUsuarios = [];
    this.mensageErrorListado = '';
  }
  Clear() {
    this.textoCriterio = '';
  }
}
