import { EnumEstado } from 'src/app/helper/enum';

export interface ICambioEstado {
  user_account_id: number;
  status: number;
}

export class CambioEstado implements ICambioEstado {
  user_account_id = 0;
  status: number = EnumEstado.Deshabilitado;

  constructor(user_account_id: number, status: number) {
    this.user_account_id = user_account_id;
    this.status = status;
  }
}
