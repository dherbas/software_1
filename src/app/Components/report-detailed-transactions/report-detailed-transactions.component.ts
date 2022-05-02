import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageService} from 'src/app/services/storage.service';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {EnumCodigoRespuesta, EnumTransactionStatus} from '../../helper/enum';
import * as moment from 'moment';
import {TransactionService} from '../../services/transaction.service';
import {TransactionDetailed} from '../../models/transaction-detailed';
import {Select2OptionData} from 'ng-select2';
import * as FileSaver from 'file-saver';
import {User} from '../../models/User';
import {PaginationInstance} from 'ngx-pagination';

@Component({
  selector: 'app-report-detailed-transactions',
  templateUrl: './report-detailed-transactions.component.html',
  styleUrls: ['./report-detailed-transactions.component.css']
})
export class ReportDetailedTransactionsComponent implements OnInit {
  @BlockUI()
  blockUI: NgBlockUI;

  form: FormGroup;
  services: any[];
  serviceData: Array<Select2OptionData>;
  serviceCodeData: Array<Select2OptionData>;
  transactions: TransactionDetailed[];
  user: User;
  searched: boolean;
  enumTransactionStatus = EnumTransactionStatus;
  totalAmountBs: number;
  totalAmountSus: number;
  p = 1;
  isAdministrator = true;
  config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(
    private session: StorageService,
    private transactionsService: TransactionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sessionService: StorageService
  ) {
    this.serviceCodeData = [];
    this.transactions = [];
    this.user = this.sessionService.getCurrentSession().user;
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
      this.transactions = [];
      this.getServices();
    });
    this.EndDate.valueChanges.subscribe(value => {
      this.searched = false;
      this.transactions = [];
      this.getServices();
    });
  }

  getServices(): void {
    this.blockUI.start();
    this.transactionsService.getServicesByDateRange(this.StartDate.value, this.EndDate.value, 0).toPromise().then(response => {
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

  init() {
    this.form = this.formBuilder.group({
      service_id: ['0'],
      service_code: [this.serviceCodeData.length > 1 ? this.serviceCodeData[0].id : ''],
      status: [this.enumTransactionStatus.Todos.toString(), [Validators.required]],
      start_date: [moment().startOf('month').format('YYYY-MM-DD'), {updateOn: 'blur'}],
      end_date: [moment().endOf('month').format('YYYY-MM-DD'), {updateOn: 'blur'}],
      search: ['']
    });
    this.isAdministrator = this.sessionService.isAdministratorUser();
    if (this.isAdministrator) {
      this.getServices();
      this.getDetailedTransactions();
    }else{
      this.searched = true;
      this.getDetailedTransactions();
    }
      
  }

  getDetailedTransactions() {
    const serviceCode = this.user.list_code_service?.length > 1 ? this.form.get('service_code').value : this.user.list_code_service[0]?.code;
    const serviceId = this.isAdministrator ? this.form.get('service_id').value : serviceCode;
    this.blockUI.start();
    this.transactionsService.getDetailedTransactions(
      serviceId, this.form.get('status').value,
      this.StartDate.value, this.EndDate.value, this.form.get('search').value, this.isAdministrator)
      .subscribe((resultado) => {
          this.transactions = [];
          if (resultado.status == EnumCodigoRespuesta.Correcto) {
            this.transactions = resultado.data;
            this.totalAmountBs = this.transactions
              .filter((x: TransactionDetailed) => x.currency === 'Bs')
              .reduce((x, t) => x += (+t.total_amount), 0);
            this.totalAmountSus = this.transactions
              .filter((x: TransactionDetailed) => x.currency === '$us')
              .reduce((x, t) => x += (+t.total_amount), 0);
            this.searched = true;
          } else {
            this.toastr.error(resultado.message);
          }
          this.p = 1;
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.toastr.error(error);
        }
      );
  }

  downloadXlsx() {
    const filename = 'Transacciones' + moment().format('DDMMYYYY');
    const serviceCode = this.user.list_code_service?.length > 1 ? this.form.get('service_code').value : this.user.list_code_service[0]?.code;
    const serviceId = this.isAdministrator ? this.form.get('service_id').value : serviceCode;
    this.blockUI.start();
    this.transactionsService.downloadDetailedTransactionsXlsx(
      serviceId, this.form.get('status').value,
      this.StartDate.value, this.EndDate.value, this.form.get('search').value, this.isAdministrator)
      .subscribe((response) => {
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

}
