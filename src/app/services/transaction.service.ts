import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseAPIMultipago } from '../models/ResponseAPI';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnumPayOrderChannel } from '../helper/enum';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  error: any;
  handleError: any;
  TransactionURL: string = `${environment.urlServicio}` + 'external_services/';

  constructor(private httpClient: HttpClient) {}

  getServices() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient
      .get<ResponseAPIMultipago>(this.TransactionURL + 'servicesTransactions', {
        headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('response get services :>> ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error :>> ', error);
          return throwError(error.error.message);
        })
      );
  }

  getServicesByDateRange(
    startDate: string,
    endDate: string,
    payOrderStateId: number
  ) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);
    params = params.append('pay_order_state_id', payOrderStateId.toString());
    return this.httpClient
      .get<ResponseAPIMultipago>(
        this.TransactionURL + 'servicesByDateRageTransactions',
        {
          params,
          headers,
        }
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

  getDetailedTransactions(
    serviceId: string,
    state: number,
    startDate: string,
    endDate: string,
    search: string,
    isAdmin: boolean
  ) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('service_id', serviceId);
    params = params.append('state', state.toString());
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);
    params = params.append('search', search);
    params = params.append('is_admin', isAdmin.toString());
    return this.httpClient
      .get<ResponseAPIMultipago>(this.TransactionURL + 'detailedTransactions', {
        params,
        headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  downloadDetailedTransactionsXlsx(
    serviceId: number,
    state: number,
    startDate: string,
    endDate: string,
    search: string,
    isAdmin: boolean
  ): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    let parameters = new HttpParams();
    parameters = parameters.append('service_id', serviceId.toString());
    parameters = parameters.append('state', state.toString());
    parameters = parameters.append('start_date', startDate);
    parameters = parameters.append('end_date', endDate);
    parameters = parameters.append('search', search);
    parameters = parameters.append('is_admin', isAdmin.toString());
    return this.httpClient
      .get(this.TransactionURL + 'detailedTransactionsXlsx', {
        headers,
        responseType: 'blob' as 'json',
        params: parameters,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getComissionsTransactions(
    startDate: string,
    endDate: string,
    serviceId: string,
    paymentTypeId: string,
    isAdmin: boolean
  ) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);
    params = params.append('service_id', serviceId);
    params = params.append('payment_type_id', paymentTypeId);
    params = params.append('is_admin', isAdmin.toString());
    return this.httpClient
      .get<ResponseAPIMultipago>(
        this.TransactionURL + 'commissionsTransactions',
        {
          params,
          headers: reqHeader,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  downloadComissionsTransactionsXlsx(
    startDate: string,
    endDate: string,
    service_id: string,
    payment_type_id: string,
    isAdmin: boolean
  ): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    let parameters = new HttpParams();
    parameters = parameters.append('start_date', startDate);
    parameters = parameters.append('end_date', endDate);
    parameters = parameters.append('service_id', service_id);
    parameters = parameters.append('payment_type_id', payment_type_id);
    parameters = parameters.append('is_admin', isAdmin.toString());
    return this.httpClient
      .get(this.TransactionURL + 'commissionsTransactionsXlsx', {
        headers,
        responseType: 'blob' as 'json',
        params: parameters,
      })
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getPayChannelName(payChannelId): string {
    switch (payChannelId) {
      case EnumPayOrderChannel.Presencial:
        return 'Pago en Punto Físico';
      case EnumPayOrderChannel.TigoMoney:
        return 'Tigo Money';
      case EnumPayOrderChannel.TarjetaCredito:
        return 'Tarjeta de Débito/Crédito';
      case EnumPayOrderChannel.PagoCodigo:
        return 'Pago con Código';
      case EnumPayOrderChannel.BCGanadero:
        return 'Banco Ganadero';
      case EnumPayOrderChannel.QRMultipago:
        return 'Transferencia QR Multipago/Simple';
      case EnumPayOrderChannel.PuntoFisico:
        return 'Tigo Punto Físico';
      case EnumPayOrderChannel.Cybersource:
        return 'Tarjeta de Débito/Crédito - Cybersource';
      default:
        return '';
    }
  }
}
