export interface IUsuarioExtraData {
  transactional_login: string;
  transactional_password: string;
  pos_configuration: any[];
}

export class UsuarioExtraData implements IUsuarioExtraData {
  pos_configuration: any[];
  transactional_login: string;
  transactional_password: string;

  constructor() {
    this.transactional_login = '';
    this.transactional_password = '';
    this.pos_configuration = [
      {description: 'Dirección IP', value: '255.255.255.255'}
    ];
  }
}
