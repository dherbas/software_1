import { Permiso } from './permiso';

export interface IPermisoLista {
  id: number;
  name: string;
  pantalla: string;
  padreId: number;
  orden: number;
  check: boolean;

  permissions?: Array<Permiso>;
}

export class PermisoLista implements IPermisoLista {
  id: number = 0;
  name: string = '';
  pantalla: string = '';
  padreId: number = 0;
  orden: number = 0;
  check: boolean = false;
  isCollapsed: boolean = false; // lo ocupo para el diseño del menu

  permissions?: Array<Permiso> = new Array<Permiso>();
}
