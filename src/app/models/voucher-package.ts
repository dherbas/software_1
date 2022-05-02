import {VoucherPackageParent} from './voucher-package-parent';
import {EnumEstado} from '../helper/enum';
import {DiscountVoucher} from './discount_voucher';

export interface IVoucherPackage {
  id: number;
  id_temporary: number;

  description: string;
  amount: number;
  amount_used: number;
  start_date: Date;
  expiration_date: Date;
  created_at: Date;
  status: number;
  voucher_package_parent_id: number;
  voucher_package_parent: VoucherPackageParent;
  discount_vouchers: DiscountVoucher[];
  company_name: string;
  can_create_voucher: boolean;
  extra_data: string;
}

export class VoucherPackage implements IVoucherPackage {
  id: number;
  id_temporary: number;

  description: string;
  amount: number;
  amount_used: number;
  start_date: Date;
  expiration_date: Date;
  created_at: Date;
  status: number;
  voucher_package_parent_id: number;
  voucher_package_parent: VoucherPackageParent;
  discount_vouchers: DiscountVoucher[];
  company_name = '';
  can_create_voucher: boolean;
  extra_data: string;

  constructor() {
    this.id = 0;
    this.id_temporary = 0;
    this.description = '';
    this.expiration_date = new Date();
    this.amount = 0;
    this.amount_used = 0;
    this.status = EnumEstado.Habilitado;
    this.voucher_package_parent_id = 0;
    this.can_create_voucher = false;
    this.extra_data = '';
  }

  jsonToModel(vp: any) {
    this.id = vp.id;
    this.description = vp.description;
    this.created_at = vp.created_at;
    this.start_date = vp.start_date;
    this.expiration_date = vp.expiration_date;
    this.amount = vp.amount;
    this.amount_used = vp.amount_used;
    this.status = vp.status;
    this.extra_data = vp.extra_data;
    this.discount_vouchers = [];
    vp.discount_vouchers?.forEach(element => {
      const dv = new DiscountVoucher();
      dv.jsonToModel(element);
      this.discount_vouchers.push(dv);
    });
  }

  getStatus(): string {
    return this.status == EnumEstado.Habilitado
      ? 'Habilitado'
      : 'Deshabilitado';
  }

  getContractNumber(): string {
    console.log(this.extra_data);
    if (this.extra_data.length > 0) {
      const extraData = JSON.parse(this.extra_data);
      return extraData.nboe.toString();
    }
    return '';
  }
}
