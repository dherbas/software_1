import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {throwError} from 'rxjs';
import {ResponseAPIMultipago} from '../models/ResponseAPI';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  ParamURL: string = environment.urlServicio + 'external_services/';

  constructor(private http: HttpClient) {
  }

  GetParameters(serviceCode: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('service_code', serviceCode);
    console.log('params :>> ', params);
    return this.http
      .get<ResponseAPIMultipago>(this.ParamURL + 'get_parameters', {
        headers,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response  parameter :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error parameter :>> ', error);
          return throwError(error.error.message);
        })
      );
  }

  UpdateParameter(
    id: number,
    name: string,
    value: string,
    description: string
  ) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let param = JSON.stringify({
      id: id,
      name: name,
      value: value,
      description: description,
    });

    return this.http
      .post<ResponseAPIMultipago>(this.ParamURL + 'update_parameter', param, {
        headers: headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  EditParameter(id: number) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let params = new HttpParams();
    params = params.append('id', id.toString());

    return this.http
      .get<ResponseAPIMultipago>(this.ParamURL + 'get_parameter', {
        headers: headers,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }
}
