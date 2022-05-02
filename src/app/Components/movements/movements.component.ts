import {Component, OnInit} from '@angular/core';
import {Movements} from 'src/app/models/movements';
import {MovementsService} from 'src/app/services/movements.service';
import {StorageService} from 'src/app/services/storage.service';
import {ToastrService} from 'ngx-toastr';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Observable} from 'rxjs';
import {cmbService} from 'src/app/models/cmbService';
import {MessageHandler} from 'src/app/models/messageHandler';
import {EnumCodigoRespuesta} from '../../helper/enum';
import * as FileSaver from 'file-saver';
import * as moment from "moment";

export class filtersMovement {
  ammount: number;
  code: string;
  paymentChannel: number;
  document: string;
  startDate: string;
  endDate: string;
  transaction_date: string;
  state: number;
  searchText: string;
  searchType: string;
  paymentOrder: string;
  transactionNumber: string;
  status: number;
  companies: cmbService[];
  selectedCompany: string;

  constructor() {
    this.ammount = 0;
    this.code = '';
    this.paymentChannel = 0;
    this.searchType = '0';
    this.state = 0;
    this.searchText = '';
    this.document = '0';
    this.startDate = '0';
    this.endDate = '0';
    this.transaction_date = '';
    this.paymentOrder = '0';
    this.transactionNumber = '0';
    this.status = 5;
    this.companies = [];
    this.selectedCompany = '';
  }
}

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css'],
})
export class MovementsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  _filters: filtersMovement;
  movements: Observable<Movements>[];
  totalMovements: number;
  p: number = 1;
  total: number;
  MSG_HANDLE: MessageHandler = new MessageHandler();

  constructor(
    private service: MovementsService,
    private sessionService: StorageService,
    private toastr: ToastrService
  ) {
    this._filters = new filtersMovement();
    this.totalMovements = 0;
    var my_date = new Date();

    let first_date = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
    let last_date = new Date(my_date.getFullYear(), my_date.getMonth() + 1, 0);

    this._filters.endDate = last_date.toISOString().split('T')[0];
    this._filters.startDate = first_date.toISOString().split('T')[0];

    this._filters.companies = sessionService.getCurrentSession().user.list_code_service;
    this._filters.selectedCompany =
      this._filters.companies.length > 0 ? this._filters.companies[0].code : '';
  }

  ngOnInit(): void {
  }

  QueryMovements() {
    this.blockUI.start();
    if (this.Cmb() == false) {
      return;
    }
    var date1 = new Date(this._filters.startDate);
    var date2 = new Date(this._filters.endDate);
    if (date1 > date2) {
      this.blockUI.stop();
      this.toastr.error(
        'La fecha final no puede ser mayor a la fecha de inicio'
      );
      return;
    }
    console.log('FILTROS MOVIMIENTOS >>', this._filters);
    this._filters.code = this._filters.selectedCompany;
    console.log('Code selected >> ', this._filters.code);
    this.service.getMovements(this._filters).subscribe(
      (resp) => {
        console.log('Respuesta >> ', resp);
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          console.log('data: ', resp.data);
          console.log('resp >> ', resp);

          this.movements = resp.data;
          this.total = this.movements.length;
          this.movements.forEach((element) => {
            this.getPaymentState(element);
          });
          this.totalMovements = this.movements.length;
          if (this.totalMovements == 0) {
            this.toastr.error('No se encontraron transacciones');
          }
        } else {
          this.toastr.error(resp.message);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.blockUI.stop();
        this.toastr.error('Ha ocurrido un problema, intentelo mas tarde');
      }
    );
  }

  onChange(newValue) {
    this._filters.document = '';
    this._filters.transactionNumber = '';
    this._filters.paymentOrder = '';
    this._filters.searchText = '';
    this._filters.transaction_date = '';
  }

  descargar() {
    this.blockUI.start();
    const filename = 'Movimientos' + moment().format('DDMMYYYY');
    this.service.getMovementsExcel(this._filters)
      .subscribe((response) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          FileSaver.saveAs(blob, filename + '.xlsx');
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          console.log(error);
        }
      );
  }

  Cmb(): boolean {
    if (this.empty_validate() == false) {
      return this.empty_validate();
    } else {
      switch (this._filters.searchType) {
        case '0': // ci
          this._filters.document = this._filters.searchText;
          if (this._filters.document.trim() === '') {
            this._filters.document = '0';
          }
          break;
        case '1': // Nro de orden
          this._filters.paymentOrder = this._filters.searchText;
          if (this._filters.paymentOrder.trim() === '') {
            this._filters.paymentOrder = '0';
          }
          break;
        case '2': // Nro de transaccion
          this._filters.transactionNumber = this._filters.searchText;
          if (this._filters.transactionNumber.trim() === '') {
            this._filters.transactionNumber = '0';
          }
          break;
        case '3': // Fecha de pago
          this._filters.transaction_date = this._filters.searchText;
          if (this._filters.transaction_date.trim() === '') {
            this._filters.transaction_date = '';
          }
          break;
      }
      console.log('Tipo de busqueda : >> ', this._filters.searchType);
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

  public getPaymentState(element) {
    switch (element.pay_order_state_id) {
      case 1:
        element.pay_order_state_literal = 'Pendiente';
        break;
      case 2:
        element.pay_order_state_literal = 'Confirmada';
        break;
      case 3:
        element.pay_order_state_literal = 'Cancelada';
        break;
      default:
        element.pay_order_state_id = 'Cancelada';
        break;
    }
  }

  private getTodaysDateFormated() {
    return new Date()
      .toISOString()
      .split('T')[0]
      .replace('-', '')
      .replace('-', '');
  }
}
