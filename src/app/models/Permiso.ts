// import { Usuario } from './usuario';
import { Perfil } from './perfil';

export interface IPermiso {
  id: number;
  name: string;
  router_link: string;
  parent_id: number;
  position: number;
  check: boolean;
  icon: string;
  permissions?: any[];
  list_profile?: Perfil[];
  // listaUsuario?: Array<Usuario>;
}

export class Permiso implements IPermiso {
  id: number;
  name: string;
  router_link: string;
  parent_id: number;
  position: number;
  icon: string;
  permissions?: Permiso[];
  list_profile?: Perfil[];
  check: boolean = false;
  // listaUsuario?: Array<Usuario> = new Array<Usuario>();
}
