import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';

import { GenerateOrder } from '../models/generate_Order';
import { Filter } from '../models/filter';
import { filtersMovement } from '../models/filtersMovement';
import { General } from '../helper/general';

import { ResponseAPIMultipago } from '../models/ResponseAPI';

@Injectable({
  providedIn: 'root',
})
// tslint:disable: variable-name
export class PayOrderService {
  _PayOrderURL: string = environment.urlServicio + 'external_services/';
  _POSServiceURL: string = environment.posServiceURL;
  HGeneral: General = new General();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getPayOrder(payOrderNumber: number): Observable<ResponseAPIMultipago> {
    try {
      var headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const param = JSON.stringify({
        pay_order_number: payOrderNumber,
      });

      return this.http
        .post<ResponseAPIMultipago>(
          this._PayOrderURL + 'getpayorderbyservice',
          param,
          {
            headers: headers,
          }
        )
        .pipe(
          map((response: ResponseAPIMultipago) => {
            console.log('getPayOrder respnse OK');
            console.log(response);
            return response;
          }),
          catchError((error) => {
            console.log('getPayOrder error');
            console.log(error);
            return throwError(error);
          })
        );
    } catch (error) {
      console.log(error);
      return throwError(error);
    }
  }

  createNewPayOrder(order: GenerateOrder): Observable<ResponseAPIMultipago> {
    try {
      const token = this.storageService.getCurrentToken();
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const param = JSON.stringify({
        service: order.service,
        payment_data: order.payment_data,
        client: order.client,
      });
      console.log('param :>> ', param);
      return this.http
        .post<ResponseAPIMultipago>(this._PayOrderURL + 'payorders', param, {
          headers,
        })
        .pipe(
          map((response: ResponseAPIMultipago) => {
            return response;
          }),
          catchError((error) => {
            console.log('error :>> ', error);
            console.log('param :>> ', param);

            return throwError(error);
          })
        );
    } catch (error) {
      console.log(error);
      return throwError(error);
    }
  }

