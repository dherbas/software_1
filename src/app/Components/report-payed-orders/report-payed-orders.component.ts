import { Component, OnInit } from '@angular/core';
import { PayOrderReports } from 'src/app/models/pay_orders_reports';
import { StorageService } from 'src/app/services/storage.service';
import { General } from 'src/app/helper/general';
import { MessageHandler } from 'src/app/models/messageHandler';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from 'src/app/services/reports.service';

import { EnumCodigoRespuesta } from 'src/app/helper/enum';
import { cmbService } from 'src/app/models/cmbService';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-report-payed-orders',
  templateUrl: './report-payed-orders.component.html',
  styleUrls: ['./report-payed-orders.component.css'],
})
export class ReportPayedOrdersComponent implements OnInit {
  @BlockUI()
  blockUI: NgBlockUI;
  transactions: PayOrderReports[] = [];
  startDate = '';
  endDate = '';
  totalTransactions = 0;
  MSG_HANDLE: MessageHandler = new MessageHandler();

  companies: cmbService[] = [];
  selectedCompany: string;
  _currency: string = '';

  constructor(
    private service: ReportsService,
    private session: StorageService,
    private toastr: ToastrService,
    private storageService: StorageService
  ) {
    this.totalTransactions = 0;
    this.transactions = [];
    this.endDate = new Date().toISOString().split('T')[0];
    this.startDate = new Date().toISOString().split('T')[0];

    this.companies = session.getCurrentSession().user.list_code_service;
    this.selectedCompany =
      this.companies.length > 0 ? this.companies[0].code : '';
    this._currency = this.HGeneral.getCurrency(this.storageService);
  }

  HGeneral: General = new General();
  ngOnInit(): void {}

  getTransactionReport() {
    this.MSG_HANDLE.Error = '';
    if (this.isValid() === false) {
      return;
    }
    this.blockUI.start();
    const model = {
      code_service: this.selectedCompany,
      start_date: this.HGeneral.getDateFormat(this.startDate),
      end_date: this.HGeneral.getDateFormat(this.endDate),
    };

    this.service.getpayordersbyservicereport(model).subscribe(
      (resp) => {
        // tslint:disable-next-line: triple-equals
        if (resp.status != EnumCodigoRespuesta.Correcto) {
          this.MSG_HANDLE.Error = resp.message;
          return;
        }
        const payOrderStr = 'pay_orders_items';
        this.transactions = resp.data[payOrderStr];
        console.log('this.transactions :>> ', this.transactions);
        this.totalTransactions = this.transactions.length;
        if (this.totalTransactions === 0) {
          this.MSG_HANDLE.NoData =
            'No se encontraron resultados para su criterio de búsqueda.';
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error(
          'Ha ocurrido un error contactarse con el administrador'
        );
      }
    );
  }
  changeCompany() {
    this.transactions = [];
    this.totalTransactions = 0;
    this.MSG_HANDLE.NoData = '';
  }
  isValid(): boolean {
    if (this.startDate === '') {
      this.MSG_HANDLE.Error = 'Ingrese una fecha inicial válida';
      return false;
    }
    if (this.endDate === '') {
      this.MSG_HANDLE.Error = 'Ingrese una fecha final válida';
      return false;
    }
    return true;
  }
  downloadExcelFile() {
    this.MSG_HANDLE.Error = '';
    if (this.isValid() === false) {
      return;
    }
    this.blockUI.start();
    const model = {
      code_service: this.session.getServiceSelected().code,
      start_date: this.HGeneral.getDateFormat(this.startDate),
      end_date: this.HGeneral.getDateFormat(this.endDate),
    };

    this.service.getpayordersbyserviceExcel(model).subscribe(
      (response: any) => {
        const filename = 'ordenes_generadas.xlsx';
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(blob, filename + '.xlsx');
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error(
          'Ha ocurrido un error contactarse con el administrador'
        );
      }
    );
  }
}
