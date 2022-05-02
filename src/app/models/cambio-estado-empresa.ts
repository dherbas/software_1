import { EnumEstado } from 'src/app/helper/enum';


export interface ICambioEstadoEmpresa {
    id: number;
    visible: number;
  }

export class CambioEstadoEmpresa implements ICambioEstadoEmpresa {
    id = 0;
    visible: number = EnumEstado.Deshabilitado;

  constructor(id: number, visible: number) {
    this.id = id;
    this.visible = visible;
  }
}
