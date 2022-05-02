import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { General } from 'src/app/helper/general';
import { Pay_Orders } from 'src/app/models/pay_Orders';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EnumCardTransaction,
  EnumCodeRedEnlace,
  EnumCodigoRespuesta,
  EnumPayChannel,
} from '../../../helper/enum';
import { PayOrderService } from '../../../services/pay-order.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-pay-order-created',
  templateUrl: './pay-order-created.component.html',
  styleUrls: ['./pay-order-created.component.css'],
})
export class PayOrderCreatedComponent implements OnInit {
  @BlockUI('paymentProcess') blockUIContainer!: NgBlockUI;
  isSend = false;
  paymentResult = false;
  PaymentURL = 1;
  PayOrderRightNow = 2;
  enumPayChannel = EnumPayChannel;
  enumCardTransaction = EnumCardTransaction;
  form: FormGroup;
  PAY_ORDER: Pay_Orders = new Pay_Orders();
  createdForm = false;
  formSubmitted = false;
  errorMessage = '';
  URL_WHATSAPP = '';
  title = '';
  description = '';
  descriptionTag = '';
  imageSRC = '';
  imageSize = 70;
  processingError = false;
  forwardBCPQr = false;
  defaultMessage =
    'En este momento no se pudo procesar la solicitud, intentelo mas tarde.';
  HGeneral: General = new General();

