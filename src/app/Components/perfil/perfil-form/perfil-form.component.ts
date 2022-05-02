import {Component, OnInit, ViewChild} from '@angular/core';
import {VariablesGlobalesService} from 'src/app/helper/variables-globales.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {DialogoVerService} from 'src/app/helper/dialogo-ver.service';
import {Dialogo} from 'src/app/models/dialogo';
import {Perfil} from 'src/app/models/perfil';
import {PerfilService} from 'src/app/services/perfil.service';
import {EnumCodigoRespuesta, EnumEstado} from 'src/app/helper/enum';
import {ArbolPermisoComponent} from 'src/app/Components/component/arbol-permiso/arbol-permiso.component';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Validador} from 'src/app/helper/validador';
import {ToastrService} from 'ngx-toastr';
import {StorageService} from 'src/app/services/storage.service';
import {User} from 'src/app/models/user';

@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.css'],
})
export class PerfilFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  id: number;
  perfil: Perfil = new Perfil();
  mensageError = '';
  accion = '';
  habilitado = false;
  titulo = '';
  selectedCompany = '';
  usuarioSession: User = null;
  @ViewChild(ArbolPermisoComponent, {static: true})
  arbolPermisoRef: ArbolPermisoComponent;

  constructor(
    private global: VariablesGlobalesService,
    private activeteRoute: ActivatedRoute,
    private location: Location,
    private dialogService: DialogoVerService,
    private perfilService: PerfilService,
    private router: Router,
    private validador: Validador,
    private toastr: ToastrService,
    private session: StorageService
  ) {
  }

  ngOnInit() {
    this.mensageError = '';
    this.id = this.activeteRoute.snapshot.params['id'];
    this.usuarioSession = this.session.getCurrentUser();
    this.selectedCompany = this.usuarioSession.list_code_service[0]?.code;
    if (this.id == 0) {
      this.titulo = 'Nuevo perfil';
      this.accion = 'Guardar';
      this.habilitado = true;
    } else {
      this.titulo = 'Editar perfil';
      this.accion = 'Actualizar';
      this.blockUI.start();
      this.perfilService.obtenerPorId(this.id).subscribe(
        (resultado) => {
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.perfil = resultado.data;
            this.habilitado = this.perfil.status == EnumEstado.Habilitado;
            this.selectedCompany = this.perfil.company_code;
            console.log('this.perfil :>> ', this.perfil);
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

  guardar() {
    this.mensageError = '';
    this.perfil.permissions = this.arbolPermisoRef.obtenerPermisoMarcado();
    this.perfil.status = this.habilitado
      ? EnumEstado.Habilitado
      : EnumEstado.Deshabilitado;
    if (!this.validarGuardar()) {
      return;
    }

    this.blockUI.start();
    let company_list: string[] = [];
    if (this.usuarioSession.list_code_service.length > 1) {
      company_list.push(this.selectedCompany);
    } else {
      company_list = this.session.getListCodeServices();
    }
    console.log(company_list);
    this.perfilService.guardar(this.perfil, company_list).subscribe(
      (resultado) => {
        if (resultado.status == EnumCodigoRespuesta.Correcto) {
          this.router.navigate(['/backoffice/perfil']);
          let mensaje = '';
          if (this.id > 0) {
            mensaje =
              'Se ha actualizado los datos del perfil satisfactoriamente.';
          } else {
            mensaje = 'Se ha guardado el perfil satisfactoriamente.';
          }

          this.toastr.success(mensaje);
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

  validarGuardar(): boolean {
    this.mensageError = '';
    console.log(this.perfil);
    if (this.perfil.name.trim() == '') {
      this.mensageError = 'Debe ingresar un nombre de perfil válido.';
      return false;
    }

    if (this.perfil.description.trim() == '') {
      this.mensageError = 'Debe ingresar una descripción válida.';
      return false;
    }

    if (this.perfil.permissions.length == 0) {
      this.mensageError =
        'Debe seleccionar al menos un permiso disponible para el perfil.';
      return false;
    }

    return true;
  }

  cancelar() {
    const obj: Dialogo = new Dialogo();
    obj.titulo = 'Confirmación';
    obj.html =
      '<span>¿Está seguro que desea cancelar la operación y<br>volver a la lista de perfiles?</span>';
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

  ValidarAlfanumerico(event): boolean {
    return this.validador.ValidarAlfaNumerico(event);
  }
}
