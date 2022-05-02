import { EnumEstado } from 'src/app/helper/enum';

export interface ICambioEstado {
  id: number;
  status: number;
}

export class CambioEstadoProfile implements ICambioEstado {
  id = 0;
  status: number = EnumEstado.Deshabilitado;

  constructor(id: number, status: number) {
    this.id = id;
    this.status = status;
  }
}
