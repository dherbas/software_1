import {Component, OnInit, Renderer2,} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Usuario} from 'src/app/models/usuario';
import {VariablesGlobalesService} from 'src/app/helper/variables-globales.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {DialogoVerService} from 'src/app/helper/dialogo-ver.service';
import {UsuarioService} from 'src/app/services/usuario.service';
import {EnumCodigoRespuesta, EnumEstado} from 'src/app/helper/enum';
import {Dialogo} from 'src/app/models/dialogo';
// import { MatDialog } from '@angular/material';
import {MatDialog} from '@angular/material/dialog';
import {Validador} from 'src/app/helper/validador';
import {ToastrService} from 'ngx-toastr';

import {StorageService} from 'src/app/services/storage.service';
import {Company} from 'src/app/models/filter';
import {VoucherCompanyService} from 'src/app/services/voucher-company.service';

@Component({
  selector: 'app-external-user-form',
  templateUrl: './external-user-form.component.html',
  styleUrls: ['./external-user-form.component.css'],
})
export class ExternalUserFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  idUsuario;
  usuario: Usuario = new Usuario();
  mensageError = '';
  accion = '';
  habilitado = false;
  idCompanySelected = -1;
  enumEstado = EnumEstado;
  listaEmpresas: Array<Company> = new Array<Company>();

  mostrarDatos = true;

  titulo;

  constructor(
    private global: VariablesGlobalesService,
    private activeteRoute: ActivatedRoute,
    private location: Location,
    private dialogService: DialogoVerService,
    private usuarioService: UsuarioService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private validador: Validador,
    private toastr: ToastrService,
    private session: StorageService,
    private companyService: VoucherCompanyService
  ) {
  }

  ngOnInit() {
    this.mensageError = '';
    this.idUsuario = this.activeteRoute.snapshot.params.id;

    if (this.idUsuario == 0) {
      this.accion = 'Guardar';
      this.titulo = 'Nuevo usuario externo';
      this.habilitado = true;
      this.mostrarDatos = true;

      this.obtenerEmpresas();
    } else {
      this.titulo = 'Editar usuario externo';
      this.accion = 'Actualizar';
      this.mostrarDatos = true;

      this.blockUI.start();
      this.usuarioService.obtenerPorId(this.idUsuario).subscribe(
        (resultado) => {
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.usuario = resultado.data;

            this.habilitado = this.usuario.status == EnumEstado.Habilitado;
            this.idCompanySelected = this.usuario.voucher_company_id;
            this.obtenerEmpresas();
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

  obtenerEmpresas() {
    this.listaEmpresas = [];
    const service_code = this.session.getListCodeServices()[0];
    this.companyService
      .obtenerLista(this.enumEstado.Habilitado, '', service_code)
      .subscribe(
        (resp) => {
          if (resp.status == EnumCodigoRespuesta.Correcto) {
            this.listaEmpresas = resp.data;
          } else {
            this.mensageError = resp.message;
          }
        },
        (error) => {
          console.log('error :>> ', error);
          this.mensageError = error.message;
        }
      );
  }

  mostrarNuevaContrasenha(password) {
    let obj: Dialogo = new Dialogo();
    obj.html =
      '<span class="">La contraseña asignada es: </span> <span class="lb-strong-blue">' +
      password +
      '</span>';
    obj.titulo = 'Registro realizado';
    obj.txBtOk = 'Cerrar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.guardadoCorrecto();
        }
      });
  }

  guardadoCorrecto() {
    const accion = this.usuario.id == 0 ? 'Guardado' : 'Actualizado';
    this.toastr.success(accion + ' correctamente');
    this.router.navigate(['/backoffice/usuario-externo']);
  }

  guardar() {
    this.mensageError = '';

    if (!this.validarGuardar()) {
      return;
    }

    this.usuario.status = this.habilitado
      ? EnumEstado.Habilitado
      : EnumEstado.Deshabilitado;

    this.blockUI.start();
    const listaEmpresas = []; // this.getCodigoListaEmpresaSeleccionadas();
    if (listaEmpresas.length == 0) {
      listaEmpresas.push(this.session.getListCodeServices()[0]);
    }
    this.usuarioService
      .saveExternalUser(this.usuario, listaEmpresas, this.idCompanySelected)
      .subscribe(
        (resultado) => {
          switch (resultado.status) {
            case EnumCodigoRespuesta.Correcto:
              if (this.usuario.id == 0) {
                this.mostrarNuevaContrasenha(resultado.data.password);
              } else {
                this.guardadoCorrecto();
              }
              break;
            case EnumCodigoRespuesta.Error_Validacion:
              this.mensageError = resultado.data;
              break;
            default:
              this.mensageError = resultado.message;
              break;
          }

          this.blockUI.stop();
        },
        (error) => {
          this.mensageError = error.errorMessage;
          this.blockUI.stop();
        }
      );
  }

  ValidarAlfanumerico(event) {
    return this.validador.ValidarAlfabetico(event);
  }

  ValidarNumerico(event) {
    return this.validador.ValidarSoloNumero(event);
  }

  validarGuardar(): boolean {
    this.mensageError = '';
    if (this.idCompanySelected <= 0) {
      this.mensageError = 'Debe seleccionar una empresa válida.';
      return false;
    }
    if (this.usuario.username == '') {
      this.mensageError = 'Debe ingresar un usuario válido.';
      return false;
    }

    if (this.usuario.first_name == '') {
      this.mensageError = 'Debe ingresar un nombre válido.';
      return false;
    }
    if (this.usuario.last_name == '') {
      this.mensageError = 'Debe ingresar apellidos válidos.';
      return false;
    }
    if (this.usuario.phone_number == '') {
      this.mensageError = 'Debe ingresar un teléfono válido.';
      return false;
    }
    if (this.usuario.phone_number.length <= 5) {
      this.mensageError = 'El teléfono debe ser mayor a 5 caracteres.';
      return false;
    }
    if (this.usuario.email == '') {
      this.mensageError = 'Debe ingresar un correo válido.';
      return false;
    }

    if (!this.validador.ValidarCorreo(this.usuario.email)) {
      this.mensageError = 'Debe ingresar un correo válido.';
      return false;
    }

    return true;
  }


  cancelar() {
    let obj: Dialogo = new Dialogo();
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea cancelar la operación y<br>volver a la lista de usuarios extenos?</span>';
    obj.titulo = 'Confirmación';
    obj.txBtOk = 'Aceptar';
    obj.txBtCancel = 'Cancelar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.router.navigate(['/backoffice/usuario-externo']);
        }
      });
  }
}
