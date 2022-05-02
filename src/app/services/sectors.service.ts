import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ResponseAPIMultipago} from "../models/ResponseAPI";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  serviceURL: string = environment.serviceURL + 'ticketeg_services';

  constructor(private httpClient: HttpClient) {
  }

  GetAllSectors(serviceCode: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const path = `/${serviceCode}/selectsectorservice`;
    return this.httpClient.get<ResponseAPIMultipago>(this.serviceURL + path, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {

        return throwError(error.error.message);
      })
    )
  }

  GetUrlSector(id: string, serviceCode: string): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const path = `/${serviceCode}/generateUrlTicketeg/${id}`;
    return this.httpClient.get<ResponseAPIMultipago>(this.serviceURL + path, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {

        return throwError(error.error.message);
      })
    )
  }

  UpdateSector(result: any, serviceCode: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const path = `/${serviceCode}/updateSector/${result.sector_duration_attributes.sector_id}`;
    return this.httpClient.put<ResponseAPIMultipago>(this.serviceURL + path, result, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {

        return throwError(error.error.message);
      })
    )
  }

}
