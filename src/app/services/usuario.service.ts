import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {Response} from '@angular/http';
import {HttpClient, HttpHeaders, HttpParams,} from '@angular/common/http';

import {catchError, map} from 'rxjs/operators';

import {environment} from 'src/environments/environment';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {ResponseAPI, ResponseAPIMultipago} from '../models/ResponseAPI';
import {CambioEstado} from '../models/cambio-estado';
import {ErrorServicio} from '../helper/error-servicio';
import {Usuario} from '../models/usuario';
import {ResetearContraseña} from '../models/resetearcontraseña';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  LoginURL: string = environment.apiUrl + 'login/';
  UsuarioURL: string = environment.urlServicio + 'external_services/';
  ResetPassword: string = environment.urlServicio + 'external_services/';
  public Password: string;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  get isLoggedIn(): Observable<boolean> {
    const x: boolean = this.storageService.isAuthenticated();
    this.loggedIn.next(x);
    return this.loggedIn.asObservable(); // {2}
  }

  Login(user: string, password: string): Observable<ResponseAPIMultipago> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    // this.storageService.getCurrentToken();
    const param = JSON.stringify({
      user,
      password,
    });

    return this.http
      .post<ResponseAPIMultipago>(this.UsuarioURL + 'login', param, {headers})
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  getTokenMultipago(): Observable<ResponseAPIMultipago> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.storageService.getCurrentToken();
    const param = JSON.stringify({
      // username,
      // password,
      provider: 'urlvalidator',
      uid: 'b22f410c0fbed19fc192f61588dce523',
    });

    return this.http
      .post<ResponseAPIMultipago>(environment.urlServicio + 'get_token', param, {
        headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  ChangePassword(
    username: string,
    old_password: string,
    new_password: string,
    password_hash: boolean
  ): Observable<ResponseAPI> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    this.storageService.getCurrentToken();
    const param = JSON.stringify({
      username,
      old_password,
      new_password,
      password_hash,
    });
    // debugger;
    console.log('PARAMS', param);

    return this.http
      .post<ResponseAPI>(this.UsuarioURL + 'change_password', param, {headers})
      .pipe(
        map((response: ResponseAPI) => {
          console.log('CHANGE PASS: ' + response);
          return response;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  resetPassword(data: ResetearContraseña) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    return this.http
      .post(this.ResetPassword + 'reset_password', data, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          //console.log(response.body['data']);
          //var obj_hijo = obj[Object.keys(obj)];
          let r = response.body;
          let re = r['data'];
          let res = re['new_password'];
          res = res;
          this.Password = res;
          console.log(this.Password);
          return response.body as ResponseAPIMultipago;
        }),
        catchError(this.errorHandler)
      );
  }

  cambiarEstado(data: CambioEstado) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    return this.http
      .post(this.UsuarioURL + 'changestatus', data, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return response.body as ResponseAPIMultipago;
        }),
        catchError(this.errorHandler)
      );
  }

  getOnlyId(lista: any[]): number[] {
    const listId = [];
    lista.forEach((element) => {
      listId.push(element.id);
    });
    return listId;
  }

  guardar(data: Usuario, lista_empresas: string[]) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    //  const list_code_services = lista_empresas.map(({ code }) => code);
    //  listCodeServices = user.list_code_service.map(({ code }) => code);

    const param = {
      id: data.id,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: data.phone_number,
      status: data.status,
      list_service_code: lista_empresas, // list_code_services,
      list_profile: this.getOnlyId(data.list_profile),
      type_id: data.type_id,
      ci: data.ci,
      extra_data: JSON.stringify(data.extra_data),
      maximum_daily_amount: data.maximum_daily_amount
    };

    console.log('param :>> ', JSON.stringify(param));
    return this.http
      .post(this.UsuarioURL + 'saveUserAccount', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          console.log('response usuario :>> ', response);
          return response.body as ResponseAPIMultipago;
        }),
        catchError((error) => {
          console.log('error guardar usuario :>> ', error);
          return throwError(error);
        })
      );
  }

  saveExternalUser(data: Usuario, lista_empresas: string[], idCompany: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    const param = {
      id: data.id,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone_number: data.phone_number,
      status: data.status,
      list_service_code: lista_empresas,
      voucher_company_id: idCompany,
    };

    console.log('param :>> ', JSON.stringify(param));
    return this.http
      .post(this.UsuarioURL + 'saveUserAccountExternal', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          console.log('response usuario :>> ', response);
          return response.body as ResponseAPIMultipago;
        }),
        catchError((error) => {
          console.log('error guardar usuario :>> ', error);
          return throwError(error);
        })
      );
  }

  obtenerPorId(id: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    console.log('id obtener id  :>> ', id);
    let params = new HttpParams();
    params = params.append('user_account_id', id.toString());

    return this.http
      .get(this.UsuarioURL + 'getuseraccount', {headers: reqHeader, params})
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response obtenerPorId  :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error obtenerPorId usuario :>> ', error);
          return throwError(error);
        })
      );
  }

  obtenerLista(
    list_service_code: string[],
    estado: number,
    tipoBusqueda: number,
    criterio: string,
    tipoUsuario: string
  ) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('list_service_code', list_service_code.join(','));
    params = params.append('status', estado.toString());
    params = params.append('type', tipoBusqueda.toString());
    params = params.append('search', criterio);
    params = params.append('type_user', tipoUsuario.toString());

    return this.http
      .get(this.UsuarioURL + 'getusersaccountsbyservice', {
        headers: reqHeader,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError(this.errorHandler)
      );
  }

  obtenerListaUsuarioExterno(
    list_service_code: string[],
    estado: number,
    tipoBusqueda: number,
    criterio: string,
    voucher_company_id: number
  ) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('list_service_code', list_service_code.join(','));
    params = params.append('status', estado.toString());
    params = params.append('type', tipoBusqueda.toString());
    params = params.append('search', criterio);
    params = params.append('voucher_company_id', voucher_company_id.toString());
    console.log('params usuaro :>> ', JSON.stringify(params));
    return this.http
      .get(this.UsuarioURL + 'userAccountsExternalByService', {
        headers: reqHeader,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError(this.errorHandler)
      );
  }

  cambiarEnviarEmail(id: number, sendMail: boolean) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const params = JSON.stringify({
      user_account_id: id,
      send_mail: sendMail,
    });

    return this.http.post<ResponseAPIMultipago>(
      this.UsuarioURL + 'changeSendMail',
      params, {headers}
    )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  updateExtraData(id: number, extraData: any) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    const params = JSON.stringify({
      user_account_id: id,
      extra_data: JSON.stringify(extraData),
    });

    return this.http.post<ResponseAPIMultipago>(
      this.UsuarioURL + 'updateExtraData',
      params, {headers}
    )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  errorHandler(error: Response) {
    console.log('error :>> ', error);
    if (error['error'] != null || error['error'] != undefined) {
      var miError: ErrorServicio = error['error'];
      return throwError(miError);
    }
    var jsonError = JSON.stringify(error);
    return throwError(error);
  }
}
