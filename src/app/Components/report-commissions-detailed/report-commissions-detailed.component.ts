import { ReportCommissionsDetailedService } from './../../services/report-commissions-detailed.service';
import { EnumTypeUser } from './../../helper/enum';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { TransactionDetailed } from 'src/app/models/transaction-detailed';
import { EnumCodigoRespuesta } from 'src/app/helper/enum';
import { Paginador } from 'src/app/helper/paginador';
import { StorageService } from 'src/app/services/storage.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ReportPayOrderQR } from 'src/app/models/report-payorder-qr';
import { ReportPayOrderQRService } from 'src/app/services/report-payorder-qr.service';
import * as FileSaver from 'file-saver';
import { IReportCommissionsDetailed } from 'src/app/models/report-comissions-detailed';

@Component({
  selector: 'app-report-commissions-detailed',
  templateUrl: './report-commissions-detailed.component.html',
  styleUrls: ['./report-commissions-detailed.component.css'],
})
export class ReportCommissionsDetailedComponent implements OnInit {
  @BlockUI()
  blockUI: NgBlockUI;

  form: FormGroup;
  services: any[];
  serviceData: Array<Select2OptionData>;
  transactions: IReportCommissionsDetailed[];

  pagination: Paginador;

  constructor(
    private session: StorageService,
    private reportCommissionsDetailed: ReportCommissionsDetailedService,
    private transactionsService: TransactionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.init();
    this.getPayOrderForReportCommissions();
  }

  ngOnInit(): void {}

  init() {
    const userType = this.session.getCurrentUser().type_code;
    let serviceId;
    if (
      userType == EnumTypeUser.Gerencia ||
      userType == EnumTypeUser.Contabilidad
    ) {
      serviceId = 0;
      this.transactionsService
        .getServices()
        .toPromise()
        .then((response) => {
          if (response.status == EnumCodigoRespuesta.Correcto) {
            this.serviceData = [];
            this.serviceData.push({ id: '0', text: 'Todos' });
            this.services = response.data;
            this.services.forEach((item) => {
              this.serviceData.push({ id: item.id, text: item.name });
            });
          }
        });
    } else {
      const usuarioSession = this.session.getCurrentUser();
      this.serviceData = [];
      usuarioSession.list_code_service.forEach((element) => {
        this.serviceData.push({
          id: element.id + '',
          text: element.name,
        });
      });
      serviceId = this.serviceData[0].id;
    }
    this.pagination = new Paginador();
    this.form = this.formBuilder.group({
      service_id: [serviceId + ''],

      start_date: [moment().startOf('month').format('YYYY-MM-DD')],
      end_date: [moment().endOf('month').format('YYYY-MM-DD')],
    });
  }

  getPayOrderForReportCommissions() {
    this.blockUI.start();
    this.reportCommissionsDetailed
      .getPayOrderForReportCommissions(
        // this.form.get('service_id').value,
        moment(this.form.get('start_date').value).format('YYYY-MM-DD'),
        moment(this.form.get('end_date').value).format('YYYY-MM-DD')
      )
      .subscribe(
        (resultado) => {
          this.transactions = [];
          console.log('resultado.data :>> ', resultado.data);
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.transactions = resultado.data;
          } else {
            this.toastr.error(resultado.message);
          }
          this.blockUI.stop();
        },
        (error) => {
          console.log('error consulta :>> ', error);
          this.blockUI.stop();
          this.toastr.error(error);
        }
      );
  }

  downloadXlsx() {
    const filename =
      'Reporte de comisiones generadas -' + moment().format('DDMMYYYY');
    this.blockUI.start();
    this.reportCommissionsDetailed
      .getPayOrderForReportCommissionsReport(
        // this.form.get('service_id').value,
        moment(this.form.get('start_date').value).format('YYYY-MM-DD'),
        moment(this.form.get('end_date').value).format('YYYY-MM-DD')
      )
      .subscribe(
        (response) => {
          const blob = new Blob([response], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          FileSaver.saveAs(blob, filename + '.xlsx');
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.toastr.error(error);
        }
      );
  }
}
