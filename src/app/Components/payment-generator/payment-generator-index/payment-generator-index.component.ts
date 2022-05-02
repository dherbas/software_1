import { Component, OnInit } from '@angular/core';
import { Pay_Orders } from 'src/app/models/pay_Orders';
import { StorageService } from 'src/app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { PayOrderService } from 'src/app/services/pay-order.service';
import { filtersMovement } from 'src/app/models/filtersMovement';
import { General } from 'src/app/helper/general';
import { CancelPaymentComponent } from '../cancel-payment/cancel-payment.component';
import { DetailsComponent } from '../details/details.component';
import { MessageHandler } from 'src/app/models/messageHandler';
import { EnumEstado, EnumPayOrderStatus } from 'src/app/helper/enum';
import { cmbService } from 'src/app/models/cmbService';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PayOrderCreatedComponent } from '../../new-pay-order/pay-order-created/pay-order-created.component';

@Component({
  selector: 'app-payment-generator-index',
  templateUrl: './payment-generator-index.component.html',
  styleUrls: ['./payment-generator-index.component.css'],
})
export class PaymentGeneratorIndexComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  _filters: filtersMovement;
  datesAreSelected: boolean;
  movements: Pay_Orders[] = [];
  totalMovements: number;
  HGeneral: General = new General();
  MSG_HANDLE: MessageHandler = new MessageHandler();
  enumEstado: EnumEstado;
  enumPayOrderStatus = EnumPayOrderStatus;
  companies: cmbService[] = [];
  selectedCompany: string;
  _currency: String = 'Bs';

  constructor(
    private sessionService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    private payOrderService: PayOrderService,
    private toastService: ToastrService,
    private storageService: StorageService
  ) {
    this._filters = new filtersMovement();
    this.datesAreSelected = false;
    this.totalMovements = 0;

    this.companies = sessionService.getCurrentSession().user.list_code_service;
    this.selectedCompany =
      this.companies.length > 0 ? this.companies[0].code : '';
    this._currency = this.HGeneral.getCurrency(storageService);
  }

  ngOnInit(): void {
    this.StarEndDate();
  }

  StarEndDate() {
    // debugger;
    let date = new Date();
    let primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
    let ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log('Primer Dia >> ' + primerDia.toDateString());
    console.log('Ultimo Dia >> ' + ultimoDia.toDateString());
    this._filters.startDate = primerDia.toISOString().split('T')[0];
    this._filters.endDate = ultimoDia.toISOString().split('T')[0];
  }

  QueryMovements() {
    // debugger;
    this.MSG_HANDLE.Error = '';
    if (this.isValid() === false) {
      return;
    }
    this.blockUI.start();
    this.payOrderService
      .getPayOrderFilter(this._filters, this.selectedCompany)
      .subscribe(
        (resp) => {
          const payOrderStr = 'pay_orders';
          this.movements = resp.data[payOrderStr];

          this.totalMovements = this.movements.length;

          if (this.totalMovements === 0) {
            this.MSG_HANDLE.NoData =
              'No se encontraron resultados para su criterio de búsqueda.';
          }

          this.changeStatusName();
          this.sortMovements();
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.toastService.error(
            'Ha ocurrido un error contactarse con el administrador'
          );
        }
      );
  }

  isValid(): boolean {
    // debugger;
    if (this.empty_validate() === false) {
      // this.MSG_HANDLE.Error = this._filters.startDate ? 'Seleccione una fecha fin válida.': 'Seleccione una fecha de inicial válida.';
      return this.empty_validate();
    } else {
      switch (this._filters.searchType) {
        case '1': // Nro de orden
          this._filters.paymentOrder = this._filters.searchText;
          if (this._filters.paymentOrder.trim() === '') {
            this._filters.paymentOrder = '0';
          }
          break;
        case '2': // nombre
          this._filters.document = this._filters.searchText;
          break;
        case '3': // ci
          this._filters.document = this._filters.searchText;
          break;
        /* case '4': // fecha
          console.log('this._filters.startDate :>> ', this._filters.startDate);
          console.log('this._filters.endDate :>> ', this._filters.endDate);
          this.empty_validate();
          break; */
      }
      return true;
    }
  }

  empty_validate() {
    if (this._filters.startDate === '') {
      this.MSG_HANDLE.NoData = 'Seleccione una fecha de inicial válida.';
      return false;
    }
    if (this._filters.endDate === '') {
      this.MSG_HANDLE.NoData = 'Seleccione una fecha fin válida.';
      return false;
    }
    return true;
  }

  sortMovements() {
    this.movements.sort(function compare(a, b) {
      if (a.pay_order_number > b.pay_order_number) {
        return -1;
      }
      if (a.pay_order_number < b.pay_order_number) {
        return 1;
      }
      return 0;
    });
  }

  changeStatusName() {
    this.movements.forEach((element) => {
      if (element.pay_order_state_id === 3) {
        element.pay_order_state_name = 'Anulada';
      }
    });
  }

  urlViewer_Dialog(payOrderNumber) {
    const myPayOrder = this.movements.find((obj) => {
      return obj.pay_order_number === payOrderNumber;
    });

    const obj: any = {};
    obj.payOrder = myPayOrder;
    obj.createdForm = false;
    const dialogRef = this.dialog.open(PayOrderCreatedComponent, {
      width: '450px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.QueryMovements();
    });
  }

  changeCompany() {
    this.movements = [];
    this.totalMovements = 0;
    this.MSG_HANDLE.NoData = '';
  }

  onChange(newValue: number) {
    this.datesAreSelected = newValue === 4;
    this._filters.document = '';
    this._filters.transactionNumber = '';
    this._filters.paymentOrder = '';
    this._filters.searchText = '';
  }

  cancelPayOrder_Dialog(payOrderNumber: number) {
    const obj: any = {};
    obj.data = payOrderNumber;
    const dialogRef = this.dialog.open(CancelPaymentComponent, {
      width: '600px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.QueryMovements();
      return;
    });
  }

  descriptionPayOrder_Dialog(payOrderNumber: number) {
    let myPayOrder: any;
    this.blockUI.start();
    this.payOrderService
      .getPayOrder(payOrderNumber)
      .toPromise()
      .then(
        (resp) => {
          myPayOrder = resp.data;
          if (myPayOrder.status.id === 3) {
            myPayOrder.status.name = 'Anulada';
          }
          this.displayPayOrder(myPayOrder);
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          console.log(error);
          this.toastService.error(
            'Ha ocurrido un error, contactese con el administrador'
          );
        }
      );
  }

  displayPayOrder(payOrder) {
    const obj: any = {};
    obj.data = payOrder;
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '650px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      return;
    });
  }

  nuevaOrdenPago() {
    this.router.navigate(['/backoffice/nueva-orden-pago']);
  }

  canCancel(stateId: number) {
    return stateId === 1; // Pendiente
  }
}
