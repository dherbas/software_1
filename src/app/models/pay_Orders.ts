// tslint:disable: variable-name
export class Pay_Orders {
  md5_pay_order_number: string;
  pay_order_number: number;
  pay_official_number: number;
  client_name: string;
  client_first_name: string;
  client_last_name: string;
  client_ci: string;
  client_phone: string;
  client_email: string;
  client_business_name: string;
  client_nit: string;
  client_observation: string;
  total_amount: number;
  original_total_amount: number;
  commission: string;
  total_to_pay: number;
  currency: Currency;
  number_transaction: string;
  date_transaction: string;
  payment_client_response: string;
  status: Status;
  payment_summary: string;
  pay_order_date: string;
  pay_order_details: PayOrderDetail[];
  pay_order_url: string;
  pay_order_created: string;
  pay_order_state_name: string;
  pay_order_state_id: number;
  created_by: string;
  pay_order_payments: string;
  pay_order_sources_id: number;
}

export interface Order {}

export interface Currency {
  symbol: string;
  e;
  literal: string;
  abbreviation: string;
}

export class PayOrderDetail {
  concept: string = '';
  unitary_amount: string = '';
  quantity: number = 0;
  total_amount: string = '';
  tickets: any[] = [];
  original_total_amount: string = '';
  original_unitary_amount: string = '';
}

export class Status {
  id: number = 1;
  name: string = '';
  summary: string = '';

  constructor() {
    this.id = 1;
    this.name = '';
    this.summary = '';
  }
}
