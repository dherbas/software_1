import { General } from 'src/app/helper/general';
import { Component, OnInit } from '@angular/core';
import {
  Client,
  GenerateOrder,
  ItemSelected,
} from 'src/app/models/generate_Order';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage.service';
import { PayOrderService } from 'src/app/services/pay-order.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ResponseAPIMultipago } from 'src/app/models/ResponseAPI';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

import { RGeneratePO } from 'src/app/models/ResponseAPI/RGeneratePO';
import { ToastrService } from 'ngx-toastr';
import { Pay_Orders } from 'src/app/models/pay_Orders';
import { EnumCodigoRespuesta, EnumTypeItemPayOrder } from 'src/app/helper/enum';
import { NewItemComponent } from '../new-item/new-item.component';
import { Validador } from 'src/app/helper/validador';
import { PayOrderCreatedComponent } from '../pay-order-created/pay-order-created.component';
import { cmbService } from 'src/app/models/cmbService';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UsuarioExtraData } from '../../../models/UsuarioExtraData';

@Component({
  selector: 'app-pay-order-form',
  templateUrl: './pay-order-form.component.html',
  styleUrls: ['./pay-order-form.component.css'],
})
export class PayOrderFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  companies: cmbService[] = [];
  selectedCompany: string;
  _client: Client = new Client();
  _ListItemOrder: ItemSelected[] = [];
  _msgError: String = '';
  _validation: Validador = new Validador();
  typeItemSelected = 1;
  amount = 0;
  enumTypeItemPayOrder = EnumTypeItemPayOrder;
  _currency: string = '';
  HGeneral: General = new General();
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private storageService: StorageService,
    private payOrderService: PayOrderService,
    private usuario: UsuarioService,
    private toastr: ToastrService,
    private googleAnalytics: GoogleAnalyticsService
  ) {
    this.companies = storageService.getCurrentSession().user.list_code_service;
    this.selectedCompany =
      this.companies.length > 0 ? this.companies[0].code : '';
    this._currency = this.HGeneral.getCurrency(storageService);
  }

  ngOnInit(): void {}

  async newPayOrder() {
    if (!this.validaciones()) {
      return;
    }
    this.googleAnalytics.eventUrlMultipago('creacion_nueva_orden');

    const order: GenerateOrder = new GenerateOrder();

    order.service.code = this.selectedCompany; // this.storageService.getServiceSelected().code;

    if (this.typeItemSelected === this.enumTypeItemPayOrder.Amount) {
      this._ListItemOrder = [];
      const newItem = new ItemSelected();
      newItem.id = new Date().getTime();
      newItem.quantity = 1;
      newItem.description = 'Compra por MULTIPAGO';
      newItem.unitary_price = this.amount;
      this._ListItemOrder.push(newItem);
      order.payment_data.item_selecteds = this._ListItemOrder;
    } else if (
      this.typeItemSelected === this.enumTypeItemPayOrder.PurchaseItems
    ) {
      order.payment_data.item_selecteds = this._ListItemOrder;
    }

    order.client = this._client;
    if (order.client.ci === '') {
      order.client.ci = '0';
    }
    if (order.client.phone === '') {
      order.client.phone = '77777777';
    }
    if (order.client.email === '') {
      order.client.email = 'ordenesmanuales@multipago.com';
    }
    const user = this.storageService.getCurrentUser();
    if (typeof user.extra_data === 'string') {
      user.extra_data = JSON.parse(user.extra_data);
    } else if (user.extra_data == null) {
      user.extra_data = new UsuarioExtraData();
    }
    const multipagoURL = {
      user_account_login: user.username,
      transactional_login: user.extra_data.transactional_login,
      transactional_pass: user.extra_data.transactional_password
        ? user.extra_data.transactional_password
        : '',
    };
    order.payment_data.url_confirm = 'https://multipago.com/';
    order.payment_data.url_fail = 'https://multipago.com/';
    order.payment_data.button_label_ok = 'Aceptar';
    order.payment_data.user_account_id = user.id;
    order.payment_data.multipago_url = multipagoURL;
    order.payment_data.color = '';
    order.payment_data.font = '';

    this.blockUI.start();
    await this.payOrderService
      .createNewPayOrder(order)
      .toPromise()
      .then((res: ResponseAPIMultipago) => {
        console.log('res :>> ', res);
        this.blockUI.stop();
        if (res.status == EnumCodigoRespuesta.Correcto) {
          const respuesta: RGeneratePO = res.data;
          const myPayOrder: Pay_Orders =
            this.convertRespuestaToPayOrder(respuesta);
          this.payOrderCreated(myPayOrder);
        } else {
          this.toastr.error('Ha ocurrido un problema, intentelo mas tarde.');
        }
      })
      .catch((error) => {
        console.log(error);
        this.blockUI.stop();
        this.toastr.error('Ha ocurrido un problema, intentelo mas tarde.');
      });
  }

  convertRespuestaToPayOrder(respuesta: RGeneratePO): Pay_Orders {
    const myPayOrder: Pay_Orders = new Pay_Orders();
    myPayOrder.md5_pay_order_number = respuesta.pay_order.md5_pay_order_number;
    myPayOrder.client_first_name = respuesta.pay_order.client_name;
    myPayOrder.client_last_name = respuesta.pay_order.client_last_name;
    myPayOrder.client_ci = respuesta.pay_order.client_ci;
    myPayOrder.client_phone = respuesta.pay_order.client_phone;
    myPayOrder.client_email = respuesta.pay_order.client_email;
    myPayOrder.client_business_name = respuesta.pay_order.client_business_name;
    myPayOrder.client_nit = respuesta.pay_order.client_nit;
    myPayOrder.pay_official_number = respuesta.pay_order.pay_official_number;
    myPayOrder.total_amount = respuesta.pay_order.total_amount;
    myPayOrder.pay_order_url = respuesta.url_to_pay;
    return myPayOrder;
  }

  validaciones(): boolean {
    this._msgError = '';
    if (this._client.name.trim() === '') {
      this._msgError = 'Ingrese un nombre válido.';
      return false;
    }
    if (this._client.last_name.trim() === '') {
      this._msgError = 'Ingrese un apellido válido.';
      return false;
    }
    // if (this._client.ci.trim() === '') {
    //   this._msgError = 'Ingrese un ci válido.';
    //   return false;
    // }
    // if (this._client.phone.trim() === '') {
    //   this._msgError = 'Ingrese un teléfono/celular válido.';
    //   return false;
    // }
    //
    // const email = this._client.email.trim();
    // const hasError = !this._validation.ValidarCorreo(email);
    //
    // if (email === '' || hasError) {
    //   this._msgError = 'Ingrese un correo electrónico válido.';
    //   return false;
    // }

    if (this.typeItemSelected === this.enumTypeItemPayOrder.Amount) {
      console.log(this._ListItemOrder.length);
      if (this.amount <= 0) {
        this._msgError = 'Ingrese un monto válido.';
        return false;
      }
    } else if (
      this.typeItemSelected === this.enumTypeItemPayOrder.PurchaseItems
    ) {
      if (this._ListItemOrder.length === 0) {
        this._msgError = 'Debe de agregar al menos un item de compra.';
        return false;
      }
    }
    return true;
  }

  displayNewIem() {
    const obj: any = {};
    obj.data = 'url';
    const dialogRef = this.dialog.open(NewItemComponent, {
      width: '600px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const newItem: ItemSelected = result;
        newItem.id = new Date().getTime();
        this._ListItemOrder.push(newItem);
      }
      return;
    });
  }

  payOrderCreated(payOrder: Pay_Orders) {
    const obj: any = {};
    obj.payOrder = payOrder;
    obj.createdForm = true;
    const dialogRef = this.dialog.open(PayOrderCreatedComponent, {
      width: '450px',
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/backoffice/generacion-orden-pago']);
    });
  }

  displayModalRemove(id) {}

  removeElement(id) {
    this._ListItemOrder = this._ListItemOrder.filter(function (obj) {
      return obj.id !== id;
    });
  }

  cancel() {
    this.router.navigate(['/backoffice/generacion-orden-pago']);
  }
}
