import { Component, OnInit } from '@angular/core';
import { Pay_Orders, Status } from 'src/app/models/pay_Orders';
// import { MovementsService } from 'src/app/services/movements.service';
import { StorageService } from 'src/app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { PayOrderService } from 'src/app/services/pay-order.service';

import { Filter } from 'src/app/models/filter';
import { filtersMovement } from 'src/app/models/filtersMovement';
import { General } from 'src/app/helper/general';
// import { UrlViewerComponent } from '../url-viewer/url-viewer.component';
// import { CancelPaymentComponent } from '../cancel-payment/cancel-payment.component';
// import { DetailsComponent } from '../details/details.component';
import { MessageHandler } from 'src/app/models/messageHandler';
import { EnumEstado } from 'src/app/helper/enum';
import { cmbService } from 'src/app/models/cmbService';
import { ToastrService } from 'ngx-toastr';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { DetailsComponent } from '../../payment-generator/details/details.component';
import { CancelPaymentComponent } from '../../payment-generator/cancel-payment/cancel-payment.component';
import { cmbUserAccount } from 'src/app/models/user_account';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-payments-on-delivery-index',
  templateUrl: './payments-on-delivery-index.component.html',
  styleUrls: ['./payments-on-delivery-index.component.css']
})
export class PaymentsOnDeliveryIndexComponent implements OnInit {

    @BlockUI()
    blockUI: NgBlockUI;
  
    _filters: filtersMovement;
    datesAreSelected: boolean;
    searchInput: boolean;
    searchCombo: boolean;
    movements: Pay_Orders[] = [];
    totalMovements: number;
    HGeneral: General = new General();
    MSG_HANDLE: MessageHandler = new MessageHandler();
    enumEstado: EnumEstado;
    companies: cmbService[] = [];
    selectedCompany: string;
    list_delivery: cmbUserAccount[] = [];
  
    public cards:Array<any> = []; //aqui
  
    constructor(
      //CREAR UN ARRAY Y CONSULTAR LA LISTA DE COBRADORES Y AGREGARSELO AL COBO
      private sessionService: StorageService,
      private dialog: MatDialog,
      private router: Router,
      private payOrderService: PayOrderService,
      private toastService: ToastrService
    ) {
      this._filters = new filtersMovement();
      this.datesAreSelected = false;
      this.searchInput = true;
      this.searchCombo = false;
      
      this.totalMovements = 0;
  
      this.companies = sessionService.getCurrentSession().user.list_code_service;
      this.selectedCompany = this.companies.length > 0 ? this.companies[0].code : '';
      }
  
    ngOnInit(): void {
      this.StarEndDate();
      this.QueryDelivery();
      this.cards = [ //aqui
        {
          title:"Video 1",
          type:"success"
        },
        {
          title:"Video 2",
          type:"danger"
        },
        {
          title:"Video 3",
          type:"info"
        }            
      ]    
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
  
    QueryDelivery() {
      this.blockUI.start();
      this.payOrderService
        .getDeliveryFilter(this.selectedCompany)
        .subscribe(
          (resp) => {
            this.list_delivery = resp.data['user_accounts'];            
            this.blockUI.stop();
          },
          (error) => {
            this.toastService.error(
              'Ha ocurrido un error contactarse con el administrador'
            );
          }
        );
    }

    QueryMovements() {
      this.MSG_HANDLE.Error = '';
      if (this.isValid() === false) {
        return;
      }
      this.blockUI.start();
      this.payOrderService
        .getPaymentsOnDeliveryFilter(this._filters, this.selectedCompany)
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
          case '4': // por cobrador
            this._filters.document = this._filters.searchUserApp;
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

      if (this._filters.searchType == '4' && this._filters.searchUserApp == '') {
        this.MSG_HANDLE.NoData = 'Seleccione un cobrador.';
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
  
    // urlViewer_Dialog(payOrderNumber) {
    //   const myPayOrder = this.movements.find((obj) => {
    //     return obj.pay_order_number === payOrderNumber;
    //   });
  
    //   const obj: any = {};
    //   obj.payOrder = myPayOrder;
    //   const dialogRef = this.dialog.open(UrlViewerComponent, {
    //     width: '600px',
    //     data: obj,
    //   });
  
    //   dialogRef.afterClosed().subscribe((result) => {
    //     return;
    //   });
    // }
    changeCompany() {
      this.movements = [];
      this.totalMovements = 0;
      this.MSG_HANDLE.NoData = '';
    }
    onChange(newValue: number) {
      if (newValue === 5) {
        this.datesAreSelected = true;
      } else {
        this.datesAreSelected = false;
      }

      if (newValue == 4) {
        this.searchCombo = true;
        this.searchInput = false;
    } else {
        this.searchCombo = false;
        this.searchInput = true;
    }

      this._filters.document = '';
      this._filters.transactionNumber = '';
      this._filters.paymentOrder = '';
      this._filters.searchText = '';
      this._filters.searchUserApp = '';
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
      this.payOrderService.getPayOrder(payOrderNumber).subscribe(
        (resp) => {
          myPayOrder = resp.data;
          if (myPayOrder.status.id === 3) {
            myPayOrder.status.name = 'Anulada';
          }
          this.displayPayOrder(myPayOrder);
        },
        (error) => {
          console.log(error);
          this.toastService.error(
            'Ha ocurrido un error, contactese con el administrador'
          );
        }
      );
    }
  
    displayPayOrder(payOrder) {//ACA ESTABA COMENTADA TODA LA FUNCIOM
      const obj: any = {};
      obj.data = payOrder;
      console.log('displayPayOrder pay order ', obj);
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
  
    public getPaymentState(element) {
      switch (element.pay_order_state_id) {
        case 1:
          element.pay_order_state_literal = 'Pendiente';
          break;
        case 2:
          element.pay_order_state_literal = 'Confirmada';
          break;
        case 3:
          element.pay_order_state_literal = 'Anulada';
          break;
      }
    }
  
    private getPayChannel(element) {
      switch (element.pay_order_state_id) {
        case 1:
          element.pay_channel_literal = 'Punto fisico';
          break;
        case 2:
          element.pay_channel_literal = 'Tigo Money';
          break;
        case 7:
          element.pay_channel_literal = 'Transferencia QR';
          break;
        case 3:
          element.pay_channel_literal = 'Tarjeta de debito/credito QR';
          break;
      }
    }
    canCancel(stateId: number) {
      return stateId === 1; // Pendiente
    }

    downloadExcelFile() {
      this.MSG_HANDLE.Error = '';
      if (this.isValid() === false) {
        return;
      }
      this.blockUI.start();
      
      const model = {
        code_service: this.selectedCompany,
        state: this._filters.state.toString(),
        type_search: this._filters.searchType,
        document: this._filters.document,
        pay_order_number: this._filters.paymentOrder,
        start_date: this.HGeneral.getDateFormat(this._filters.startDate),
        end_date: this.HGeneral.getDateFormat(this._filters.endDate)
      };

      this.payOrderService.getPaymentsOnDeliveryFilterExcel(model).subscribe(
        (response: any) => {
          const filename = 'ordenes_generadas.xlsx';
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          FileSaver.saveAs(blob, filename + '.xlsx');
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

    customCompany() {
      if (this.selectedCompany=='YANBAL_COLLECTIONS' || this.selectedCompany=='YAMBAL_S3rV') {
        return true;
      }else{
        return false;
      }
    }    
}
