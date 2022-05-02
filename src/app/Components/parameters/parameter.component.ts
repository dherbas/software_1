import {Component, Inject, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ParametersService} from 'src/app/services/parameters.service';
import {ToastrService} from 'ngx-toastr';
import {ParameterService} from 'src/app/models/Parameters';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {PopUpCancelModel} from 'src/app/models/PopUpModel';
import {EnumCodigoRespuesta} from 'src/app/helper/enum';
import {cmbService} from '../../models/cmbService';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: []
})
export class ParameterComponent implements OnInit {


  @BlockUI() blockUI: NgBlockUI;
  services: cmbService[];
  parameter: ParameterService;
  updateForm: FormGroup;

  constructor(private router: Router,
              private parameterService: ParametersService,
              private toastr: ToastrService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private storageService: StorageService) {
    this.services = this.storageService.getCurrentSession().user.list_code_service;
    this.parameter = new ParameterService();
    this.initForm();
  }

  get Value() {
    return this.updateForm.get('value');
  }

  get Description() {
    return this.updateForm.get('description');
  }

  ngOnInit(): void {
    this.getParameter(this.route.snapshot.paramMap.get('id'));
  }

  getParameter(id: string) {
    this.blockUI.start();
    this.parameterService.EditParameter(Number(id)).subscribe(
      (resp) => {
        this.parameter = resp.data;
        this.initForm();
        this.blockUI.stop();
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/backoffice/parametros']);
        this.blockUI.stop();
        this.toastr.error(error);
      }
    );

  }

  updateParameter() {
    if (this.updateForm.valid) {
      this.blockUI.start();
      const name = this.updateForm.get('name').value;
      const value = this.Value.value;
      const description = this.Description.value;
      this.parameterService.UpdateParameter(this.parameter.id, name, value, description).subscribe(
        (resp) => {
          if (resp.status == EnumCodigoRespuesta.Correcto) {
            this.router.navigate(['/backoffice/parametro']);
            this.blockUI.stop();
            this.toastr.success('Se ha actualizado el parámetro.');
          } else {
            this.toastr.error(resp.message);
          }

        },
        (error) => {
          console.log(error);
          this.blockUI.stop();
          this.toastr.error('Su contraseña actual es incorrecta.');
        }
      );
    }

  }

  onCancel() {
    this.dialog.open(CancelDialog, {
      height: '220px',
      width: '380px',
    });
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      service_code: [{value: this.parameter.service_code, disabled: true}],
      name: [this.parameter.name, [Validators.required]],
      value: [this.parameter.value, [Validators.required]],
      description: [this.parameter.description, [Validators.required]]
    });

  }


}

@Component({
  selector: 'cancel-dialog',
  templateUrl: 'cancelPopUp.component.html',
})
export class CancelDialog {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<CancelDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PopUpCancelModel) {

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAcceptClick(): void {
    this.dialogRef.close();
    this.router.navigate(['/backoffice/parametro']);
  }

}
