export interface ITransactionDetailed {
  pay_order_transaction: string;
  service: string;
  service_description: string;
  disclaimer: string;
  pay_channel_code: string;
  place: string;
  pay_order_state: string;
  movement: string;
  type: string;
  pay_order_transaction_date: Date;
  pay_order_created_at: Date;
  client_ci: string;
  company_nit: string;
  authorization_number: string;
  invoice_number: string;
  quantity: number;
  concept: string;
  note: string;
  unitary_amount: number;
  total_amount: number;
  currency: string;
  channel: string;
}


export class TransactionDetailed implements ITransactionDetailed {
  authorization_number: string;
  company_nit: string;
  client_ci: string;
  concept: string;
  currency: string;
  disclaimer: string;
  pay_channel_code: string;
  invoice_number: string;
  movement: string;
  note: string;
  pay_order_state: string;
  pay_order_transaction: string;
  pay_order_transaction_date: Date;
  pay_order_created_at: Date;
  place: string;
  quantity: number;
  service: string;
  service_description: string;
  total_amount: number;
  type: string;
  unitary_amount: number;
  channel: string;
}
