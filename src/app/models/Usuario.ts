import {Permiso} from './permiso';
import {Perfil} from './perfil';
import {PermisoLista} from './permiso-lista';
import {EnumEstado, EnumTypeUser} from 'src/app/helper/enum';
import {UsuarioExtraData} from "./UsuarioExtraData";

export interface IUsuario {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: number;
  send_email: boolean;
  list_profile?: Array<Perfil>;
  list_permission?: Array<Permiso>;
  type_id: string;
  ci: string;
  extra_data: UsuarioExtraData;
  transactional_login: string;
  maximum_daily_amount: number;
}

export class Usuario implements IUsuario {
  id: number = 0;
  username: string = '';
  password: string = '';
  first_name: string = '';
  last_name: string = '';
  email: string = '';
  phone_number: string = '';
  status: number = EnumEstado.Habilitado;
  send_email = false;
  type_id: string = EnumTypeUser.Multipago;

  list_code_service: string[] = [];
  list_profile?: Array<Perfil> = new Array<Perfil>();
  list_permission?: Array<Permiso> = new Array<Permiso>();
  company_name = '';
  permissions: Array<PermisoLista> = new Array<PermisoLista>();
  codigo: string = '';
  voucher_company_name = '';
  voucher_company_id = 0;
  profile: string =
    this.list_profile.length > 0 ? this.list_profile[0].name : '';
  ci: string;
  extra_data: UsuarioExtraData;
  transactional_login: string;
  maximum_daily_amount: number = 0;

  constructor();
  constructor(obj: IUsuario);
  constructor(obj?: any) {
    if (obj == null) {
      this.ConstructorVacio();
    } else {
      this.ConstructorPorJson(obj);
    }
  }

  ConstructorVacio() {
    this.id = 0;
    this.username = '';
    this.password = '';
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.status = EnumEstado.Habilitado;
    this.type_id = EnumTypeUser.Multipago;

    this.send_email = false;
    this.codigo = '';
    this.list_code_service = [];
    this.list_profile = new Array<Perfil>();
    this.list_permission = new Array<Permiso>();
    this.company_name = '';
    this.permissions = new Array<PermisoLista>();

    this.profile =
      this.list_profile.length > 0 ? this.list_profile[0].name : '';
    this.ci = '';
    this.extra_data = new UsuarioExtraData();
    this.transactional_login = '';
    this.maximum_daily_amount = 0;
  }

  ConstructorPorJson(obj: any) {
    this.id = obj.id;
    this.username = obj.username;
    this.password = obj.password;
    this.first_name = obj.first_name;
    this.last_name = obj.last_name;
    this.email = obj.email;
    this.status = obj.status;
    this.send_email = obj.send_email;
    this.codigo = obj.codigo;
    this.phone_number = obj.phone;
    this.list_code_service = obj.list_code_service;
    this.list_profile = obj.list_profile;
    this.list_permission = obj.listaPermiso;
    this.company_name = obj.company_name = '';
    this.profile =
      this.list_profile != undefined && this.list_profile.length > 0
        ? this.list_profile[0].name
        : '';
    this.type_id = obj.type_id;
    this.ci = obj.ci;
    this.extra_data = obj.extra_data.length > 0 ? JSON.parse(obj.extra_data) : new UsuarioExtraData();
    this.transactional_login = this.extra_data?.transactional_login;
    this.maximum_daily_amount = obj.maximum_daily_amount;
  }
}
