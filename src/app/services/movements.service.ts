import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {filtersMovement} from '../components/movements/movements.component';
import {ResponseAPIMultipago} from '../models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  LoginURL: string = environment.urlServicio + 'ticket-reports';

  constructor(private http: HttpClient) {
  }


  getMovements(_filters: filtersMovement) {
    const body = {
      service_code: _filters.code,
      ticket_price: _filters.ammount,
      pay_channel_id: _filters.paymentChannel,
      pay_order_state_id: _filters.paymentOrder,
      ticket_status: _filters.status,
      searchType: _filters.searchType,
      startDate: _filters.startDate,
      endDate: _filters.endDate,
      document: _filters.document,
      paymentOrder: _filters.paymentOrder,
      transactionNumber: _filters.transactionNumber,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    return this.http.post<ResponseAPIMultipago>(this.LoginURL + '/paymentreport', body, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {

        console.log(error.error.message);
        return throwError(error.error.message);
      })
    );

  }

  getMovementsExcel(_filters: filtersMovement): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    const parameters = new HttpParams()
      .append('service_code', _filters.code)
      .append('ticket_price', _filters.ammount.toString())
      .append('pay_channel_id', _filters.paymentChannel.toString())
      .append('pay_order_state_id', _filters.paymentOrder)
      .append('ticket_status', _filters.status.toString())
      .append('searchType', _filters.searchType)
      .append('startDate', _filters.startDate)
      .append('endDate', _filters.endDate)
      .append('document', _filters.document)
      .append('paymentOrder', _filters.paymentOrder)
      .append('transactionNumber', _filters.transactionNumber);

    return this.http.get(this.LoginURL + '/paymentreportxlsx', {
      headers,
      responseType: 'blob' as 'json',
      params: parameters,
    }).pipe(map((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );

  }


}
