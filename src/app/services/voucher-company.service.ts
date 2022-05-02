import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { ResponseAPIMultipago, ResponseAPI } from '../models/ResponseAPI';
import { catchError, map, toArray } from 'rxjs/operators';
import { ErrorServicio } from '../helper/error-servicio';
import { throwError, Observable } from 'rxjs';
import { VoucherEmpresa } from '../models/voucher-empresa';
import { CambioEstadoEmpresa } from '../models/cambio-estado-empresa';

@Injectable({
  providedIn: 'root',
})
export class VoucherCompanyService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) //private service: Service
  { }

  EmpresaURL: string = environment.urlServicio + 'external_services/';

  guardar(data: VoucherEmpresa, service_code: string) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    //  const list_code_services = lista_empresas.map(({ code }) => code);
    //  listCodeServices = user.list_code_service.map(({ code }) => code);
    const param = {
      id: data.id,
      name: data.name,
      visible: data.visible,
      service_id: service_code,
    };

    console.log('param :>> ', JSON.stringify(param));
    return this.http
      .post(this.EmpresaURL + 'saveVoucherCompany', param, {
        headers: reqHeader,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          console.log('response empresa :>> ', response);
          return response.body as ResponseAPIMultipago;
        }),
        catchError((error) => {
          console.log('error guardar empresa :>> ', error);
          return throwError(error);
        })
      );
  }

  obtenerPorId(id: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    console.log('id obtener id  :>> ', id);
    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.http
      .get(this.EmpresaURL + 'getVoucherCompany', {
        headers: reqHeader,
        params,
      }) ////aqui cambiar el getcompany
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response obtenerPorId  :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error obtenerPorId empresa :>> ', error);
          return throwError(error);
        })
      );
  }

  cambiarEstado(data: CambioEstadoEmpresa) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    return this.http
      .post(this.EmpresaURL + 'changestatus_company', data, {
        ////url
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

  obtenerLista(visible: number, criterio: string, service_code: string) {
    try {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      // var urlquery = `?status=${estado}&&search=${criterio}`;

      let paramsService = new HttpParams();
      paramsService = paramsService.append('visible', visible.toString());
      paramsService = paramsService.append('search', criterio);
      paramsService = paramsService.append('service_code', service_code);

      console.log('params :>> ', paramsService);
      console.log('this.EmpresaURL :>> ', this.EmpresaURL);

      return this.http
        .get<ResponseAPIMultipago>(
          this.EmpresaURL + 'getvouchercompaniesbyservice',
          {
            headers: headers,
            params: paramsService,
          }
        )
        .pipe(map((response: ResponseAPIMultipago) => {
          console.log('response empresas :>> ', response);
          return response;
        }),
          catchError((error) => {
            console.log('error obtenerLista vouchercompany :>> ', error);
            return throwError(error);
          })
        );
    } catch (error) {
      console.log(error);
      return throwError(error);
    }
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
