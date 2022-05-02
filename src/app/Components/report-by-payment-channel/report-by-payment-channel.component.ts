import {Component, OnInit} from "@angular/core";
import {ReportsService} from "src/app/services/reports.service";
import {StorageService} from "src/app/services/storage.service";
import {ToastrService} from "ngx-toastr";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {cmbService} from "src/app/models/cmbService";
import {EnumTypeSearchReports} from "../../helper/enum";
import * as FileSaver from "file-saver";
import * as moment from "moment";

@Component({
  selector: 'app-report-by-payment-channel',
  templateUrl: './report-by-payment-channel.component.html',
  styleUrls: ['./report-by-payment-channel.component.css']
})
export class ReportByPaymentChannelComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  endDate: string;
  startDate: string;
  listData: any[];
  total_coupons = 0;
  total_card = 0;
  total_tigo = 0;
  total_qr = 0;
  total_physical = 0;
  total_cybersource = 0;
  total_voucher = 0;
  companies: cmbService[] = [];
  typeSearch = EnumTypeSearchReports.Vale;
  enumTypeSearchReports = EnumTypeSearchReports;
  selectedCompany: string;

  constructor(
    private service: ReportsService,
    private session: StorageService,
    private toastr: ToastrService) {
    var my_date = new Date();

    let first_date = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
    let last_date = new Date(my_date.getFullYear(), my_date.getMonth() + 1, 0);

    this.endDate =last_date.toISOString().split('T')[0];
    this.startDate = first_date.toISOString().split('T')[0];
    this.listData = [];

    this.companies = session.getCurrentSession().user.list_code_service;
    this.selectedCompany = this.companies.length > 0 ? this.companies[0].code : '';
  }

  ngOnInit(): void {
  }

  obtenerCupones() {
    this.blockUI.start();
    this.listData = [];
    this.total_coupons = 0;
    this.total_card = 0;
    this.total_tigo = 0;
    this.total_physical = 0;
    this.total_qr = 0;
    this.total_cybersource = 0;
    this.total_voucher = 0;
    const model = {
      service_code: this.selectedCompany,
      end_date: this.endDate,
      start_date: this.startDate,
      type_search: this.typeSearch
    };

    this.service.getReportByPaymentChannel(model).subscribe(
      (resp) => {
        var arrayData = resp.data;
        console.log('data:', arrayData);

        if (arrayData.length == 0) {

          this.toastr.error('No se encontraron datos.');
          this.blockUI.stop();
          return;
        }
        this.listData = arrayData.list_data;
        this.total_coupons = arrayData.total_coupons;
        this.total_card = arrayData.total_card;
        this.total_tigo = arrayData.total_tigo;
        this.total_physical = arrayData.total_physical;
        this.total_qr = arrayData.total_qr;
        this.total_cybersource = arrayData.total_cybersource;
        this.total_voucher = arrayData.total_voucher;
        this.blockUI.stop();
      },
      (error) => {
        console.log(error);
        this.blockUI.stop();
        this.toastr.error('Algo ha salido mal');
      }
    );
  }

  descargar() {
    this.blockUI.start();
    const filename = 'VentasxCanal' + moment().format('DDMMYYYY');
    const model = {
      service_code: this.selectedCompany,
      end_date: this.endDate,
      start_date: this.startDate,
      type_search: this.typeSearch
    };
    this.service.getReportByPaymentChannelExcel(model).subscribe(
      (response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        FileSaver.saveAs(blob, filename + '.xlsx');
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        console.log(error);
      });
  }

}

