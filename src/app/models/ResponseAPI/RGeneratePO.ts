export interface RGeneratePO {
  pay_order: PayOrder;
  url_to_pay: string;
}

export interface PayOrder {
  md5_pay_order_number: string;
  pay_order_number: number;
  pay_official_number: number;
  client_name: string;
  client_last_name: string;
  client_ci: string;
  client_phone: string;
  client_email: string;
  client_business_name: string;
  client_nit: string;
  client_observation: string;
  total_amount: number;
  commission: number;
  total_to_pay: number;
  currency: Currency;
  number_transaction: string;
  date_transaction: string;
  payment_client_response: string;
  status: Status;
  payment_summary: string;
  pay_order_date: string;
  pay_order_details: PayOrderDetail[];
}

export interface Currency {
  symbol: string;
  literal: string;
  abbreviation: string;
}

export interface PayOrderDetail {
  concept: string;
  unitary_amount: string;
  quantity: number;
  total_amount: string;
  tickets: any[];
}

export interface Status {
  id: number;
  name: string;
  summary: string;
}