  cancelPayOrder(payOrderNumber: number, reason: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    let param = JSON.stringify({
      pay_order_number: payOrderNumber,
      reason_canceled: reason,
      user: this.storageService.getCurrentUser().username,
    });

    return this.http
      .post<ResponseAPIMultipago>(
        this._PayOrderURL + 'cancelpayorderbyservice',
        param,
        {
          headers: headers,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('resp cancel ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error cancel', error);
          return throwError(error);
        })
      );
  }

  getPayOrderFilter(filter: filtersMovement, code_service: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    console.log('filtros backoffice', filter);
    const filterAPI: Filter = new Filter();
    filterAPI.code_service = code_service; //this.storageService.getServiceSelected().code;
    filterAPI.type_search = filter.searchType;
    filterAPI.pay_order_number = filter.paymentOrder;
    filterAPI.state = filter.state.toString();
    filterAPI.document = filter.document;
    filterAPI.start_date = this.HGeneral.getDateFormat(filter.startDate);
    filterAPI.end_date = this.HGeneral.getDateFormat(filter.endDate);

    console.log('filtros api', filterAPI);

    let param = JSON.stringify(filterAPI);
    console.log('param', param);

    return this.http
      .post<ResponseAPIMultipago>(
        this._PayOrderURL + 'getpayordersbyservice',
        param,
        {
          headers: headers,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('resp getPayOrderFilter ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error getPayOrderFilter', error);
          return throwError(error);
        })
      );
  }

  getPaymentsOnDeliveryFilter(filter: filtersMovement, code_service: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );

    console.log('filtros backoffice', filter);
    let filterAPI: Filter = new Filter();
    filterAPI.code_service = code_service; //this.storageService.getServiceSelected().code;
    filterAPI.type_search = filter.searchType;
    filterAPI.pay_order_number = filter.paymentOrder;
    filterAPI.state = filter.state.toString();
    filterAPI.document = filter.document;
    filterAPI.start_date = this.HGeneral.getDateFormat(filter.startDate);
    filterAPI.end_date = this.HGeneral.getDateFormat(filter.endDate);

    console.log('filtros api', filterAPI);

    let param = JSON.stringify(filterAPI);
    console.log('param', param);

    return this.http
      .post<ResponseAPIMultipago>(this._PayOrderURL + 'list_movements', param, {
        headers: headers,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('resp getPayOrderFilter ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error getPayOrderFilter', error);
          return throwError(error);
        })
      );
  }

  paymentTigoMoney(item: any): Observable<ResponseAPIMultipago> {
    const body = {
      client_first_name: item.client_first_name,
      client_last_name: item.client_last_name,
      client_ci: item.client_ci,
      client_phone: item.client_phone,
      client_email: item.client_email,
      business_name: item.client_business_name,
      nit: item.client_nit,
      pay_order_number: item.pay_official_number,
      total_amount: item.total_amount,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post<ResponseAPIMultipago>(
        this._PayOrderURL + 'paymentTigoMoney',
        body,
        httpOptions
      )
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

  paymentQRCode(item: any): Observable<ResponseAPIMultipago> {
    console.log(item);

    const body = {
      client_first_name: item.client_first_name,
      client_last_name: item.client_last_name,
      client_ci: item.client_ci,
      client_phone: item.client_phone,
      client_email: item.client_email,
      business_name: item.client_business_name,
      nit: item.client_nit,
      pay_order_number: item.pay_order_number,
      total_amount: item.total_amount,
    };
    console.log(body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<ResponseAPIMultipago>(
        this._PayOrderURL + 'paymentCode',
        body,
        httpOptions
      )
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

  getQRImageByMD5(md5: string): Observable<ResponseAPIMultipago> {
    const params = new HttpParams().append('md5_pay_order_number', md5);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
    };
    return this.http
      .get<ResponseAPIMultipago>(
        this._PayOrderURL + 'getQRImageByMD5',
        httpOptions
      )
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

  updatePayOrderSource(md5: string): Observable<ResponseAPIMultipago> {
    const params = new HttpParams()
      .append('md5_pay_order_number', md5)
      .append('pay_order_source_code', 'm_url_directo');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
    };
    return this.http
      .get<ResponseAPIMultipago>(
        this._PayOrderURL + 'updatePayOrderSource',
        httpOptions
      )
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

  forwardBCPQrReservation(md5: string): Observable<ResponseAPIMultipago> {
    const params = new HttpParams().append('md5_pay_order_number', md5);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params,
    };
    return this.http
      .get<ResponseAPIMultipago>(
        this._PayOrderURL + 'forwardBCPQrReservation',
        httpOptions
      )
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

  saleTransaction(
    item: any,
    cardType: string,
    cashierIP: string
  ): Observable<ResponseAPIMultipago> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .get<ResponseAPIMultipago>(
        this._POSServiceURL +
          cardType +
          '/' +
          item.total_amount +
          '/' +
          cashierIP,
        httpOptions
      )
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

  paymentWithPOSCard(item: any): Observable<ResponseAPIMultipago> {
    const body = {
      client_first_name: item.client_first_name,
      client_last_name: item.client_last_name,
      client_ci: item.client_ci,
      client_phone: item.client_phone,
      client_email: item.client_email,
      business_name: item.client_business_name,
      nit: item.client_nit,
      pay_order_number:
        typeof item.pay_order_number !== 'undefined'
          ? item.pay_order_number
          : item.pay_official_number,
      total_amount: item.total_amount,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http
      .post<ResponseAPIMultipago>(
        this._PayOrderURL + 'paymentPOSCard',
        body,
        httpOptions
      )
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

  createReservation(md5PayOrder): Observable<ResponseAPIMultipago> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .get<ResponseAPIMultipago>(
        environment.urlServicio + 'pay/bank/createreservation/' + md5PayOrder,
        httpOptions
      )
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

  paymentBank(item: any): Observable<ResponseAPIMultipago> {
    const body = {
      client_first_name: item.client_first_name,
      client_last_name: item.client_last_name,
      client_ci: item.client_ci,
      client_phone: item.client_phone,
      client_email: item.client_email,
      business_name: item.client_business_name,
      nit: item.client_nit,
      pay_order_number: item.pay_official_number,
      md5_pay_order_number: item.md5_pay_order_number,
      total_amount: item.total_amount,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http
      .post<ResponseAPIMultipago>(
        environment.urlServicio + 'pay/bank/pay',
        body,
        httpOptions
      )
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

getDeliveryFilter(code_service: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    let param = JSON.stringify({
      code_service: code_service
    });
    console.log('param getDeliveryFilter', param);
    return this.http
      .post<ResponseAPIMultipago>(
        this._PayOrderURL + 'list_delivery',
        param,
        {
          headers: headers,
        }
      )
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log('resp getDeliveryFilter ', response);
          return response;
        }),
        catchError((error) => {
          console.log('error getDeliveryFilter', error);
          return throwError(error);
        })
      );
  }

  getPaymentsOnDeliveryFilterExcel(model: any): Observable<any>{
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'blob',
      });
      const params = JSON.stringify(model);
      let parameter = new HttpParams()
      .set('code_service', model.code_service)
      .set('state', model.state)
      .set('type_search', model.type_search)
      .set('document', model.document)
      .set('pay_order_number', model.pay_order_number)
      .set('start_date', model.start_date)
      .set('end_date', model.end_date);

      console.log('parameter getPaymentsOnDeliveryFilterExcel', parameter);

      return this.http.get(this._PayOrderURL + 'list_movements_excel', {
        headers,
        responseType: 'blob' as 'json',
        params: parameter,
      }).pipe(
        map((response) => {
          return response;
        }));
    } catch (error) {
      console.log(error);
      return throwError(error);
    }
  }
}
