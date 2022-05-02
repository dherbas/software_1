import { ParameterService } from 'src/app/models/Parameters';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import {
  MeetingConfig,
  ParametersService,
} from 'src/app/services/parameters.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage.service';
import { EnumCodigoRespuesta } from 'src/app/helper/enum';
import { cmbService } from '../../models/cmbService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Dialogo } from 'src/app/models/dialogo';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CancelDialog } from './parameter.component';
import { DialogoVerService } from 'src/app/helper/dialogo-ver.service';
export class filtersMovement {
  startDate: string;

  constructor() {
    this.startDate = '0';
  }
}

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styles: [],
})
export class ParametersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  services: cmbService[];
  servicesCode: any[];

  totalParameters: number;

  updateForm: FormGroup;

  // _filters: filtersMovement;

  constructor(
    private router: Router,
    private parameterService: ParametersService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogService: DialogoVerService
  ) {
    // this._filters = new filtersMovement();

    this.services =
      this.storageService.getCurrentSession().user.list_code_service;
    this.servicesCode = this.storageService.getListCodeServices();
    this.initForm();
    this.blockUI.stop();
  }

  get Asunto() {
    // console.log('Asunto :>> ', this.updateForm);
    return this.updateForm.get('asunto');
  }

  get Password() {
    return this.updateForm.get('password');
  }
  get Date() {
    return this.updateForm.get('startDate');
  }

  ngOnInit(): void {}

  updateServiceCode(event: any): void {
    // this.form.get('service_code').setValue(event);
    // this.getParameters();
  }
  onCancel() {
    window.location.reload();
    // this.dialog.open(CancelDialog, {
    //   height: '220px',
    //   width: '380px',
    // });
  }

  updateParameter() {
    if (this.updateForm.valid) {
      this.blockUI.start();
      const asunto = this.Asunto.value;
      const password = this.Password.value;
      const date = this.Date.value;
      const code = 'S0HQGyDLZJ_pVgxpmobS6iqYRlLFfr94Q';

      this.parameterService
        .createMeeting(code, asunto, password, date)
        .subscribe(
          (resp) => {
            this.blockUI.stop();
            console.log('resp :>> ', resp);
            if (resp == null) {
              alert('Ocurrió un error intente nuevamente.');
              return;
            }
            this.openDialogMeeting(resp);
            return resp;
          },
          (error) => {
            console.log(error);
            this.blockUI.stop();
            this.toastr.error('Error al crear la reunión');
          }
        );
    }
  }
  openDialogMeeting(resp: MeetingConfig) {
    let obj2: Dialogo = new Dialogo();
    obj2.titulo = 'Reunión creada';
    obj2.html =
      '<span class="da-texto-popup-bo">La reunión  <strong>"' +
      resp.topic +
      '"</strong> fue creada con éxito.' +
      '<br> Para ingresar a la reunión ingrese al siguiente ' +
      '<strong> <a href="' +
      resp.start_url +
      '" target="_blank">enlace</a>' +
      '</strong>' +
      '</span>';
    obj2.txBtOk = 'Cerrar';
    this.dialogService
      .abrirDialogo(obj2)
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          window.location.reload();
        }
      });
  }
  initForm() {
    var my_date = new Date();
    let first_date = new Date(my_date.getFullYear(), my_date.getMonth(), 1);

    // this._filters.startDate = first_date.toISOString().split('T')[0];
    // console.log('this._filters.startDate :>> ', this._filters.startDate);

    this.updateForm = this.formBuilder.group({
      // service_code: [{value: this.parameter.service_code, disabled: true}],
      asunto: '',
      password: '',
      startDate: first_date.toISOString().split('T')[0],
    });
  }
}
