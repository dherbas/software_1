import {EnumVoucherStatus} from '../helper/enum';

export interface IDiscountVoucher {
  id: number;
  ci: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  amount: number;
  status: number;
  voucher_packages_id: number;
  assigned_date: Date;
  updated_at: Date;
  start_date: Date;
  end_date: Date;
  reason_cancel: string;
  used_date: Date;

  contract_number: string;
  company_code: string;
  description: string;
  sub_total: number;
  extra_data: string;
}

export class DiscountVoucher implements IDiscountVoucher {
  id = 0;
  ci = '';
  first_name = '';
  last_name = '';
  phone_number = '';
  email = '';
  amount = 0;
  status = 0;
  voucher_packages_id = 0;
  assigned_date: Date = new Date();
  updated_at: Date = new Date();
  start_date: Date = new Date();
  end_date: Date = new Date();
  reason_cancel = '';
  used_date: Date = new Date();

  contract_number = '';
  company_code = '';
  description = '';
  sub_total = 0;
  extra_data: string;

  jsonToModel(dv: any) {
    this.id = dv.id;
    this.ci = dv.ci;
    this.first_name = dv.first_name;
    this.last_name = dv.last_name;
    this.phone_number = dv.phone_number;
    this.email = dv.email;
    this.amount = dv.amount;
    this.status = dv.status;
    this.assigned_date = dv.assigned_date;
    this.updated_at = dv.updated_at;
    this.start_date = dv.start_date;
    this.end_date = dv.end_date;
    this.extra_data = dv.extra_data;
  }

  jsonToModelBusness(dv: any) {
    this.contract_number = dv.contract_number;
    this.company_code = dv.company_code;
    this.description = dv.description;
    this.sub_total = dv.sub_total;
    this.extra_data = dv.extra_data;
  }

  getStatus() {
    switch (this.status) {
      case EnumVoucherStatus.NoUsed:
        return 'No usado';
      case EnumVoucherStatus.Used:
        return 'Usada';
      case EnumVoucherStatus.Canceled:
        return 'Cancelado';
      default:
        return '';
    }
  }

  getFullName() {
    return this.first_name + ' ' + this.last_name;
  }


}
