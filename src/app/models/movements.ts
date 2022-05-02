export class Movements {
  pay_order_number: number;
  client_first_name: string;
  client_last_name: string;
  client_ci: string;
  client_phone: string;
  client_email: string;
  total_amount: string;
  transaction_number: string;
  transaction_date: string;
  pay_channels_name: string;
  pay_order_state_id: number;
  pay_order_state_literal: string;
  tickets_status: number;
  interchange_date: string;
  stage: string;
  username: string;
  type: string;
  channel_emission:number;

  public getPaymentState() {
    switch (this.pay_order_state_id) {
      case 1:
        this.pay_order_state_literal = 'Pendiente';
        break;
      case 2:
        this.pay_order_state_literal = 'Confirmada';
        break;
      case 3:
        this.pay_order_state_literal = 'Cancelada';
        break;
    }
  }
}
