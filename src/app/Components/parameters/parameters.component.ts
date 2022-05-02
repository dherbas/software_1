import {ParameterService} from 'src/app/models/Parameters';
import {Component, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Router} from '@angular/router';
import {ParametersService} from 'src/app/services/parameters.service';
import {ToastrService} from 'ngx-toastr';
import {StorageService} from 'src/app/services/storage.service';
import {EnumCodigoRespuesta} from 'src/app/helper/enum';
import {cmbService} from '../../models/cmbService';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styles: []
})
export class ParametersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  services: cmbService[];
  servicesCode: any[];
  parameters: ParameterService[];
  totalParameters: number;
  form: FormGroup;

  constructor(
    private router: Router,
    private parameterService: ParametersService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
  ) {
    this.services = this.storageService.getCurrentSession().user.list_code_service;
    this.servicesCode = this.storageService.getListCodeServices();
    this.form = this.formBuilder.group({
      service_code: [this.services[0].code],
    });
  }

  ngOnInit(): void {
    this.getParameters();
  }

  getParameters() {
    const serviceCode = this.servicesCode.length > 1 ? this.form.get('service_code').value : this.services[0].code;
    console.log(this.form.get('service_code').value);
    this.blockUI.start();
    this.parameterService.GetParameters(serviceCode).subscribe(
      (resp) => {
        this.parameters = new Array<ParameterService>();
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          this.parameters = resp.data;

          this.totalParameters = this.parameters.length;
          if (this.totalParameters == 0) {
            this.toastr.error('No se encontraron parámetros');
          }
        } else {
          this.toastr.error(resp.message);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error('Ha ocurrido un problema, inténtelo más tarde');
      }
    );
  }

  updateServiceCode(event: any): void {
    this.form.get('service_code').setValue(event);
    this.getParameters();
  }
}


