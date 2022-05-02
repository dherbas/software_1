import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "src/environments/environment";
import {ResponseAPI} from "../models/ResponseAPI";
import {map, catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class QrvalidatorService {


  LoginURL: string = environment.urlServicio + 'tickets/';

  constructor(private http: HttpClient, private sessionService: StorageService) {
  }

  ValidateQR(model: { ticket_id: string; list_service_codes: string[]; user_account_id: number }) {
  // ValidateQR(model: { ticket_id: string; list_service_codes: string[]; user_account_id: number; manilla1: string; manilla2: string }) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http
      .post<ResponseAPI>(this.LoginURL + 'validateqrconfirmation', model, {headers: headers})
      .pipe(
        map((response: ResponseAPI) => {

          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  validateCodeManilla(model) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http
      .post<ResponseAPI>(this.LoginURL + 'validateCodeManilla', model, {headers: headers})
      .pipe(
        map((response: ResponseAPI) => {

          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  GetQRData(model: { qr: string; list_service_codes: string[]; }) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json; charset=utf-8'
    );
    return this.http
      .post<ResponseAPI>(this.LoginURL + 'validateqr', model, {headers: headers})
      .pipe(
        map((response: ResponseAPI) => {

          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }
}
