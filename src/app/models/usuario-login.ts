export interface IUsuarioLogin {
  login: string;
  contrasena: string;
}

export class UsuarioLogin implements IUsuarioLogin {
  login = '';
  contrasena = '';

  obtenerUsuarioDatec() {
    this.login = 'disoft2018';
    this.contrasena = 'Disoft2018';
  }
}
