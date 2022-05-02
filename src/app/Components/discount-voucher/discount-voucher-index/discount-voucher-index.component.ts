import {Component, OnInit} from '@angular/core';
import {MessageHandler} from 'src/app/models/messageHandler';
import {FilterVoucher} from 'src/app/helper/filter';
import {DiscountVoucher,} from 'src/app/models/discount_voucher';
import {General} from 'src/app/helper/general';
import {EnumCodigoRespuesta, EnumVoucherStatus} from 'src/app/helper/enum';
import {DiscountVoucherService} from 'src/app/services/discount-voucher.service';
import {ResponseAPIMultipago} from 'src/app/models/ResponseAPI';
import {EnumLiteral} from 'src/app/helper/enum-literal';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CancelVoucherComponent} from '../cancel-voucher/cancel-voucher.component';
import {VoucherPackage} from 'src/app/models/voucher-package';
import {VoucherPackageService} from 'src/app/services/voucher-package.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Paginador} from 'src/app/helper/paginador';
import {ToastrService} from 'ngx-toastr';
import {DetailsVoucherComponent} from '../details-voucher/details-voucher.component';
import * as moment from 'moment';

@Component({
  selector: 'app-discount-voucher-index',
  templateUrl: './discount-voucher-index.component.html',
  styleUrls: ['./discount-voucher-index.component.css'],
})
export class DiscountVoucherIndexComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  MSG_HANDLE: MessageHandler = new MessageHandler();
  _filters: FilterVoucher = new FilterVoucher();
  _listVouchers: DiscountVoucher[] = [];
  _listPackageVoucher: VoucherPackage[] = [];
  enumApiMultipago: ResponseAPIMultipago = new ResponseAPIMultipago();
  enumVoucher = EnumVoucherStatus;
  HGeneral: General = new General();
  HEnumLiteral: EnumLiteral = new EnumLiteral();
  availableAmount: number = 0;
  packageSelected: VoucherPackage = new VoucherPackage();
  public _Paginador: Paginador = new Paginador();
  today = moment(new Date()).format(
    'YYYY-MM-DD'
  ) + ' 00:00:00';

  constructor(
    private voucherService: DiscountVoucherService,
    private dialog: MatDialog,
    private activeteRoute: ActivatedRoute,
    private router: Router,
    private packageVoucherService: VoucherPackageService,
    private toastr: ToastrService
  ) {
    this._filters.state = this.enumVoucher.All;
    let idPackageSelected = -1;
    if (this.activeteRoute.snapshot.params.id > 0) {
      idPackageSelected = this.activeteRoute.snapshot.params.id;
    }

    this.getAllPackages(idPackageSelected);
  }

  ngOnInit(): void {
  }

  getAllPackages(idSelected: number) {
    this.blockUI.start();
    this.packageVoucherService.get_vpackagesNewVoucher(0).subscribe(
      (resp) => {
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          this._listPackageVoucher = resp.data;
          this.setPackageSelected(idSelected);

          this.queryVouchers();
          this.blockUI.stop();
        }
      },
      (error) => {
        console.log('error :>> ', error);
      }
    );
  }

  public setPackageSelected(idSelected: number): void {
    if (idSelected <= 0) {
      this.packageSelected = this._listPackageVoucher[0];
      this._filters.id_package_voucher = this.packageSelected?.id;
    } else {
      this.packageSelected = this._listPackageVoucher.find(
        (x) => x.id == idSelected
      );
      this._filters.id_package_voucher = idSelected;
    }
    this.availableAmount = this.packageSelected?.amount - this.packageSelected?.amount_used;
  }

  onFilterChange(newValue): void {
    this._filters.state = newValue;
    this.queryVouchers();
  }

  queryVouchers() {
    this.blockUI.start();
    this.voucherService.getDiscoutVouchers(this._filters).subscribe(
      (resp) => {
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          this._listVouchers = resp.data;
          if (this._listVouchers.length == 0) {
            this.MSG_HANDLE.NoData =
              'No se encontraron resultados para su criterio de búsqueda';
          }
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
      }
    );
  }

  voucherForm(id: number) {
    this.router.navigate([
      '/backoffice/generar-vales/' + this._filters.id_package_voucher,
    ]);
  }

  changePackage() {
    this.setPackageSelected(this._filters.id_package_voucher);

    this._listVouchers = [];
    this.MSG_HANDLE.NoData = '';
    this.queryVouchers();
  }

  openCancelVoucherDialog(item: DiscountVoucher) {
    const obj: any = {};
    console.log('item cancel voucher :>> ', item);
    obj.data = item;
    const dialogRef = this.dialog.open(CancelVoucherComponent, {
      width: '400px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.queryVouchers();
        this.availableAmount = this.availableAmount + Number(item.amount);
      }
    });
  }

  downloadXlsx() {
    this.voucherService.downloadXlsx(this._listVouchers, this.packageSelected);
  }

  forwardVoucher(id: number) {
    this.blockUI.start();
    this.voucherService.forwardVoucher(id).subscribe(
      (resp) => {
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          this.toastr.success('Se reenvió el vale correctamente.');
        } else {
          this.toastr.error(resp.message);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
      }
    );
  }

  VerDVoucher(id_voucher: number) {
    let myDVoucher: any;
    this.voucherService.getDVoucher(id_voucher).subscribe(
      (resp) => {
        myDVoucher = resp.data;

        this.displayDVoucher(myDVoucher);
      },
      (error) => {
        console.log(error);
        this.toastr.error(
          'Ha ocurrido un error, contactese con el administrador'
        );
      }
    );
  }

  displayDVoucher(DVoucher) {
    const dialogRef = this.dialog.open(DetailsVoucherComponent, {
      width: '650px',
      data: DVoucher,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      return;
    });
  }
}
