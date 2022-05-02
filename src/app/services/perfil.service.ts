import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Perfil } from 'src/app/models/perfil';

import { ErrorServicio } from '../helper/error-servicio';
import { CambioEstado } from '../models/cambio-estado';
import { ResponseAPIMultipago } from '../models/ResponseAPI';
import { StorageService } from './storage.service';
import { CambioEstadoProfile } from '../models/cambio-estado-profile';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  error: any;
  handleError: any;
  PerfilURL: string = `${environment.urlServicio}` + 'external_services';

  constructor(
    private httpClient: HttpClient,
    private sessionService: StorageService
  ) { }

  obtenerLista(
    estado: number,
    criterio: string,
    service_code: string[] = null
  ) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    // var urlquery = `?status=${estado}&&search=${criterio}`;
    if (service_code == null) {
      service_code = this.sessionService.getListCodeServices();
    }
    let paramsService = new HttpParams();
    paramsService = paramsService.append('status', estado.toString());
    paramsService = paramsService.append('search', criterio);
    paramsService = paramsService.append(
      'list_service_code',
      service_code.join(',')
    );

    console.log('params :>> ', paramsService);
    console.log('this.PerfilURL :>> ', this.PerfilURL);

    return this.httpClient
      .get(this.PerfilURL + '/getRoles', {
        params: paramsService,
        headers: reqHeader,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response perfil :>> ', response);

          return response;
        }),
        catchError((error) => {
          console.log('error obtenerLista perfiles :>> ', error);
          return throwError(error);
        })
      );
  }

  obtenerPorId(id: number) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.httpClient
      .get(this.PerfilURL + '/getRolesById', { headers: reqHeader, params })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response :>> ', response);
          return response;
        }),
        catchError(this.errorHandler)
      );
  }

  validarCambioEstado(id: number) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.httpClient
      .get(this.PerfilURL + '/validarPerfil', { headers: reqHeader, params })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError(this.errorHandler)
      );
  }

  /* cambiarEstado(data: CambioEstado) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    return this.httpClient
      .post(this.PerfilURL + '/cambiarEstado', data, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return <ResponseAPIMultipago>response.body;
        }),
        catchError(this.errorHandler)
      );
  } */
  cambiarEstado(data: CambioEstadoProfile) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    return this.httpClient
      .post(this.PerfilURL + '/changestatusprofile', data, {
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

  guardar(data: Perfil, company_list: string[]) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    const param = {
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      permissions: data.permissions.map((p) => p.id),
      list_service_code: company_list,
    };

    return this.httpClient
      .post(this.PerfilURL + '/saveRole', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          return <ResponseAPIMultipago>response.body;
        }),
        catchError((error) => {
          console.log('error guardar peril :>> ', error);
          return throwError(error);
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
