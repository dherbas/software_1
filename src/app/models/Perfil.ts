import { Permiso } from './permiso';
import { PermisoLista } from './permiso-lista';
import { EnumEstado } from '../helper/enum';
import { Usuario } from './usuario';

export interface IPerfil {
  id: number;
  name: string;
  description: string;
  status: number;
  company_name: string;
  permissions?: Array<Permiso>;
  listaUsuarios?: Array<Usuario>;
  listaPermisos?: Array<PermisoLista>;
}

export class Perfil implements IPerfil {
  id = 0;
  name = '';
  description = '';
  status: number = EnumEstado.Habilitado;
  company_name = '';
  company_code = '';
  permissions?: Array<Permiso> = new Array<Permiso>();
  listaUsuarios?: Array<Usuario> = new Array<Usuario>();
  listaPermisos?: Array<PermisoLista> = new Array<PermisoLista>();
}
