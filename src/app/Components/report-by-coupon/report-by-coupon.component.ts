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
  selector: 'app-report-by-coupon',
  templateUrl: './report-by-coupon.component.html',
  styleUrls: ['./report-by-coupon.component.css']
})
export class ReportByCouponComponent implements OnInit {

  endDate: string;
  startDate: string;
  listData: any[];
  total_used: number = 0;
  total_unused: number = 0;
  total_expired: number = 0;
  total_nulled: number = 0;
  total_sale: number = 0;
  companies: cmbService[] = [];
  typeSearch = EnumTypeSearchReports.Vale;
  enumTypeSearchReports = EnumTypeSearchReports;
  selectedCompany: string;

  @BlockUI() blockUI: NgBlockUI;


  constructor(private service: ReportsService,
    private session: StorageService,
    private toastr: ToastrService) {
    var my_date = new Date();

    let first_date = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
    let last_date = new Date(my_date.getFullYear(), my_date.getMonth() + 1, 0);

    this.endDate = last_date.toISOString().split('T')[0];
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
    this.total_expired = 0;
    this.total_nulled = 0;
    this.total_unused = 0;
    this.total_used = 0;
    this.total_sale = 0;

    const model = {
      service_code: this.selectedCompany,
      end_date: this.endDate,
      start_date: this.startDate,
      type_search: this.typeSearch
    };
    this.service.getReportByCoupons(model).subscribe(
      (resp) => {

        const arrayData = resp.data;
        if (arrayData.length == 0) {

          this.toastr.error('No se encontraron datos.');
          this.blockUI.stop();
          return;
        }
        this.listData = arrayData.list_data;
        this.total_expired = arrayData.total_expired;
        this.total_nulled = arrayData.total_nulled;
        this.total_unused = arrayData.total_unused;
        this.total_used = arrayData.total_used;
        this.total_sale = arrayData.total_sale;

        this.blockUI.stop();

      },
      (error) => {
        this.blockUI.stop();
        console.log(error);
        this.toastr.error('Algo ha salido mal');
      }
    );
  }

  descargar() {
    this.blockUI.start();
    const filename = 'VentasxVale' + moment().format('DDMMYYYY');
    const model = {
      service_code: this.selectedCompany,
      end_date: this.endDate,
      start_date: this.startDate,
      type_search: this.typeSearch
    };
    this.service.getReportByCouponsExcel(model).subscribe(
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
