import {Component, OnInit} from '@angular/core';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {VoucherPackage} from 'src/app/models/voucher-package';
import {VoucherPackageParent} from 'src/app/models/voucher-package-parent';
import {ActivatedRoute, Router} from '@angular/router';
import {StorageService} from 'src/app/services/storage.service';
import {VoucherPackageService} from 'src/app/services/voucher-package.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {User} from 'src/app/models/user';
import {Dialogo} from 'src/app/models/dialogo';
import {cmbService} from 'src/app/models/cmbService';
import {EnumCodigoRespuesta, EnumEstado} from 'src/app/helper/enum';
import {VoucherPackageDialogComponent} from '../voucher-package-dialog/voucher-package-dialog.component';
import {DialogoVerService} from 'src/app/helper/dialogo-ver.service';
import {AssignUserDialogComponent} from '../assign-user-dialog/assign-user-dialog.component';
import {ParametersService} from "../../../services/parameters.service";
import {ParameterService} from "../../../models/Parameters";


@Component({
  selector: 'app-assign-voucher-package',
  templateUrl: './assign-voucher-package.component.html',
  styleUrls: ['./assign-voucher-package.component.css']
})
export class AssignVoucherPackageComponent implements OnInit {
  @BlockUI()
  blockUI: NgBlockUI;

  form: FormGroup;
  formVoucherPackage: FormGroup;
  voucherPackageParent: VoucherPackageParent;
  voucherPackage: VoucherPackage;
  voucherPackages: VoucherPackage[];
  voucherCompanies: any[];
  users = [];

