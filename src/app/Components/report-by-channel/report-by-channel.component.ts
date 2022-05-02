import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../services/storage.service';
import { Select2OptionData } from 'ng-select2';
import { User } from '../../models/user';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { ReportChannel } from '../../models/report-channel';
import { EnumCodigoRespuesta, EnumTypeSearchReports } from '../../helper/enum';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-report-by-channel',
  templateUrl: './report-by-channel.component.html',
  styleUrls: ['./report-by-channel.component.css'],
})
export class ReportByChannelComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  services: any[];
  serviceCodeData: Array<Select2OptionData>;
  form: FormGroup;
  user: User;
  data: ReportChannel[];
  enumTypeSearchReports = EnumTypeSearchReports;
  total: number;

  constructor(
    private session: StorageService,
    private service: ReportsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.data = [];
    this.serviceCodeData = [];
    this.user = this.session.getCurrentSession().user;
    this.user.list_code_service.forEach((item) => {
      this.serviceCodeData.push({ id: item.code, text: item.name });
    });
    this.total = 0;
    this.init();
  }

  private get StartDate() {
    return this.form.get('start_date');
  }

  private get EndDate() {
    return this.form.get('end_date');
  }

  init(): void {
    this.form = this.formBuilder.group({
      type_search: [
        EnumTypeSearchReports.Vale.toString(),
        [Validators.required],
      ],
      service_code: [
        this.serviceCodeData.length > 1 ? this.serviceCodeData[0].id : '',
      ],
      start_date: [moment().startOf('month').format('YYYY-MM-DD')],
      end_date: [moment().endOf('month').format('YYYY-MM-DD')],
    });
  }

  ngOnInit(): void {}

  reportByChannel() {
    this.blockUI.start();
    const serviceCode =
      this.user.list_code_service?.length > 1
        ? this.form.get('service_code').value
        : this.user.list_code_service[0]?.code;
    this.service
      .getReportByChannel(
        serviceCode,
        this.StartDate.value,
        this.EndDate.value,
        this.form.get('type_search').value
      )
      .subscribe(
        (resultado) => {
          this.data = [];
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            resultado.data.forEach((item) => {
              const itemCh = new ReportChannel();
              itemCh.jsonToModel(item);
              this.data.push(itemCh);
              this.total = this.data.reduce((x, t) => (x += +t.total), 0);
            });
          } else {
            this.toastr.error(resultado.message);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.toastr.error(error);
        }
      );
  }

  downloadXlsx(): void {
    const filename = 'Canal por producto -' + moment().format('DDMMYYYY');
    this.blockUI.start();
    const serviceCode =
      this.user.list_code_service?.length > 1
        ? this.form.get('service_code').value
        : this.user.list_code_service[0]?.code;

    this.service
      .getReportByChannelXlsx(
        serviceCode,
        this.StartDate.value,
        this.EndDate.value,
        this.form.get('type_search').value
      )
      .subscribe(
        (response) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
