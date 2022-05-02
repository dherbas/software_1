// tslint:disable: variable-name
export class PayOrderReports {
  pay_order_number = 0;
  client_first_name = '';
  client_last_name = '';
  client_ci = '';
  client_phone = '';
  client_email = '';
  currency = '';
  total_amount = '';
  transaction_number = '';
  pay_order_transaction_date = '';
  pay_channel_id: number;
  pay_channel_name = '';
  pay_order_state_id: number;
  pay_order_state_name = '';
  pay_order_created = '';
  created_by: string;
  constructor() {}
}
