import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EnumCodigoRespuesta, EnumEstado} from 'src/app/helper/enum';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {VoucherPackageService} from 'src/app/services/voucher-package.service';
import {VoucherPackageParent} from 'src/app/models/voucher-package-parent';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {cmbService} from 'src/app/models/cmbService';
import {StorageService} from 'src/app/services/storage.service';
import {ViewVoucherPackagesComponent} from '../view-voucher-packages/view-voucher-packages.component';
import {VoucherCompanyService} from 'src/app/services/voucher-company.service';
import {IVoucherEmpresa} from 'src/app/models/voucher-empresa';

@Component({
  selector: 'app-voucher-package',
  templateUrl: './voucher-packages.component.html',
  styleUrls: ['./voucher-packages.component.css']
})
export class VoucherPackageComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  enumEstado = EnumEstado;
  voucherPackageParents: VoucherPackageParent[];
  voucherPackageParent: VoucherPackageParent;
  services: cmbService[];
  voucher_company_id: number;
  voucherCompanies: IVoucherEmpresa[];

  constructor(
    private session: StorageService,
    private vpackageService: VoucherPackageService,
    private vcompanyService: VoucherCompanyService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {
    this.init();
    this.listarAsignaciones();

  }


  ngOnInit(): void {
  }

  init() {
    this.services = this.session.getCurrentSession().user.list_code_service;
    this.voucher_company_id = 0;
    this.form = this.formBuilder.group({
      service_code: [this.services[0].code],
      status: [this.enumEstado.Todos.toString(), [Validators.required]],
      voucher_company_id: [this.voucher_company_id],
      search: ['']
    });
  }

  async listarAsignaciones() {
    this.blockUI.start();
    const listarEmpresas = await this.vcompanyService.obtenerLista(this.enumEstado.Todos, '', this.form.get('service_code').value).toPromise();
    this.voucherCompanies = listarEmpresas.data;
    const listarAsignaciones = await this.vpackageService
      .listarAsignaciones(this.form.get('service_code').value, this.form.get('status').value, this.form.get('voucher_company_id').value, this.form.get('search').value)
      .toPromise();
    if (listarAsignaciones.status == EnumCodigoRespuesta.Correcto) {
      this.voucherPackageParents = [];
      listarAsignaciones.data.forEach(item => {
        let vp = new VoucherPackageParent();
        vp.jsonToModel(item);
        this.voucherPackageParents.push(vp);
      });


      this.blockUI.stop();
    } else {
      this.blockUI.stop();
      this.voucherPackageParents = [];
    }
  }

  ver(id: number) {
    this.vpackageService
      .obtenerAsignacion(id).subscribe((resultado) => {

        this.voucherPackageParent = new VoucherPackageParent();
        if (resultado.status == EnumCodigoRespuesta.Correcto) {
          let vp = new VoucherPackageParent();
          vp.jsonToModel(resultado.data);
          this.voucherPackageParent = vp;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.width = '880px';
          dialogConfig.data = this.voucherPackageParent;

          this.dialog.open(ViewVoucherPackagesComponent, dialogConfig);

        } else {
          this.toastr.error(resultado.message);
        }

        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error(error);
      }
    );
  }

  downloadXlsx() {
    this.blockUI.start();
    this.vpackageService.downloadXlsx(this.voucherPackageParents).then(() => {
      this.blockUI.stop();
    });
  }

  downloadXlsxByVoucherPackageId(id: number) {
    this.blockUI.start();
    this.vpackageService.downloadXlsxByVoucherPackageId(id).then(() => {
      this.blockUI.stop();
    });
  }
}
