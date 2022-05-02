import {Component, OnInit} from '@angular/core';
import {VariablesGlobalesService} from 'src/app/helper/variables-globales.service';
import {Perfil} from 'src/app/models/perfil';
import {PerfilService} from 'src/app/services/perfil.service';
import {EnumCodigoRespuesta, EnumEstado} from 'src/app/helper/enum';
import {MatDialog} from '@angular/material/dialog';

import {PerfilVerComponent} from '../perfil-ver/perfil-ver.component';
import {Dialogo} from './../../../models/dialogo';
import {DialogoVerService} from './../../../helper/dialogo-ver.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Router} from '@angular/router';
import {CambioEstadoProfile} from 'src/app/models/cambio-estado-profile';
import {Paginador} from 'src/app/helper/paginador';
import {MetodoExtensionService} from './../../../helper/metodo-extension.service';
import {ToastrService} from 'ngx-toastr';
import {StorageService} from 'src/app/services/storage.service';

@Component({
  selector: 'app-perfil-index',
  templateUrl: './perfil-index.component.html',
  styleUrls: ['./perfil-index.component.css'],
})
export class PerfilIndexComponent implements OnInit {
  @BlockUI()
  blockUI: NgBlockUI;
  public listaPerfiles: Array<Perfil> = new Array<Perfil>();
  public _perfil: Perfil;
  public mensageError: string = '';
  public mensageErrorListado: string = '';
  public _Paginador: Paginador = new Paginador();
  enumEstado = EnumEstado;
  radioSeleccionado: number = this.enumEstado.Todos;
  textoCriterio: string = '';
  usuarioSession = null;
  selectedCompany: string;

  constructor(
    private global: VariablesGlobalesService,
    private perfilService: PerfilService,
    private dialog: MatDialog,
    private dialogService: DialogoVerService,
    private router: Router,
    public metodoExtensionService: MetodoExtensionService,
    private toastr: ToastrService,
    private storageService: StorageService,
  ) {
    this.usuarioSession = this.storageService.getCurrentUser();
    this.selectedCompany = this.usuarioSession.list_code_service.length > 0 ? this.usuarioSession.list_code_service[0].code : '';
  }

  ngOnInit() {
    this.obtenerListado();
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.obtenerListado();
    }
  }

  perfil(id: number): void {
    this.router.navigate(['/backoffice/perfil/perfil/' + id.toString()]);
  }

  ver(id: number) {
    this.mensageError = '';
    this.global.ValidarSession().subscribe((result) => {
      if (result) {
        this.perfilService.obtenerPorId(id).subscribe(
          (resultado) => {
            if (resultado.status == EnumCodigoRespuesta.Correcto) {
              this._perfil = resultado.data;
              this.dialog.open(PerfilVerComponent, {
                data: this._perfil,
                width: '450px',
                disableClose: true,
              });
            } else {
              this.mensageError = resultado.message;
            }
          },
          (error) => {
            this.mensageError = error.errorMessage;
          }
        );
      }
    });
  }

  cambiarEstado(id: number, estado: number, nombrePerfil: string) {
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
      ' el perfil<br>' +
      '<strong>' +
      nombrePerfil +
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
          this.perfilService
            .cambiarEstado(
              new CambioEstadoProfile(
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
                  'El perfil ' +
                  nombrePerfil +
                  ' ha sido ' +
                  RnombreEstado +
                  ' exitosamente!'
                );
              } else {
                this.mensageError = resultado.message;
                this.toastr.error(
                  'Ha ocurrido un error al intentar cambiar el estado del perfil' +
                  nombrePerfil);
              }
              this.blockUI.stop();
            });
          this.blockUI.stop();
          this.obtenerListado();
        }
      });
  }

  HabilitarDeshabilitar(id: number, estado: number, nombrePerfil: string) {
    let obj: Dialogo = new Dialogo();
    let nombreEstado: string =
      estado == EnumEstado.Habilitado ? 'deshabilitar' : 'habilitar';
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea ' +
      nombreEstado +
      ' el perfil<br>"' +
      nombrePerfil +
      '"?</span>';
    obj.txBtOk = 'Aceptar';
    obj.txBtCancel = 'Cancelar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe(
        (res) => {
          if (res) {
            this.blockUI.start();
            this.perfilService
              .cambiarEstado(
                new CambioEstadoProfile(
                  id,
                  estado == EnumEstado.Habilitado
                    ? EnumEstado.Deshabilitado
                    : EnumEstado.Habilitado
                )
              )
              .subscribe(
                (resultado) => {
                  if (resultado.status == EnumCodigoRespuesta.Correcto) {
                    this.obtenerListado();
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
        },
        (error) => {
          this.mensageError = error.errorMessage;
        }
      );
  }

  obtenerListado() {
    this.mensageError = '';
    this.mensageErrorListado = '';
    this.blockUI.start();
    this.perfilService
      .obtenerLista(this.radioSeleccionado, this.textoCriterio, this.selectedCompany.split(' '))
      .subscribe(
        (resultado) => {
          this.listaPerfiles = new Array<Perfil>();

          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.listaPerfiles = resultado.data;
            if (this.listaPerfiles.length === 0) {
              this.mensageErrorListado =
                'No se encontraron resultados para su criterio de búsqueda';
            }
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

  Clear() {
    this.textoCriterio = '';
  }
}
