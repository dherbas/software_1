import { EnumEstado } from 'src/app/helper/enum';

export interface IResetearContrase├▒a {
  user_id: number;
}

export class ResetearContrase├▒a implements IResetearContrase├▒a {
  user_id = 0;

  constructor(user_id: number) {
    this.user_id = user_id;
  }
}
