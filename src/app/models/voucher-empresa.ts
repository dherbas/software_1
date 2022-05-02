import { EnumEstado } from '../helper/enum';
import { Service } from '../models/service';

const serv_id = new Service();
export interface IVoucherEmpresa {
  id: number;
  name: string;
  visible: number;
  service_id: number;
  service_code: string;
  company_name: string;
}

export class VoucherEmpresa implements IVoucherEmpresa {
  id: number = 0;
  name: string = '';
  visible: number = EnumEstado.Habilitado;
  service_id: number = serv_id.id;
  service_code: string = '';
  company_name: string = '';

  constructor();
  constructor(obj: IVoucherEmpresa);
  constructor(obj?: any) {
    if (obj == null) {
      this.ConstructorVacio();
    } else {
      this.ConstructorPorJson(obj);
    }
  }

  ConstructorVacio() {
    this.id = 0;
    this.name = '';
    this.visible = EnumEstado.Habilitado;
    this.service_id = serv_id.id;
  }

  ConstructorPorJson(obj: any) {
    this.id = obj.id;
    this.name = obj.username;
    this.visible = obj.visible;
    this.service_id = obj.service_id;
    this.service_code = obj.service_code;
    this.company_name = obj.company_name;
  }
}
