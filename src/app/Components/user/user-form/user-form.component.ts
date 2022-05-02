import {Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren,} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Usuario} from 'src/app/models/usuario';
import {ArbolPermisoComponent} from '../../component/arbol-permiso/arbol-permiso.component';
import {VariablesGlobalesService} from 'src/app/helper/variables-globales.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {DialogoVerService} from 'src/app/helper/dialogo-ver.service';
import {UsuarioService} from 'src/app/services/usuario.service';
import {EnumCodigoRespuesta, EnumEstado, EnumTypeUser} from 'src/app/helper/enum';
import {Dialogo} from 'src/app/models/dialogo';
// import { MatDialog } from '@angular/material';
import {MatDialog} from '@angular/material/dialog';

import {PerfilService} from '../../../services/perfil.service';
import {Perfil} from 'src/app/models/perfil';
import {Permiso} from 'src/app/models/permiso';
import {Validador} from 'src/app/helper/validador';
import {ToastrService} from 'ngx-toastr';
import {cmbService} from 'src/app/models/cmbService';
import {StorageService} from 'src/app/services/storage.service';
import {UsuarioExtraData} from "../../../models/UsuarioExtraData";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  idUsuario;
  usuario: Usuario = new Usuario();
  mensageError = '';
  accion = '';
  habilitado = false;
  isCheckedTypeUser = false;
  isDisabledProfile = true;
  needDelivery = false;
  transactionalLogin = '';
  disabledTransactionalLogin = true;
  listaPerfilesDisponibles: Array<Perfil> = new Array<Perfil>();
  listaPerfilesAsignados: Array<Perfil> = new Array<Perfil>();
  listaEmpresas: Array<cmbService> = new Array<cmbService>();
  @ViewChildren('divPerfilesDisponibles') lPerfilesDisponibles: QueryList<ElementRef>;
  @ViewChildren('divPerfilesAsignados') lPerfilesAsignados: QueryList<ElementRef>;
  idPerfilDisponible = 0;
  idPerfilAsignado = 0;

  mostrarDatos = true;

  @ViewChild(ArbolPermisoComponent, {static: false})
  arbolPermisoRef: ArbolPermisoComponent;
  titulo;
  serviceCode: string;
  usuarioSession: any;

  constructor(
    private global: VariablesGlobalesService,
    private activeteRoute: ActivatedRoute,
    private location: Location,
    private dialogService: DialogoVerService,
    private usuarioService: UsuarioService,
    private perfil: PerfilService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private validador: Validador,
    private toastr: ToastrService,
    private session: StorageService
  ) {
    this.usuarioSession = this.session.getCurrentUser();
    this.serviceCode = this.usuarioSession.list_code_service[0]?.code;
  }

  ngOnInit() {
    this.mensageError = '';
    this.idUsuario = this.activeteRoute.snapshot.params.id;
    this.needDelivery = this.session.getCurrentUser().need_delivery;
    console.log('delivery', this.needDelivery);
    if (this.idUsuario == 0) {
      this.accion = 'Guardar';
      this.titulo = 'Nuevo usuario';
      this.habilitado = true;
      this.isCheckedTypeUser = false;
      this.mostrarDatos = true;
      this.isDisabledProfile = false;
      this.disabledTransactionalLogin = false;
      this.obtenerEmpresas();
    } else {
      this.titulo = 'Editar usuario';
      this.accion = 'Actualizar';
      this.mostrarDatos = true;
      this.isDisabledProfile = true;

      this.blockUI.start();
      this.usuarioService.obtenerPorId(this.idUsuario).subscribe(
        (resultado) => {
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.usuario = resultado.data;

            console.log(this.usuario);
            console.log(this.usuario.list_profile);

            this.usuario.list_profile.forEach((perfil) => {
              console.log(perfil);
              console.log(perfil.name);
            });

            this.habilitado = this.usuario.status == EnumEstado.Habilitado;
            this.isCheckedTypeUser = this.usuario.type_id == EnumTypeUser.Cobrador;
            this.obtenerEmpresas();
            if (typeof this.usuario.extra_data === 'string') {
              this.usuario.extra_data = JSON.parse(this.usuario.extra_data);
            } else if (this.usuario.extra_data == null) {
              this.usuario.extra_data = new UsuarioExtraData();
            }
            this.transactionalLogin = this.usuario.extra_data.transactional_login;
            this.disabledTransactionalLogin = this.transactionalLogin?.length > 0;
            this.usuario.transactional_login = this.transactionalLogin;
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

  getPerfilesDeEmpresasSeleccionadas(listaPerfilesOrigen: Perfil[]) {
    const listaEmpresas = this.getCodigoListaEmpresaSeleccionadas();
    let listaPerfilesResult: Perfil[] = [];
    listaEmpresas.forEach((code) => {
      const perfilesEmpresa = listaPerfilesOrigen.filter((obj) => {
        return obj.company_code === code;
      });
      listaPerfilesResult = listaPerfilesResult.concat(perfilesEmpresa);
    });

    return listaPerfilesResult;
  }

  checkEmpresa(code: string) {
    const listaEmpresas = this.getCodigoListaEmpresaSeleccionadas();

    if (listaEmpresas.indexOf(code) < 0) {
      this.listaPerfilesAsignados
        .filter((obj) => {
          return obj.company_code === code;
        })
        .forEach((element) => {
          this.quitarUno(element.id);
        });
    }
    if (listaEmpresas.length > 0) {
      this.obtenerPerfiles(listaEmpresas);
    } else {
      this.listaPerfilesDisponibles = [];
    }
  }

  obtenerEmpresas() {
    this.listaEmpresas = [];
    this.listaEmpresas = this.session.getCurrentUser().list_code_service;
    this.listaEmpresas.forEach((element) => {
      element.isCheck = false;
    });
    this.usuario.list_code_service.forEach((element) => {
      this.listaEmpresas.find((obj) => {
        return obj.code === element;
      }).isCheck = true;
    });
    const listaSeleccionadas = this.getCodigoListaEmpresaSeleccionadas();
    if (this.listaEmpresas.length == 1) {
      if (this.usuario.id > 0) {
        this.obtenerPerfiles(listaSeleccionadas);
      } else {
        this.obtenerPerfiles();
      }
    } else {
      if (this.usuario.id > 0) {
        this.obtenerPerfiles(listaSeleccionadas);
      }
    }
  }

  obtenerPerfiles(company_list: string[] = null) {
    this.mensageError = '';
    this.blockUI.start();

    this.perfil.obtenerLista(EnumEstado.Habilitado, '', company_list).subscribe(
      (resultado) => {
        console.log('resultado.data :>> ', resultado.data);
        this.listaPerfilesDisponibles = new Array<Perfil>();
        if (resultado.status === EnumCodigoRespuesta.Correcto) {
          this.listaPerfilesDisponibles = <Array<Perfil>>resultado.data;

          this.ponerPerfilesAsignados();
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

  ponerPerfilesAsignados() {
    const listPerfiles = this.usuario.list_profile;
    if (listPerfiles.length > 0) {
      listPerfiles.forEach((perfil) => {
        if (
          this.listaPerfilesDisponibles.find((x) => x.id === perfil.id) !=
          undefined
        ) {
          let auxPerfil: Perfil = new Perfil();
          auxPerfil = Object.assign(
            {},
            this.listaPerfilesDisponibles.find((x) => x.id === perfil.id)
          );

          if (!this.listaPerfilesAsignados.some((e) => e.id === auxPerfil.id)) {
            this.listaPerfilesAsignados.push(auxPerfil);
          }
          let index = this.listaPerfilesDisponibles.findIndex(
            (x) => x.id === perfil.id
          );
          this.listaPerfilesDisponibles.splice(index, 1);
        }
      });
    }
    this.usuario.list_permission = []; // para que no traiga los permisos del usuario

    console.info('ponerPerfilesAsignados');
    if (this.arbolPermisoRef != undefined)
      this.arbolPermisoRef.ponerPermisos(
        this.armarListaPermisoTotal(),
        this.usuario.list_permission
      );
  }

  seleccionarPerfilDisponible(id) {
    this.idPerfilDisponible = id;
    this.lPerfilesDisponibles.forEach((element) => {
      if (element.nativeElement.id == id) {
        this.renderer.addClass(element.nativeElement, 'seleccionada');
      } else {
        this.renderer.removeClass(element.nativeElement, 'seleccionada');
      }
    });
  }

  seleccionarPerfilAsignado(id) {
    this.idPerfilAsignado = id;
    this.lPerfilesAsignados.forEach((element) => {
      if (element.nativeElement.id == id) {
        this.renderer.addClass(element.nativeElement, 'seleccionada');
      } else {
        this.renderer.removeClass(element.nativeElement, 'seleccionada');
      }
    });
  }

  pasarUno() {
    this.pasarElementoEntreLista(
      this.listaPerfilesDisponibles,
      this.listaPerfilesAsignados,
      this.idPerfilDisponible
    );
    this.idPerfilDisponible = 0;

    // Poner permisos solo lectura
    this.ponerPermisos(new Array<Permiso>());
  }

  pasarTodos() {
    let iterador = this.listaPerfilesDisponibles.entries();
    let i = 0;
    let limite = this.listaPerfilesDisponibles.length;
    while (i < limite) {
      this.pasarElementoEntreLista(
        this.listaPerfilesDisponibles,
        this.listaPerfilesAsignados,
        iterador.next().value[1].id,
        false
      );
      i++;
    }
    this.vaciarLista(this.listaPerfilesDisponibles);

    // Poner permisos solo lectura
    this.ponerPermisos(new Array<Permiso>());
  }

  quitarUno(auxIdPermisoAsignado: number = null) {
    let permisoQuitados: Array<Permiso> = new Array<Permiso>();
    if (auxIdPermisoAsignado == null) {
      auxIdPermisoAsignado = this.idPerfilAsignado;
    }
    permisoQuitados = this.listaPerfilesAsignados.find(
      (x) => x.id === auxIdPermisoAsignado
    ).permissions;

    this.pasarElementoEntreLista(
      this.listaPerfilesAsignados,
      this.listaPerfilesDisponibles,
      auxIdPermisoAsignado
    );
    this.idPerfilAsignado = 0;

    console.info('quitarUno');
    this.arbolPermisoRef.ponerPermisos(
      this.armarListaPermisoTotal(),
      this.usuario.list_permission
    );

    // Poner permisos solo lectura
    //this.ponerPermisos(permisoQuitados);
  }

  quitarTodos() {
    let iterador = this.listaPerfilesAsignados.entries();
    let i = 0;
    let limite = this.listaPerfilesAsignados.length;
    while (i < limite) {
      this.pasarElementoEntreLista(
        this.listaPerfilesAsignados,
        this.listaPerfilesDisponibles,
        iterador.next().value[1].id,
        false
      );
      i++;
    }
    this.vaciarLista(this.listaPerfilesAsignados);

    // Poner permisos solo lectura
    this.ponerPermisos(this.arbolPermisoRef.obtenerPermisoMarcado());
  }

  pasarElementoEntreLista(
    lOrigen: Array<Perfil>,
    lDestino: Array<Perfil>,
    id,
    eliminarElemento = true
  ) {
    if (id == 0) return;
    let auxPerfil: Perfil = Object.assign(
      {},
      lOrigen.find((x) => x.id === id)
    );
    lDestino.push(auxPerfil);

    if (eliminarElemento) {
      const auxIndex = lOrigen.findIndex((x) => x.id === id);
      lOrigen.splice(auxIndex, 1);
    }
  }

  vaciarLista(lOriginal: Array<Perfil>) {
    while (lOriginal.length) {
      lOriginal.pop();
    }
  }

  ponerPermisos(permisoQuitados: Array<Permiso>) {
    // Armar lista de PermisoLista
    let listaPermisoTotal: Array<Permiso> = this.armarListaPermisoTotal();

    // Obtener lista de permisos adicionales
    let listaPermisoArbol: Array<Permiso> = this.obtenerPermisoAdicionales(
      listaPermisoTotal
    );

    console.log('listaPermisoArbol antes :>> ', listaPermisoArbol);
    // Obtener lista de permisos adicionales y quitar los permisos de los perfiles quitados
    if (listaPermisoArbol.length > 0) {
      permisoQuitados.forEach((permiso) => {
        if (listaPermisoArbol.find((x) => x.id === permiso.id) != undefined) {
          let index = listaPermisoArbol.findIndex((x) => x.id === permiso.id);
          listaPermisoArbol.splice(index, 1);
        }
      });
    }

    console.log('listaPermisoArbol despues :>> ', listaPermisoArbol);
    // Armar arbol de pemisos
    this.arbolPermisoRef.ponerPermisos(listaPermisoTotal, listaPermisoArbol);
  }

  armarListaPermisoTotal(): Array<Permiso> {
    // Armar lista de PermisoLista
    let listaPermisoTotal: Array<Permiso> = new Array<Permiso>();
    this.listaPerfilesAsignados.forEach((perfil) => {
      perfil.permissions.forEach((permiso) => {
        let auxPermiso: Permiso = new Permiso();
        auxPermiso = Object.assign({}, permiso);

        if (permiso.parent_id == null) {
          // debugger;
          permiso.permissions.forEach((hijo) => {
            if (!listaPermisoTotal.some((e) => e.id === hijo.id)) {
              let auxHijo: Permiso = new Permiso();
              auxHijo = Object.assign({}, permiso);
              listaPermisoTotal.push(auxHijo);
            } else {
              if (hijo.check) {
                listaPermisoTotal.find((x) => x.id === hijo.id).check = true;
              }
            }
          });
        }
        if (!listaPermisoTotal.some((e) => e.id === permiso.id)) {
          listaPermisoTotal.push(auxPermiso);
        } else {
          if (auxPermiso.check) {
            listaPermisoTotal.find((x) => x.id === permiso.id).check = true;
          }
        }
      });
    });
    console.log(
      'armarListaPermisoTotal => listaPermisoTotal :>> ',
      listaPermisoTotal
    );
    return listaPermisoTotal;
  }

  obtenerPermisoAdicionales(listaPermisoTotal: Array<Permiso>): Array<Permiso> {
    // Obtener lista de permisos adicionales
    let listaPermisoArbol: Array<Permiso> = this.arbolPermisoRef.obtenerPermisoMarcado();
    if (listaPermisoArbol.length > 0) {
      listaPermisoTotal.forEach((permiso) => {
        if (listaPermisoArbol.find((x) => x.id === permiso.id) != undefined) {
          let index = listaPermisoArbol.findIndex((x) => x.id === permiso.id);
          listaPermisoArbol.splice(index, 1);
        }
      });
    }
    return listaPermisoArbol;
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
    this.router.navigate(['/backoffice/usuario']);
  }

  guardar() {
    this.mensageError = '';

    if (!this.isCheckedTypeUser) {
      this.ponerPermisos(new Array<Permiso>());

      this.usuario.list_permission = this.obtenerPermisoAdicionales(
        this.armarListaPermisoTotal()
      );
    }

    if (!this.validarGuardar()) {
      return;
    }
    this.usuario.list_profile = this.listaPerfilesAsignados;
    this.usuario.status = this.habilitado
      ? EnumEstado.Habilitado
      : EnumEstado.Deshabilitado;
    this.usuario.type_id = this.isCheckedTypeUser
      ? EnumTypeUser.Cobrador
      : EnumTypeUser.Multipago;
    this.usuario.extra_data.transactional_login = this.usuario.transactional_login;
    this.blockUI.start();
    const listaEmpresas = this.getCodigoListaEmpresaSeleccionadas();
    if (listaEmpresas.length == 0) {
      listaEmpresas.push(this.session.getListCodeServices()[0]);
    }
    this.usuarioService.guardar(this.usuario, listaEmpresas).subscribe(
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

  getCodigoListaEmpresaSeleccionadas() {
    const list = this.listaEmpresas
      .filter((x) => x.isCheck)
      .map(({code}) => code);

    return list;
  }

  ValidarAlfanumerico(event) {
    return this.validador.ValidarAlfabetico(event);
  }

  ValidarNumerico(event) {
    return this.validador.ValidarSoloNumero(event);
  }

  ValidarLetraNumero(event) {
    return this.validador.ValidarAlfaNumerico(event);
  }

  ValidarSoloNumeroyPunto(event) {
    return this.validador.ValidarSoloNumeroyPunto(event);
  }

  validarGuardar() {
    this.mensageError = '';

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
    if (this.usuario.email == '') {
      this.mensageError = 'Debe ingresar un correo válido.';
      return false;
    }

    if (!this.validador.ValidarCorreo(this.usuario.email)) {
      this.mensageError = 'Debe ingresar un correo válido.';
      return false;
    }

    if (!this.isCheckedTypeUser) {
      if (this.listaPerfilesAsignados.length == 0) {
        this.mensageError = 'Debe seleccionar al menos un perfil disponible.';
        return false;
      }
    }

    return true;
  }

  cancelar() {
    let obj: Dialogo = new Dialogo();
    obj.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea cancelar la operación y<br>volver a la lista de usuarios?</span>';
    obj.titulo = 'Confirmación';
    obj.txBtOk = 'Aceptar';
    obj.txBtCancel = 'Cancelar';
    this.dialogService
      .abrirDialogo(obj)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.location.back();
        }
      });
  }

}
