import {User} from './user';
import {VoucherPackage} from './voucher-package';
import {EnumEstado} from '../helper/enum';


export interface IVoucherPackageParent {
  id: number;
  status: number;
  user_account_to_id: number;
  user_account: User;
  voucher_packages: VoucherPackage[];
  voucher_company: string;
  total_amount: number;
  total_amount_used: number;
  service_code: string;
  company_name: string;
  contract_numbers: any[];
}

export class VoucherPackageParent implements IVoucherPackageParent {

  id: number;
  status: number;
  user_account_to_id: number;
  user_account: User;
  voucher_packages: VoucherPackage[];
  voucher_company: string;
  total_amount: number;
  total_amount_used: number;
  //MULTIEMPRESA
  service_code: string;
  company_name: string;
  contract_numbers: any[];

  constructor() {
    this.id = 0;
    this.status = EnumEstado.Habilitado;
    this.user_account_to_id = 0;
    this.user_account = new User();
    this.total_amount = 0;
    this.total_amount_used = 0;
    this.contract_numbers = [];
  }

  jsonToModel(vp: any) {
    this.id = vp.id;
    this.status = vp.status;
    this.service_code = vp.service_code;
    this.company_name = vp.company_name;
    this.user_account_to_id = vp.user_account_id;
    this.user_account.id = vp.user_account_id;
    this.user_account.username = vp.username;
    this.user_account.first_name = vp.first_name;
    this.user_account.last_name = vp.last_name;
    this.user_account.phone_number = vp.phone_number;
    this.user_account.email = vp.email;
    this.voucher_company = vp.voucher_company;
    this.total_amount = vp.total_amount;
    this.total_amount_used = vp.total_amount_used;
    this.contract_numbers = vp.contract_numbers;
    this.voucher_packages = [];
    vp.voucher_packages?.forEach(element => {
      const vp = new VoucherPackage();
      vp.jsonToModel(element);
      this.voucher_packages.push(vp);
    });
  }

  getStatus() {
    switch (this.status) {
      case EnumEstado.Habilitado:
        return 'Habilitado';
      case EnumEstado.Deshabilitado:
        return 'Deshabilitado';
    }
  }
}
