import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {TransactionService} from '../../services/transaction.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {EnumCodigoRespuesta, EnumPayOrderChannel, EnumTransactionStatus} from '../../helper/enum';
import * as FileSaver from 'file-saver';
import {Select2OptionData} from 'ng-select2';
import {User} from 'src/app/models/user';
import {CommissionParent} from '../../models/transaction-commission';

@Component({
  selector: 'app-report-comissions-transactions',
  templateUrl: './report-comissions-transactions.component.html',
  styleUrls: ['./report-comissions-transactions.component.css']
})


export class ReportComissionsTransactionsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  services: any[];
  serviceData: Array<Select2OptionData>;
  serviceCodeData: Array<Select2OptionData>;
  comissionsParent: CommissionParent[];
  user: User;
  searched: boolean;
  enumTransactionStatus = EnumTransactionStatus;
  enumPayOrderChannel = EnumPayOrderChannel;
  isAdministrator = true;

  constructor(
    private session: StorageService,
    private transactionsService: TransactionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.serviceCodeData = [];
    this.user = this.session.getCurrentSession().user;
    this.user.list_code_service.forEach((item) => {
      this.serviceCodeData.push({id: item.code, text: item.name});
    });
    this.init();
  }

  get StartDate() {
    return this.form.get('start_date');
  }

  get EndDate() {
    return this.form.get('end_date');
  }

  ngOnInit(): void {
    this.StartDate.valueChanges.subscribe(value => {
      this.searched = false;
      this.comissionsParent = [];
      this.getServices();
    });
    this.EndDate.valueChanges.subscribe(value => {
      this.searched = false;
      this.comissionsParent = [];
      this.getServices();
    });
  }

  getServices(): void {
    this.blockUI.start();
    this.transactionsService.getServicesByDateRange(this.StartDate.value, this.EndDate.value, EnumTransactionStatus.Confirmado)
      .toPromise().then(response => {
      if (response.status == EnumCodigoRespuesta.Correcto) {
        this.services = response.data;
        this.serviceData = [];
        this.serviceData.push({id: '0', text: 'Todos'});
        this.services.forEach((item) => {
          this.serviceData.push({id: item.id, text: item.name});
        });
        this.blockUI.stop();
      }
    });
  }

  init(): void {
    this.form = this.formBuilder.group({
      start_date: [moment().startOf('month').format('YYYY-MM-DD'), {updateOn: 'blur'}],
      end_date: [moment().endOf('month').format('YYYY-MM-DD'), {updateOn: 'blur'}],
      service_id: ['0'],
      service_code: [this.serviceCodeData.length > 1 ? this.serviceCodeData[0].id : ''],
      payment_type_id: ['0'],
    });
    this.isAdministrator = this.session.isAdministratorUser();
    if (this.isAdministrator) {
      this.getServices();
      this.getComissionsTransactions();
    }
    else{
      this.searched = true;
      this.getComissionsTransactions();
    }
  }

  getComissionsTransactions() {
    this.blockUI.start();
    const serviceCode = this.user.list_code_service?.length > 1 ? this.form.get('service_code').value : this.user.list_code_service[0]?.code;
    const serviceId = this.isAdministrator ? this.form.get('service_id').value : serviceCode;
    this.transactionsService.getComissionsTransactions(this.StartDate.value, this.EndDate.value,
      serviceId, this.form.get('payment_type_id').value, this.isAdministrator)
      .subscribe((resultado) => {
          this.comissionsParent = [];
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            resultado.data.forEach((item) => {
              const itemParent = new CommissionParent();
              itemParent.jsonToModel(item);
              this.comissionsParent.push(itemParent);
            });

            this.searched = true;
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

  downloadXlsx() {
    const filename = 'Comisiones' + moment().format('DDMMYYYY');
    const serviceCode = this.user.list_code_service?.length > 1 ? this.form.get('service_code').value : this.user.list_code_service[0]?.code;
    const serviceId = this.isAdministrator ? this.form.get('service_id').value : serviceCode;

    this.blockUI.start();
    this.transactionsService.downloadComissionsTransactionsXlsx(
      this.StartDate.value, this.EndDate.value, serviceId, this.form.get('payment_type_id').value, this.isAdministrator).subscribe((response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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

  getPayChannelName(payChannelId) {
    return this.transactionsService.getPayChannelName(payChannelId);
  }

}
