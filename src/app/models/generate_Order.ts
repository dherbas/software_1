export class GenerateOrder {
  service: Service;
  payment_data: PaymentData;
  client: Client;

  constructor() {
    this.service = new Service();
    this.payment_data = new PaymentData();
    this.client = new Client();
  }
}

export class Client {
  name: string = '';
  last_name: string = '';
  ci: string = '';
  phone: string = '';
  email: string = '';
  business_name: string = '';
  nit: string = '';
  observation: string = '';
}

export class PaymentData {
  item_selecteds: ItemSelected[];
  payment_receiver: PaymentReceiver;
  url_confirm: String;
  button_label_ok: String;
  url_fail: String;
  user_account_id: number;
  multipago_url: any;
  //observation: String;
  color: String;
  font: String;

  constructor() {
    this.item_selecteds = [];
    this.payment_receiver = new PaymentReceiver();
    this.url_confirm = '';
    this.button_label_ok = '';
    this.url_fail = '';
    this.user_account_id = 0;
    this.multipago_url = null;
  }
}

export class ItemSelected {
  id: number = 0;
  unitary_price: number = 0;
  quantity: number = 0;
  description: string = '';
}

export class PaymentReceiver {
  id_local: string = '';
  name: string = '';
  ci: string = '';
  account_type: string = '';
  account_num: string = '';
  bank: string = '';
}

export class Service {
  code: string = '';
}