  constructor(
    public dialogoRef: MatDialogRef<PayOrderCreatedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public orderService: PayOrderService,
    private session: StorageService
  ) {
    this.blockUIContainer.reset();
    this.form = this.formBuilder.group({
      type: [this.PaymentURL.toString(), [Validators.required]],
      payChannel: ['', [Validators.required]],
      cardType: [''],
    });
    this.PayChannel.valueChanges.subscribe(() => {
      this.errorMessage = '';
      this.isSend = false;
      this.paymentResult = false;
      this.CardType.setValue('');
      if (this.PayChannel.value == this.enumPayChannel.PayTarjetaPOS) {
        this.CardType.setValidators([Validators.required]);
      } else {
        this.CardType.setValidators(null);
      }
    });
    this.CardType.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get Type(): any {
    return this.form.get('type');
  }

  get PayChannel(): any {
    return this.form.get('payChannel');
  }

  get CardType(): any {
    return this.form.get('cardType');
  }

  ngOnInit(): void {
    this.PAY_ORDER = this.data.payOrder;
    this.createdForm = this.data.createdForm;
    this.URL_WHATSAPP = this.HGeneral.generateWhatsappLink(this.PAY_ORDER);
  }

  cerrar() {
    this.dialogoRef.close();
  }

  copyMessage() {
    this.HGeneral.copyMessage(this.PAY_ORDER.pay_order_url);
    this.toastr.success('URL copiada correctamente.');
  }

  dispose() {
    this.dialogoRef.close();
  }

  payment() {
    this.formSubmitted = true;
    if (this.form.valid) {
      this.imageSRC = '';
      this.description = '';
      this.descriptionTag = '';
      const payChannel = this.PayChannel.value;
      this.getPayChannelTitle();
      this.isSend = true;

      switch (payChannel) {
        case this.enumPayChannel.Presencial:
          this.payBank().then(() => {
            this.paymentResult = true;
          });
          break;
        case this.enumPayChannel.PayTarjetaPOS:
          this.payCardPOS().then(() => {
            this.paymentResult = true;
          });
          break;
        case this.enumPayChannel.PayTigoMoney:
          this.payTigoMoney().then(() => {
            this.paymentResult = true;
          });
          break;
        case this.enumPayChannel.PayQR:
          this.payQRCode().then(() => {
            this.paymentResult = true;
          });

          break;
      }
    } else {
      this.errorMessage = this.getErrorMessage();
    }
  }

  getErrorMessage(): string {
    this.errorMessage = '';
    if (this.PayChannel.invalid && this.PayChannel.errors.required) {
      return 'Debe seleccionar un método de pago.';
    }
    if (this.CardType.invalid && this.CardType.errors.required) {
      return 'Debe seleccionar un tipo de pago.';
    }
  }

  async payTigoMoney() {
    this.imageSize = 70;
    this.blockUIContainer.start('Generando y enviando código');
    await this.orderService
      .paymentTigoMoney(this.PAY_ORDER)
      .toPromise()
      .then((result) => {
        this.blockUIContainer.stop();
        this.paymentResult = true;
        if (result.status === EnumCodigoRespuesta.Correcto) {
          this.orderService
            .updatePayOrderSource(this.PAY_ORDER.md5_pay_order_number)
            .toPromise();
          this.imageSRC = `./assets/slices/img_correcto.png`;
          this.description =
            'La notificación de pago fué enviado con éxito al número ';
          this.descriptionTag = this.PAY_ORDER.client_phone;
        } else {
          this.processingError = true;
          this.imageSRC = `./assets/slices/img_error.png`;
          this.description =
            result.message?.length > 0 ? result.message : this.defaultMessage;
        }
      })
      .catch((error) => {
        this.processingError = true;
        this.description = error.error.message;
        this.imageSRC = `./assets/slices/img_error.png`;
        this.blockUIContainer.stop();
      });
  }

  async payQRCode() {
    this.forwardBCPQr = false;
    this.blockUIContainer.start('Generando código QR');
    await this.orderService
      .paymentQRCode(this.PAY_ORDER)
      .toPromise()
      .then((result) => {
        this.blockUIContainer.stop();
        this.paymentResult = true;
        if (result.status === EnumCodigoRespuesta.Correcto) {
          this.title = 'QR GENERADO Y ENVIADO';
          this.orderService
            .getQRImageByMD5(this.PAY_ORDER.md5_pay_order_number)
            .toPromise()
            .then((qrImageResult) => {
              if (qrImageResult.status === EnumCodigoRespuesta.Correcto) {
                this.imageSize = 100;
                this.imageSRC = qrImageResult.data;
              }
            });
          this.description = 'El código QR fué enviado con éxito al correo ';
          this.descriptionTag = this.PAY_ORDER.client_email;
          this.forwardBCPQr = true;
        } else {
          this.processingError = true;
          this.imageSize = 70;
          this.imageSRC = `./assets/slices/img_error.png`;
          this.description =
            result.message?.length > 0 ? result.message : this.defaultMessage;
        }
      })
      .catch((error) => {
        this.processingError = true;
        this.imageSize = 70;
        this.imageSRC = `./assets/slices/img_error.png`;
        this.description = error.message;
        this.blockUIContainer.stop();
      });
  }

  getPayChannelTitle(): void {
    this.title = 'PAGO CON ';
    switch (this.PayChannel.value) {
      case this.enumPayChannel.Presencial:
        this.title += 'EFECTIVO';
        break;
      case this.enumPayChannel.PayTarjetaPOS:
        this.title += 'TARJETA DÉBITO/CRÉDITO';
        break;
      case this.enumPayChannel.PayTigoMoney:
        this.title += 'TIGO MONEY';
        break;
      case this.enumPayChannel.PayQR:
        this.title += 'QR SIMPLE';
        break;
    }
  }

  retry(): void {
    this.forwardBCPQr = false;
    this.processingError = false;
    this.payment();
  }

  async forwardBCPQrEmail() {
    this.forwardBCPQr = false;
    this.blockUIContainer.start('Reenviando al correo');
    await this.orderService
      .forwardBCPQrReservation(this.PAY_ORDER.md5_pay_order_number)
      .toPromise()
      .then((qrResult) => {
        this.paymentResult = true;
        if (qrResult.status === EnumCodigoRespuesta.Correcto) {
          this.description = 'El código QR fué enviado con éxito al correo ';
          this.descriptionTag = this.PAY_ORDER.client_email;
          this.forwardBCPQr = true;
        } else {
          this.processingError = true;
          this.imageSRC = `./assets/slices/img_error.png`;
          this.description = qrResult.message;
        }
        this.blockUIContainer.stop();
      })
      .catch((error) => {
        this.processingError = true;
        this.imageSRC = `./assets/slices/img_error.png`;
        this.description = error.message;
        this.blockUIContainer.stop();
      });
  }

  async payCardPOS() {
    this.imageSize = 70;
    this.blockUIContainer.start('En espera de proceso de pago');
    const user = this.session.getCurrentUser();
    const IP = user.extra_data.pos_configuration[0].value;
    await this.orderService
      .saleTransaction(this.PAY_ORDER, this.CardType.value, IP)
      .toPromise()
      .then((result: any) => {
        this.blockUIContainer.stop();
        this.paymentResult = true;
        if (Number(result.codRespuesta) === EnumCodeRedEnlace.OK) {
          this.orderService
            .paymentWithPOSCard(this.PAY_ORDER)
            .toPromise()
            .then((resultPayment) => {
              this.imageSRC = `./assets/slices/img_correcto.png`;
              this.description =
                resultPayment.data.payment_client_response +
                ' La notificación de pago fué enviado con éxito al correo ';
              this.descriptionTag = this.PAY_ORDER.client_email;
            });
        } else {
          this.processingError = true;
          this.imageSRC = `./assets/slices/img_error.png`;
          this.description =
            result.msgError?.length > 0 ? result.msgError : this.defaultMessage;
        }
      })
      .catch((error) => {
        this.processingError = true;
        this.description = error.error.message;
        this.imageSRC = `./assets/slices/img_error.png`;
        this.blockUIContainer.stop();
      });
  }

  async payBank() {
    this.imageSize = 70;
    this.blockUIContainer.start('En espera de proceso de pago');
    await this.orderService
      .createReservation(this.PAY_ORDER.md5_pay_order_number)
      .toPromise()
      .then((result) => {
        this.paymentResult = true;
        if (result.status === EnumCodigoRespuesta.Correcto) {
          this.orderService
            .paymentBank(this.PAY_ORDER)
            .toPromise()
            .then((bankResult) => {
              if (bankResult.status === EnumCodigoRespuesta.Correcto) {
                this.imageSRC = `./assets/slices/img_correcto.png`;
                this.description = bankResult.data.message;
                this.descriptionTag = this.PAY_ORDER.client_email;
              }
              this.blockUIContainer.stop();
            });
        } else {
          this.processingError = true;
          this.imageSize = 70;
          this.imageSRC = `./assets/slices/img_error.png`;
          this.description =
            result.message?.length > 0 ? result.message : this.defaultMessage;
        }
      })
      .catch((error) => {
        this.processingError = true;
        this.imageSize = 70;
        this.imageSRC = `./assets/slices/img_error.png`;
        this.description = error.message;
        this.blockUIContainer.stop();
      });
  }
}
