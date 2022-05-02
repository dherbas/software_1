import { EnumEstado } from 'src/app/helper/enum';

export interface IResetearContraseña {
  user_id: number;
}

export class ResetearContraseña implements IResetearContraseña {
  user_id = 0;

  constructor(user_id: number) {
    this.user_id = user_id;
  }
}
