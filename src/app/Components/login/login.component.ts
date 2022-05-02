import {Component, OnInit} from '@angular/core';
import {UsuarioService} from 'src/app/services/usuario.service';
import {StorageService} from 'src/app/services/storage.service';
import {Router} from '@angular/router';
import {Session} from 'src/app/models/Session';
import {ToastrService} from 'ngx-toastr';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Tokens} from 'src/app/models/Tokens';
import {ResponseAPIMultipago} from 'src/app/models/ResponseAPI';
import {EnumCodigoRespuesta} from 'src/app/helper/enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  _UserName: string = '';
  _Password: string = '';
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private userService: UsuarioService,
    private storageService: StorageService,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  async Login() {
    this.blockUI.start();
    const responseToken = await this.userService.getTokenMultipago().toPromise();
    if (responseToken.status == EnumCodigoRespuesta.Correcto) {
      const tokenMultipago = responseToken.data.replace('Bearer ', '');
      const token: Tokens = {
        accessToken: '',
        refreshToken: '',
        multipagoCliente: tokenMultipago
      };
      const x: Session = {
        user: null,
        tokens: token,
        serviceSelected: null
      };
      this.storageService.setCurrentSession(x);
      await this.userService.Login(this._UserName, this._Password).toPromise().then((resp: ResponseAPIMultipago) => {
        console.log("response de login", resp);
        if (resp.status == EnumCodigoRespuesta.Correcto) {
          const session = this.storageService.getCurrentSession();
          session.user = resp.data;
          console.log('session: ', session);
          session.serviceSelected = session.user['list_code_service'][0];
          this.storageService.setCurrentSession(session);
          if (session.user.is_first_time) {
            this.router.navigate(['/password']);
          } else {
            this.router.navigate(['/backoffice']);
          }
        } else {
          this._Password = '';
          this._UserName = '';
          console.log('error login:>> ', resp.data);
          this.toastr.error(resp.data);
        }
        this.blockUI.stop();
      });
    } else {
      this._Password = '';
      this._UserName = '';
      this.blockUI.stop();
      console.log('error login:>> ', responseToken.data);
      if (responseToken.message == 'Usuario no habilitado') {
        this.toastr.error('Usuario no habilitado.');
      } else {
        this.toastr.error('Usuario y/o contraseña incorrectos.');
      }
    }
  }
}
