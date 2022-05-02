import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from 'src/app/models/Session';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Tokens } from 'src/app/models/Tokens';
import { ResponseAPIMultipago } from 'src/app/models/ResponseAPI';
import { EnumCodigoRespuesta } from 'src/app/helper/enum';

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
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    console.log('Called Constructor');
    this.route.queryParams.subscribe((params) => {
      let code = params['code'];
    });
  }

  ngOnInit(): void {}
  async Login() {
    this.blockUI.start();

    if (this._UserName == 'amy' && this._Password == 'amy') {
      let tmpSession =
        '{"user":{"list_code_service":[{"id":368,"name":"SOFTWARE 1","code":"BATA","currency":"Bs"}],"id":3,"list_permissions":[{"id":3,"name":"Reunión","position":5,"parent_id":null,"router_link":"#configuraciones","icon":"","permissions":[{"id":4,"name":"Perfiles","position":1,"parent_id":"3","router_link":"/backoffice/perfil","icon":"fa-stream"},{"id":5,"name":"Usuarios","position":2,"parent_id":"3","router_link":"/backoffice/usuario","icon":"fa-users"},{"id":2,"name":"Crear reunión","position":3,"parent_id":"3","router_link":"/backoffice/crear_reunion","icon":"fa-cog"}],"role_id":471}],"is_first_time":0,"username":"bata","password":"02a436de4b89a8efacce8816736a45e5","first_name":"Amy","last_name":"Quiroga","type_code":"MULTIPAGO","status":1,"need_delivery":false,"consume_services":false,"ci":null,"extra_data":null},"tokens":{"accessToken":"","refreshToken":"","multipagoCliente":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM5ZTA3NDY0NDFmM2QyYjA0ZTA3ZGY5MTQ1Y2IzODFhOWExNjQ5ODIyMGQ3MGQwM2UwMzViMzg2MjViNWY3MzAzNTQ3YTY4YjgwZGU0OTJmIn0.eyJhdWQiOiIxMyIsImp0aSI6IjM5ZTA3NDY0NDFmM2QyYjA0ZTA3ZGY5MTQ1Y2IzODFhOWExNjQ5ODIyMGQ3MGQwM2UwMzViMzg2MjViNWY3MzAzNTQ3YTY4YjgwZGU0OTJmIiwiaWF0IjoxNjQ0NDQ1MTMwLCJuYmYiOjE2NDQ0NDUxMzAsImV4cCI6MTY3NTk4MTEzMCwic3ViIjoiNDAyIiwic2NvcGVzIjpbXX0.HoRHrEehMrbqUrIZ5ymX8q5m2L-q9uH1tNQSyA4Ktog0Bcebk2VTv_9XHY6t-v2_iNgHLzbbeYiFn0l94pJw1nwJdYKCn3ayYTQkz8UHJpnoZZaNkb4IqpurJryjBKGGFo33iCZ15GjC2FJLcmay06Qni4HyK6SRZszJAvPBc-vj1HPtQGGRG_7kMfYGL6IJEseP_TmVVkdmfZJmYpb_v2uxdPtmjwjZnx9yp_CkjMOQt_sLPv1YJf8vJOJwlQxMHbGjP-TfEq9-J3LIo1YV8DKoK69k0e6DlLAljskh-0Jit0WNOD5fF2iiPENmhESP1cvjBjJcAzx0kV_2k7snttBhz6en5HRftmPed4_kUB5p84GW7CbsSH_LcPs7PufPEhPZjzd8m5xk8TplC9zklDPGAH1V7ZZTkdgpgBh_0WkicxJk-o2-Rr4kgfz7etGTA5rKBBVIeDtEmo64RmuWkyVTkb2pRFdBGMLk-JPklXUK6pcUiIL0sqSBjBIm3TGAvh3eYjyHacYdu_g9BoVVsUdMbZCGPFwDsmQekOCfNxMdcMG7eIf1n3g2zpAojKrnq41ggjkv4JTZiGCqFVdhNCQOjKY4hxp-HlEiXszgHD73ZETlODd1U6fnIbRlczEo3_bu08rooTwcQSS3yt1iw_XDkY29qtCLLEf0GauM7x4"},"serviceSelected":{"id":368,"name":"","code":"BATA","currency":"Bs"}}';
      let session: Session = JSON.parse(tmpSession) as Session;
      this.storageService.setCurrentSession(session);
      this.router.navigate(['/backoffice']);
    } else {
      this._Password = '';
      this._UserName = '';
      this.blockUI.stop();
      this.toastr.error('Usuario y/o contraseña incorrectos.');
    }
  }
}
