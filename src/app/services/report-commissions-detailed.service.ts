import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResponseAPIMultipago } from '../models/ResponseAPI';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { EnumPayOrderChannel } from '../helper/enum';

@Injectable({
  providedIn: 'root',
})
export class ReportCommissionsDetailedService {
  error: any;
  handleError: any;
  ReportPayOrderQR: string =
    `${environment.urlServicio}` + 'external_services/';

  constructor(private httpClient: HttpClient) {}

  getPayOrderForReportCommissions(
    // serviceId: number,

    startDate: string,
    endDate: string
  ) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams();
    // params = params.append('service_id', serviceId.toString());

    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);

    return this.httpClient
      .get<ResponseAPIMultipago>(
        this.ReportPayOrderQR + 'detailedCommissions',
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
          console.log('error :>> ', error);
          return throwError(error);
        })
      );
  }

  getPayOrderForReportCommissionsReport(
    // serviceId: number,

    startDate: string,
    endDate: string
  ): any {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    let params = new HttpParams();
    // params = params.append('service_id', serviceId.toString());
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);

    return this.httpClient
      .get(this.ReportPayOrderQR + 'qrPaymentsReport', {
        headers,
        responseType: 'blob' as 'json',
        params: params,
      })
      .pipe(
        map((response) => {
          console.log('response :>> ', response);
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
        return 'Pago en Punto F??sico';
      case EnumPayOrderChannel.TigoMoney:
        return 'Tigo Money';
      case EnumPayOrderChannel.TarjetaCredito:
        return 'Tarjeta de D??bito/Cr??dito';
      case EnumPayOrderChannel.PagoCodigo:
        return 'Pago con C??digo';
      case EnumPayOrderChannel.BCGanadero:
        return 'Banco Ganadero';
      case EnumPayOrderChannel.QRMultipago:
        return 'Transferencia QR Multipago/Simple';
      case EnumPayOrderChannel.PuntoFisico:
        return 'Tigo Punto F??sico';
      case EnumPayOrderChannel.Cybersource:
        return 'Tarjeta de D??bito/Cr??dito - Cybersource';
      default:
        return '';
    }
  }
}