  btnSubmit: string;
  totalAmount: number;
  totalAmountUsed: number;
  services: cmbService[];
  user: User;
  disableSelectUser = false;
  consumeService = false;
  parameters: ParameterService[];
  contractNumbers: any[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageService: StorageService,
              private vpackageService: VoucherPackageService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private dialogService: DialogoVerService,
              private parameterService: ParametersService) {
    this.consumeService = this.storageService.getCurrentUser().consume_services;
    this.obtenerPorId(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.listarAsignaciones();
  }

  get VoucherCompanyId() {
    return this.form.get('voucher_company_id');
  }

  ngOnInit(): void {
    this.btnSubmit = 'Guardar';

  }

  initForm() {
    this.form = this.formBuilder.group({
      service_code: [this.services[0].code],
      voucher_company_id: [0, [Validators.required]],
      username: [{value: this.voucherPackageParent.user_account.username, disabled: true}, [Validators.required]],
      status: [this.voucherPackageParent.status]
    });

  }

  async obtenerPorId(id: string) {
    this.blockUI.start();
    this.services = this.storageService.getCurrentSession().user.list_code_service;
    this.voucherCompanies = [];
    this.voucherPackageParent = new VoucherPackageParent();
    this.voucherPackages = [];
    this.totalAmount = 0;
    this.totalAmountUsed = 0;
    if (id === '0') {
      this.voucherPackageParent.user_account = new User();
      this.btnSubmit = 'Guardar';
      try {
        const listarEmpresas = await this.vpackageService.listarEmpresas(this.services[0].code).toPromise();
        this.voucherCompanies = listarEmpresas.data;
        this.blockUI.stop();
      } catch (error) {
        this.blockUI.stop();
        this.toastr.error(error);
      }
    } else {
      try {
        const obtenerAsignacion = await this.vpackageService.obtenerAsignacion(Number(id)).toPromise();
        if (obtenerAsignacion.status == EnumCodigoRespuesta.Correcto) {
          const vp = new VoucherPackageParent();
          vp.jsonToModel(obtenerAsignacion.data);
          this.voucherPackageParent = vp;
          this.voucherPackages = this.voucherPackageParent.voucher_packages;
          this.btnSubmit = 'Actualizar';
          const vc = {name: this.voucherPackageParent.voucher_company};
          this.voucherCompanies.push(vc.name);

        }
        this.totalAmount = this.voucherPackages.reduce((x, vp) => x += (+vp.amount), 0);
        this.totalAmountUsed = this.voucherPackages.reduce((x, vp) => x += (+vp.amount_used), 0);
        this.blockUI.stop();
      } catch (error) {
        this.blockUI.stop();
        this.toastr.error(error);
      }
    }

    if (this.voucherPackageParent.id > 0) {
      this.form.get('voucher_company_id').disable();
      this.form.get('status').setValue(this.voucherPackageParent.status);
    }

  }

  dialogoBolsa(id: number, vp: boolean = false) {
    if (id > 0 && !vp) {
      this.voucherPackage = this.voucherPackages.find(x => x.id === id);
    } else if (id > 0 && vp) {
      this.voucherPackage = this.voucherPackages.find(x => x.id_temporary === id);
    } else {
      this.voucherPackage = new VoucherPackage();
    }

    let dialogWidth = '450px';
    if (this.consumeService) {
      dialogWidth = '600px';
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = dialogWidth;
    dialogConfig.data = {voucherPackage: this.voucherPackage, contracts: this.contractNumbers};

    const dialogRef = this.dialog.open(VoucherPackageDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (result: VoucherPackage) => {
        if (result !== undefined) {
          if (result.id === 0 && result.id_temporary === 0) {
            result.id_temporary = new Date().valueOf();
            result.amount_used = 0;
            result.created_at = moment().toDate();
            result.status = EnumEstado.Habilitado;
            this.voucherPackages.push(result);
          }
          this.totalAmount = this.voucherPackages.reduce((x, voucherPackage) => x += (+voucherPackage.amount), 0);
          this.totalAmountUsed = this.voucherPackages.reduce((x, voucherPackage) => x += (+voucherPackage.amount_used), 0);
        }
      }
    );
  }

  async dialogoUsuario() {
    this.disableSelectUser = true;
    this.blockUI.start();
    const voucherCompanyId = this.form.get('voucher_company_id').value;
    const result = await this.vpackageService.listarUsuarios(voucherCompanyId).toPromise();
    this.users = result.data;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {voucher_company: this.voucherCompanies[voucherCompanyId], users: this.users};

    const dialogRef = this.dialog.open(AssignUserDialogComponent, dialogConfig);
    this.blockUI.stop();
    dialogRef.afterClosed().subscribe((resultDialog: User) => {
      if (resultDialog !== undefined) {
        this.voucherPackageParent.user_account = resultDialog;
      }
      this.disableSelectUser = false;
    });
  }

  guardar() {
    this.blockUI.start();
    this.voucherPackageParent.voucher_packages = this.voucherPackages;
    this.voucherPackageParent.status = this.form.get('status').value ? EnumEstado.Habilitado : EnumEstado.Deshabilitado;

    this.vpackageService.guardarBolsa(this.voucherPackageParent).subscribe(
      (resultado) => {
        if (resultado.status === EnumCodigoRespuesta.Correcto) {
          this.router.navigate(['/backoffice/bolsa']);
          const mensaje = this.voucherPackageParent.id > 0 ? 'actualizado los datos de la' : 'guardado la';
          this.toastr.success('Se ha ' + mensaje + ' bolsa satisfactoriamente.');
        } else {
          this.toastr.error(resultado.message);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
      }
    );

  }

  onCancel() {
    const dialog = new Dialogo();
    dialog.titulo = 'Confirmación';
    dialog.html = '<span class="da-texto-popup-bo">¿Está seguro que desea cancelar la operación y<br>volver a la lista de asignación de bolsas?</span>';
    dialog.txBtOk = 'Aceptar';
    dialog.txBtCancel = 'Cancelar';
    this.dialogService.abrirDialogo(dialog)
      .afterClosed().subscribe((res) => {
      if (res) {
        this.router.navigate(['/backoffice/bolsa']);
      }
    });
  }

  dialogoBolsaEstado(id: number, description: string, status: number) {
    const dialog = new Dialogo();
    const statusDialog = status === EnumEstado.Habilitado ? 'deshabilitar' : 'habilitar';
    const statusToast = status === EnumEstado.Habilitado ? 'deshabilitado' : 'habilitado';
    dialog.titulo = 'Confirmación';
    dialog.html =
      '<span class="da-texto-popup-bo">¿Está seguro que desea ' + statusDialog + ' la bolsa<br>' + '<strong>' + description + '</strong>' + '?</span>';
    dialog.txBtOk = 'Aceptar';
    dialog.txBtCancel = 'Cancelar';
    this.dialogService.abrirDialogo(dialog).afterClosed().subscribe((res) => {
      if (res) {
        let vp = null;
        if (this.voucherPackageParent.id > 0) {
          vp = this.voucherPackages.find(x => x.id === id);
        } else {
          vp = this.voucherPackages.find(x => x.id_temporary === id);
        }
        vp.status = status === EnumEstado.Habilitado ? EnumEstado.Deshabilitado : EnumEstado.Habilitado;
      }
    });
  }

  async getVoucherCompanies() {
    const service_code = this.form.get('service_code').value;
    this.blockUI.start();
    this.vpackageService.listarEmpresas(service_code).subscribe(
      (resp) => {
        this.voucherCompanies = resp.data;
        this.form.get('voucher_company_id').setValue(Object.keys(this.voucherCompanies)[0]);
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error(error);
      }
    );
  }

  seleccionarUsuario() {
    this.voucherPackageParent.user_account = new User();
  }

  async listarAsignaciones(): Promise<any> {
    this.contractNumbers = [];
    const serviceCode = this.storageService.getListCodeServices()[0];
    await this.vpackageService
      .listarAsignaciones(serviceCode, EnumEstado.Todos, 0, '')
      .toPromise().then((result) => {
        if (result.status == EnumCodigoRespuesta.Correcto) {
          result.data.forEach(item => {
            const vp = new VoucherPackageParent();
            vp.jsonToModel(item);
            this.contractNumbers.push(vp.contract_numbers);
          });
        }
      });

  }

}
