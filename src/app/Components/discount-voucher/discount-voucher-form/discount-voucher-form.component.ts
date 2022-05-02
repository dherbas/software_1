import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as XLSX from 'xlsx';

import {DiscountVoucher,} from 'src/app/models/discount_voucher';
import {DiscountVoucherService} from 'src/app/services/discount-voucher.service';
import {ToastrService} from 'ngx-toastr';
import {EnumCodigoRespuesta} from 'src/app/helper/enum';
import {VoucherPackage} from 'src/app/models/voucher-package';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {VoucherPackageService} from 'src/app/services/voucher-package.service';
import {General} from 'src/app/helper/general';
import * as moment from 'moment';
import {StorageService} from 'src/app/services/storage.service';
import {Paginador} from "../../../helper/paginador";

type AOA = any[][];


@Component({
  selector: 'app-discount-voucher-form',
  templateUrl: './discount-voucher-form.component.html',
  styleUrls: ['./discount-voucher-form.component.css'],
})

export class DiscountVoucherFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public _Paginador: Paginador = new Paginador();
  newVoucher: DiscountVoucher = new DiscountVoucher();
  package: VoucherPackage;
  asignacionIndividual = true;
  amoutPerVoucher = 0;
  listVoucher: DiscountVoucher[] = [];
  mensageError = '';
  HGeneral: General = new General();
  availableAmount = 0;
  startDate = '';
  endDate = '';
  maxDate = '';
  minDate = '';
  data: AOA = [
    [1, 2],
    [3, 4],
  ];

  constructor(
    private activeteRoute: ActivatedRoute,
    private voucherService: DiscountVoucherService,
    private toastService: ToastrService,
    private router: Router,
    private packageService: VoucherPackageService,
    private session: StorageService
  ) {
    //router.navigateByUrl('/generar-vales-inicio/0');
  }

  ngOnInit(): void {
    const idPackage = this.activeteRoute.snapshot.params['id_package'];
    this.getPackage(idPackage);
  }

  getPackage(idPackage) {
    this.blockUI.start();
    this.packageService.obtenerBolsa(idPackage).subscribe(
      (resp) => {
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          this.package = resp.data;
          console.log(this.package);

          this.startDate = moment(this.package.start_date).format('YYYY-MM-DD');
          this.endDate = moment(this.package.expiration_date).format(
            'YYYY-MM-DD'
          );
          this.minDate = this.startDate;
          this.maxDate = this.endDate;

          this.availableAmount = this.package.amount - this.package.amount_used;
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
      }
    );
  }

  onFileChange(evt: any) {
    this.blockUI.start();
    this.mensageError = '';
    const target: DataTransfer = evt.target as DataTransfer;
    if (target.files.length !== 1) {
      throw new Error('Solo cargue un archivo');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, {header: 1}) as AOA;
      console.log('data :>> ', this.data);
      let error = this.validateExcelFile();
      if (error.length > 0) {
        this.toastService.error(error,
          '',
          {
            enableHtml: true,
            closeButton: true,
            timeOut: 49000,
            progressBar: true,
          });
        this.blockUI.stop();
        return;
      }
      this.listVoucher = [];
      this.data.forEach((element) => {
        let voucher = new DiscountVoucher();
        voucher.first_name = element[0];
        voucher.last_name = element[1];
        voucher.ci = element[2];
        voucher.phone_number = element[3];
        voucher.email = element[4];
        voucher.amount = this.amoutPerVoucher;
        this.listVoucher.push(voucher);
      });
      this.blockUI.stop();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  validateExcelFile(): string {
    let errores = '';
    let cont = 1;
    let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    this.data.forEach((element) => {
      if (element.length < 5 || element.length > 5) {
        errores += 'Datos incompletos en la fila ' + cont + '<br>';
      }
      if (!emailRegex.test(element[4])) {
        errores += 'Formato de correo no válido en la celda: E' + cont + '<br>';
      }
      cont++;
    });
    return errores;
  }

  cancel() {
    this.goToIndex();
  }

  validationVoucher(): boolean {
    this.mensageError = '';
    if (this.amoutPerVoucher <= 0) {
      this.mensageError = 'Ingrese un monto a asignar válido.';
      return false;
    }
    if (!this.isTotalAmountOK()) {
      this.mensageError = 'El monto total asignado supera al monto disponible';
      return false;
    }

    if (this.asignacionIndividual) {
      if (this.newVoucher.first_name.trim() === '') {
        this.mensageError = 'Ingrese un nombre válido.';
        return false;
      }
      if (this.newVoucher.last_name.trim() === '') {
        this.mensageError = 'Ingrese un apellido válido.';
        return false;
      }
      if (this.newVoucher.ci.trim() === '') {
        this.mensageError = 'Ingrese una cédula de identidad válida.';
        return false;
      }
      if (this.newVoucher.phone_number.trim() === '') {
        this.mensageError = 'Ingrese un teléfono/celular válido.';
        return false;
      }
      if (this.newVoucher.email.trim() === '') {
        this.mensageError = 'Ingrese un correo electrónico válido.';
        return false;
      }
    } else {
      if (this.listVoucher.length === 0) {
        this.mensageError =
          'Debe de cargar un archivo excel con datos válidos.';
        return false;
      }
    }
    return true;
  }

  onchangeAmount(valor: number): void {
    if (this.isTotalAmountOK()) {
      this.mensageError = '';
    } else {
      this.mensageError = 'El monto total asignado supera al monto disponible';
    }
  }

  isTotalAmountOK(): boolean {
    if (this.asignacionIndividual) {
      return this.amoutPerVoucher <= this.availableAmount;
    } else {
      const amountInList = this.listVoucher.length * this.amoutPerVoucher;
      return amountInList <= this.availableAmount;
    }
  }

  saveVoucher() {
    this.blockUI.start();

    if (!this.validationVoucher()) {
      this.blockUI.stop();
      return;
    }
    this.saveVoucherPredetermined(); //Cuando es con el flujo normal o del desde un excel
  }

  saveVoucherPredetermined() {
    if (this.asignacionIndividual) {
      this.listVoucher = [];
      this.listVoucher.push(this.newVoucher);
    }
    this.listVoucher.forEach((element) => {
      element.amount = this.amoutPerVoucher;
    });
    const start_date: Date = moment(this.startDate).toDate();
    const end_date: Date = moment(this.endDate).toDate();
    this.voucherService
      .saveVoucher(this.package.id, this.listVoucher, start_date, end_date)
      .subscribe(
        (resp) => {
          this.blockUI.stop();
          if (resp.status == EnumCodigoRespuesta.Correcto) {
            this.toastService.success(
              'La generación de vales fue realizada correctamente.'
            );
            this.goToIndex();
          } else {
            this.toastService.error(
              'Ocurrió un problema inesperado, contacte con el administrador.'
            );
          }
        },
        (error) => {
          this.blockUI.stop();
          this.toastService.error(
            'Ocurrió un problema inesperado, contacte con el administrador.'
          );
        }
      );
  }


  goToIndex() {
    this.router.navigate([
      '/backoffice/generar-vales-inicio/' + this.package.id,
    ]);
  }

}
