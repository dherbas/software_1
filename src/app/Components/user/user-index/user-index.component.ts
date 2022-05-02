import {Component, OnInit} from '@angular/core';
import {VariablesGlobalesService} from 'src/app/helper/variables-globales.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Usuario} from 'src/app/models/usuario';
import {EnumCodigoRespuesta, EnumEstado, EnumFiltroTipoUsuario, EnumTipoBusquedaUsuario,} from 'src/app/helper/enum';
import {UsuarioService} from './../../../services/usuario.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogoVerService} from 'src/app/helper/dialogo-ver.service';
import {Router} from '@angular/router';

import {Dialogo} from 'src/app/models/dialogo';
import {CambioEstado} from 'src/app/models/cambio-estado';
import {Paginador} from 'src/app/helper/paginador';
import {StorageService} from 'src/app/services/storage.service';
import {UserVerComponent} from '../user-ver/user-ver.component';
import {ToastrService} from 'ngx-toastr';
import {ResetearContraseña} from 'src/app/models/resetearcontraseña';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css'],
})
export class UserIndexComponent implements OnInit {
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
  EnumTipoUsuario = EnumFiltroTipoUsuario;
  tipoUsuario = this.EnumTipoUsuario.Todos;
  needDelivery = false;

  constructor(
    private global: VariablesGlobalesService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private dialogService: DialogoVerService,
    private router: Router,
    private storageService: StorageService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.usuarioSession = this.storageService.getCurrentUser();
    this.needDelivery = this.usuarioSession.need_delivery;
    console.log('user', this.usuarioSession.need_delivery);
    this.obtenerListado();
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.obtenerListado();
    }
  }

  usuario(id: number): void {
    this.router.navigate(['/backoffice/usuario/usuario/' + id.toString()]);
  }

  ver(id: number) {
    this.mensageError = '';
    this.usuarioService.obtenerPorId(id).subscribe(
      (resultado) => {
        if (resultado.status == EnumCodigoRespuesta.Correcto) {
          this._usuario = resultado.data;
          this.dialog.open(UserVerComponent, {
            data: this._usuario,
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

  resetearPassword(id: number, nombreUsuario: string) {
    this.mensageError = ' ';
    //let passres = this.usuarioService.Password;
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
    console.log('radio',this.radioSeleccionado);
    this.usuarioService
      .obtenerLista(
        list_code_services,
        this.radioSeleccionado,
        this.tipoBusqueda,
        this.textoCriterio,
        this.tipoUsuario
      )
      .subscribe(
        (resultado) => {
          this.listaUsuarios = new Array<Usuario>();
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

  Clear() {
    this.textoCriterio = '';
  }

  cambiarEnviarEmail(id: number, usuername: string, sendMail: boolean) {
    this.mensageError = '';
    const dialogo = new Dialogo();
    const accion = sendMail ? 'deje de recibir correo?' : 'reciba correo?';
    dialogo.titulo = 'Confirmación';
    dialogo.html = '<span class="da-texto-popup-bo">¿Está seguro que desea que el usuario <strong>' + usuername + '</strong><br>' + accion + '</span>';
    dialogo.txBtOk = 'Aceptar';
    dialogo.txBtCancel = 'Cancelar';
    this.dialogService.abrirDialogo(dialogo).afterClosed()
      .subscribe((response) => {
        if (response) {
          this.blockUI.start();
          this.usuarioService.cambiarEnviarEmail(id, !sendMail)
            .subscribe((resultado) => {
              if (resultado.status == EnumCodigoRespuesta.Correcto) {
                this.obtenerListado();

                this.blockUI.stop();
                this.toastr.success('El usuario ' + usuername + ' ha sido actualizado exitosamente.');
              } else {
                this.mensageError = resultado.message;
                this.blockUI.stop();

              }
            });
        }
      });
  }
}
