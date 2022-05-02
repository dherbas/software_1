export interface IReportCommissionsDetailed {
  id: number;
  service_name: string;
  service_code: string;
  pay_channel_name: string;
  pay_channel_code: string;
  pay_order_state: string;
  pay_order_transaction_date: null;
  currency: string;
  original_currency: string;
  total_amount: string;
  original_total_amount: string;
  exchange_rate: null;
  user: string;
  client_code: string;
  pay_order_number: number;
  client_first_name: string;
  client_last_name: string;

  client_ci: string;
  commission: number;
  commission_amount: number;
  residue: number;
  commission_pay_channel: number;

  transaction_number: number;
}
