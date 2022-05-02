import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ReportRequestInterface} from "../models/ReportRequestInterface";
import {ResponseAPIMultipago} from "../models/ResponseAPI";
import {catchError, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  LoginURL: string = environment.urlServicio + 'ticket-reports/';

  PAY_ORDER_URL: string = environment.urlServicio + 'external_services/';

  constructor(private http: HttpClient, private storage: StorageService) {
  }

  getReportByCoupons(_filters: ReportRequestInterface) {
    console.log('ESTOS SON LOS FILTROS', _filters);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    const body = {
      service_code: _filters.service_code,
      end_date: _filters.end_date,
      start_date: _filters.start_date,
      type_search: _filters.type_search,
    };
    return this.http
      .post<ResponseAPIMultipago>(this.LoginURL + 'summarypaymentbytickettype', body, httpOptions)
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  getReportByCouponsExcel(model: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    const parameters = new HttpParams()
      .append('service_code', model.service_code)
      .append('end_date', model.end_date)
      .append('start_date', model.start_date);

    return this.http.get(this.LoginURL + 'summarypaymentbytickettypexlsx', {
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

  getReportByCanje(_filters: ReportRequestInterface) {
    console.log('ESTOS SON LOS FILTROS', _filters);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    const body = {
      service_code: _filters.service_code,
      end_date: _filters.end_date,
      start_date: _filters.start_date,
      type_search: _filters.type_search,
      field: _filters.field,
    };
    return this.http
      .post<ResponseAPIMultipago>(this.LoginURL + 'summarypaymentbytickettypecanje', body, httpOptions)
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  getReportByCanjeExcel(model: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    const parameters = new HttpParams()
      .append('service_code', model.service_code)
      .append('end_date', model.end_date)
      .append('start_date', model.start_date)
      .append('type_search', model.type_search)
      .append('field', model.field);
    console.log('parameters:', parameters);

    return this.http.get(this.LoginURL + 'summarypaymentbytickettypecanjexlsx', {
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
  

  getReportByState(_filters: ReportRequestInterface): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    const body = {
      service_code: _filters.service_code,
      end_date: _filters.end_date,
      start_date: _filters.start_date,
      type_search: _filters.type_search,
    };

    return this.http
      .post<ResponseAPIMultipago>(this.LoginURL + 'summarypaymentbyticketstatus', body, httpOptions)
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  getReportByStateExcel(model: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    const parameters = new HttpParams()
      .append('service_code', model.service_code)
      .append('end_date', model.end_date)
      .append('start_date', model.start_date)
      .append('type_search', model.type_search);
    return this.http
      .get(this.LoginURL + 'summarypaymentbyticketstatusxlsx', {
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

  getReportByPaymentChannel(_filters: ReportRequestInterface): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    const body = {
      service_code: _filters.service_code,
      end_date: _filters.end_date,
      start_date: _filters.start_date,
      type_search: _filters.type_search,
    };
    return this.http
      .post<ResponseAPIMultipago>(this.LoginURL + 'summarypaymentbypaychannel', body, httpOptions)
      .pipe(
        map((response: ResponseAPIMultipago) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          return throwError(error.error.message);
        })
      );
  }

  getReportByPaymentChannelExcel(model: any): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    const parameters = new HttpParams()
      .append('service_code', model.service_code)
      .append('end_date', model.end_date)
      .append('start_date', model.start_date)
      .append('type_search', model.type_search);
    return this.http
      .get(this.LoginURL + 'summarypaymentbypaychannelxlsx', {
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

  getpayordersbyservicereport(model: any): Observable<ResponseAPIMultipago> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const param = JSON.stringify(model);
      return this.http
        .post<ResponseAPIMultipago>(
          this.PAY_ORDER_URL + 'getpayordersbyservicereport',
          param,
          {headers}
        )
        .pipe(
          map((response: ResponseAPIMultipago) => {
            return response;
          }),
          catchError((error) => {
            console.log('getpayordersbyservicereport error');
            console.log(error);
            return throwError(error);
          })
        );
    } catch (error) {
      console.log(error);
      return throwError(error);
    }
  }

  getpayordersbyserviceExcel(model: any): Observable<any> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'blob',
      });
      const params = JSON.stringify(model);

      let parameter = new HttpParams()
        .set('code_service', model.code_service)
        .set('start_date', model.start_date)
        .set('end_date', model.end_date);

      console.log('model :>> ', model);
      console.log('parameter :>> ', parameter);
      return this.http.get(this.PAY_ORDER_URL + 'getExcelReport', {
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

  getReportByChannel(serviceCode: string, startDate: string, endDate: string, typeSearch: number) {
    const reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');
    let params = new HttpParams();
    params = params.append('service_code', serviceCode);
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);
    params = params.append('type_search', typeSearch.toString());
    return this.http
      .get<ResponseAPIMultipago>(this.PAY_ORDER_URL + 'channelReport', {params, headers: reqHeader})
      .pipe(map((response: ResponseAPIMultipago) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  getReportByChannelXlsx(serviceCode: string, startDate: string, endDate: string, typeSearch: number): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });
    let params = new HttpParams();
    params = params.append('service_code', serviceCode);
    params = params.append('start_date', startDate);
    params = params.append('end_date', endDate);
    params = params.append('type_search', typeSearch.toString());
    return this.http
      .get<ResponseAPIMultipago>(this.PAY_ORDER_URL + 'channelReportXlsx', {
        headers,
        responseType: 'blob' as 'json',
        params,
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

}
