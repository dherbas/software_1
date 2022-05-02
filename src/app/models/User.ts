import { Permission } from './pPermission';
import { cmbService } from './cmbService';
import { VoucherEmpresa } from './voucher-empresa';
import { UsuarioExtraData } from './UsuarioExtraData';

export interface IUser {
  id: number;
  company_name: string;
  username: string;
  password: string;
  code: string;
  list_code_service: cmbService[];
  first_name: string;
  last_name: string;
  email: string;
  is_first_time: boolean;
  need_delivery: boolean;
  consume_services: boolean;
  list_permissions: Permission[];
  service_selected: cmbService;
  phone_number: string;
  voucher_company_id: number;
  voucher_company: VoucherEmpresa;
  type_code: string;
  status: number;
  extra_data: UsuarioExtraData;
}

export class User implements IUser {
  id: number;
  company_name: string;
  username: string;
  password: string;
  code: string;
  list_code_service: cmbService[];
  first_name: string;
  last_name: string;
  email: string;
  is_first_time: boolean;
  need_delivery: boolean;
  consume_services: boolean;
  list_permissions: Permission[];
  service_selected: cmbService;
  phone_number: string;
  voucher_company_id: number;
  voucher_company: VoucherEmpresa;
  type_code: string;
  status: number;
  extra_data: UsuarioExtraData;
}
