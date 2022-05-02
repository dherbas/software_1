import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VoucherPackage} from 'src/app/models/voucher-package';
import * as moment from 'moment';
import {ValidatorService} from 'src/app/services/validations/validator.service';
import {General} from 'src/app/helper/general';
import {StorageService} from 'src/app/services/storage.service';
import {EnumServicioRespuesta} from '../../../helper/enum';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {VoucherPackageService} from '../../../services/voucher-package.service';
import {DiscountVoucher} from '../../../models/discount_voucher';

@Component({
  selector: 'app-voucher-package-dialog',
  templateUrl: './voucher-package-dialog.component.html',
  styleUrls: ['./voucher-package-dialog.component.css']
})
export class VoucherPackageDialogComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  titulo: string;
  form: FormGroup;
  formBolsa: FormGroup;
  startDate: Date;
  expirationDate: Date;
  general: General = new General();
  consumeService = false;
  searchByNro = 1;
  searchByName = 2;
  businessVouchers: DiscountVoucher[] = [];
  businessVoucherSelected: DiscountVoucher = new DiscountVoucher();
  formSubmitted = false;
  errorMessage = '';
  voucherPackage: VoucherPackage = new VoucherPackage();
  contracts: any[] = [];

  constructor(private router: Router,
              private dialogRef: MatDialogRef<VoucherPackageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private validators: ValidatorService,
              private storageService: StorageService,
              private packageService: VoucherPackageService) {
    this.voucherPackage = data.voucherPackage;
    this.contracts = data.contracts;
    this.consumeService = this.storageService.getCurrentUser().consume_services;
    this.formBolsa = this.fb.group({
      description: [this.voucherPackage.description, [Validators.required]],
      amount: [this.voucherPackage.amount?.toString(), [Validators.required, Validators.min(1)]],
      start_date: [moment(this.voucherPackage.start_date).format('YYYY-MM-DD')],
      expiration_date: [moment(this.voucherPackage.expiration_date).format('YYYY-MM-DD'), [this.validators.dateGreaterThanOrEqualToNow()]],
    }, {validator: this.validators.dateLessThan('start_date', 'expiration_date')});
    this.form = this.fb.group({
      type: [this.searchByNro.toString()],
      search: [''],
      business_voucher: ['', [Validators.required]],
      start_date: [moment(this.voucherPackage.start_date).format('YYYY-MM-DD'), [Validators.required]],
      expiration_date: [moment(this.voucherPackage.expiration_date).format('YYYY-MM-DD'), [Validators.required, this.validators.dateGreaterThanOrEqualToNow()]],
    }, {validator: this.validators.dateLessThan('start_date', 'expiration_date')});
    this.getBusinessVouchers('0').then(() => {
      if (this.voucherPackage.id > 0 || this.voucherPackage.id_temporary > 0) {
        this.startDate = this.voucherPackage.start_date;
        this.expirationDate = this.voucherPackage.expiration_date;
        if (this.voucherPackage.extra_data?.length > 0) {
          this.BusinessVoucher.setValue(this.voucherPackage.getContractNumber());
        }
      }
    });
  }

  get Type() {
    return this.form.get('type');
  }

  get Search() {
    return this.form.get('search');
  }

  get BusinessVoucher() {
    return this.form.get('business_voucher');
  }

  get StartDate() {
    return this.form.get('start_date');
  }

  get ExpirationDate() {
    return this.form.get('expiration_date');
  }

  get Description() {
    return this.formBolsa.get('description');
  }

  get Amount() {
    return this.formBolsa.get('amount');
  }

  get Start_Date() {
    return this.formBolsa.get('start_date');
  }

  get Expiration_Date() {
    return this.formBolsa.get('expiration_date');
  }

  ngOnInit() {
    this.errorMessage = '';
    if (this.voucherPackage.id > 0) {
      this.titulo = 'Editar';
    } else {
      this.titulo = 'Nueva';
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAccept(): void {
    if ((this.Description.dirty || this.Description.touched) && this.Description.invalid && this.Description.errors) {
      this.errorMessage = 'Debe ingresar una descripción válida.';
    } else if ((this.Amount.dirty || this.Amount.touched) && this.Amount.invalid && this.Amount.errors) {
      this.errorMessage = 'Debe ingresar un monto válido.';
    } else if ((this.Amount.dirty || this.Amount.touched) && (this.voucherPackage.amount_used > 0 && this.Amount.value <= this.voucherPackage.amount_used)) {
      this.errorMessage = 'Debe ingresar un monto mayor al monto utilizado.';
    } else if ((this.Start_Date.dirty || this.Start_Date.touched) && this.Start_Date.invalid && this.Start_Date.errors?.invalidDate
    ) {
      this.errorMessage = 'Debe ingresar una fecha de inicio válida.';
    } else if ((this.Expiration_Date.dirty || this.Expiration_Date.touched) && this.Expiration_Date.invalid && this.Expiration_Date.errors?.invalidDate
    ) {
      this.errorMessage = 'Debe ingresar una fecha fin válida.';
    } else if ((this.Expiration_Date.dirty || this.Expiration_Date.touched) && this.Start_Date.invalid && this.Start_Date.errors?.invalidDates
    ) {
      this.errorMessage = 'La fecha de inicio debe ser menor a la fecha fin.';
    } else if (this.formBolsa.valid && this.Amount.value >= this.voucherPackage.amount_used) {
      this.voucherPackage.description = this.formBolsa.get('description').value;
      this.voucherPackage.amount = this.formBolsa.get('amount').value;
      this.voucherPackage.start_date = this.formBolsa.get('start_date').value;
      this.voucherPackage.expiration_date = this.formBolsa.get('expiration_date').value;
      this.dialogRef.close(this.voucherPackage);
    }
  }

  maskNumber(value: any) {
    this.general.changeToNumberFormat(value);
  }

  changeType(): void {

  }

  save(): void {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.voucherPackage = new VoucherPackage();
      this.businessVoucherSelected = this.businessVouchers.find((x) => x.contract_number === this.BusinessVoucher.value);
      this.voucherPackage.description = this.businessVoucherSelected.contract_number + ' - ' + this.businessVoucherSelected.description;
      this.voucherPackage.amount = this.businessVoucherSelected.sub_total;
      this.voucherPackage.expiration_date = this.ExpirationDate.value;
      this.voucherPackage.start_date = this.StartDate.value;
      this.voucherPackage.extra_data = this.businessVoucherSelected.extra_data;
      this.dialogRef.close(this.voucherPackage);
    } else {
      if (this.BusinessVoucher.invalid && this.BusinessVoucher.errors?.required) {
        this.errorMessage = 'Debe seleccionar un contrato.';
      } else if (this.StartDate.invalid && this.StartDate.errors?.required) {
        this.errorMessage = 'Debe seleccionar una fecha de inicio válida.';
      } else if (this.ExpirationDate.invalid && this.ExpirationDate.errors?.required) {
        this.errorMessage = 'Debe seleccionar una fecha fin válida.';
      } else if (this.StartDate.invalid && this.StartDate.errors?.invalidDates) {
        this.errorMessage = 'La fecha de inicio debe ser menor a la fecha fin.';
      }
    }
  }


  async getBusinessVouchers(contratNumber: string): Promise<any> {
    this.blockUI.start();
    this.businessVouchers = [];
    const serviceCode = this.storageService.getListCodeServices()[0];
    await this.packageService.getBusinessVoucher(contratNumber, serviceCode).toPromise().then(
      (resp) => {
        if (resp.status == EnumServicioRespuesta.Correcto) {
          resp.data.forEach((x) => {
            const item = new DiscountVoucher();
            item.jsonToModelBusness(x);
            this.businessVouchers.push(item);
          });
          this.businessVouchers = this.businessVouchers.filter((x) => !this.contracts.some((t) => t == x.contract_number));
        }
        this.blockUI.stop();
      },
      (error) => {
        console.log(error);
        this.blockUI.stop();
      }
    );
  }


}
