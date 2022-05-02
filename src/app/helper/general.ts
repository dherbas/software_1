import { StorageService } from './../services/storage.service';
import { PayOrder } from '../models/ResponseAPI/RGeneratePO';
import { Pay_Orders } from '../models/pay_Orders';
import { EnumServiceCurrency } from './enum';

export class General {
  private URL_WHATSAPP: string = '';

  constructor() {
    this.URL_WHATSAPP = '';
  }
  generateWhatsappLink(PAY_ORDER: Pay_Orders): string {
    this.URL_WHATSAPP =
      'https://api.whatsapp.com/send?phone=591' +
      PAY_ORDER.client_phone +
      '&text=' +
      'Se ha generado una orden de compra a nombre de ' +
      PAY_ORDER.client_first_name +
      ' ' +
      PAY_ORDER.client_last_name +
      ' con monto de ' +
      PAY_ORDER.total_amount +
      'Bs., para realizar el pago ingrese al siguiente link : ' +
      PAY_ORDER.pay_order_url;
    return this.URL_WHATSAPP;
  }

  copyMessage(url: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  setDateFormat(
    myDateString: string,
    dividerDateTime: string,
    dividerDate: string
  ): Date {
    const divider = myDateString.split(dividerDateTime);
    const onlyDate = divider[0];
    const arrayDate = onlyDate.split(dividerDate);
    const day = +arrayDate[0];
    const month = +arrayDate[1] - 1;
    const year = +arrayDate[2];
    const newDate = new Date(year, month, day);
    return newDate;
  }

  convertToDate(myDateString: string): Date {
    let dateString = '1968-11-16T00:00:00';
    let newDate = new Date(myDateString);
    return newDate;
  }

  getDateFormat(myDate): string {
    const parts = myDate.split('-');
    const mydate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    const auxDate: number = +mydate.getMonth() + 1;
    const newDateStr =
      ('0' + mydate.getDate()).slice(-2) +
      '/' +
      ('0' + auxDate).slice(-2) +
      '/' +
      mydate.getFullYear();
    return newDateStr;
  }

  changeToNumberFormat(value: any) {
    const option = { style: 'currency', currency: 'USD' };
    const formatterDolar = new Intl.NumberFormat('en-US', option);
    let number = value.target.value; // this._item.unitary_price.toString();
    number = Number.isNaN(number) ? 0 : formatterDolar.format(Number(number));
    value.target.value = number.replace('$', '');
  }

  getCurrency(storageService: StorageService) {
    let tmpCurrency =
      storageService.getCurrentSession().serviceSelected.currency ==
      EnumServiceCurrency.Dolar
        ? 'USD'
        : 'Bs.';
    console.log('tmpCurrency :>> ', tmpCurrency);
    return tmpCurrency;
  }
}
