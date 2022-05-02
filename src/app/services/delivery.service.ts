import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs";
import {ResponseAPIMultipago} from "../models/ResponseAPI";

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  serviceURL: string = environment.serviceURL + 'ticketeg_services';

  constructor(private httpClient: HttpClient) {

  }

  GetAvailableServices(serviceCode: string) {
    var urlquery = `/${serviceCode}/deliveryAssignmentList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.httpClient.get<ResponseAPIMultipago>(this.serviceURL + urlquery, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {

        console.log(response);
        return response;
      }),
      catchError((error) => {
        return throwError(error.error.message);
      })
    );
  }

  GetAssignedDeliveryServices(serviceCode: string) {
    var urlquery = `/${serviceCode}/deliveryServiceList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.httpClient.get<ResponseAPIMultipago>(this.serviceURL + urlquery, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {
        return throwError(error.error.message);
      })
    )
  }

  DeleteServices(services_delivery_id: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    return this.httpClient.post<ResponseAPIMultipago>(this.serviceURL + '/deleteServiceDelivery', {services_delivery_id: services_delivery_id}, httpOptions).pipe(
      map((response: ResponseAPIMultipago) => {
        console.log(response);
        return response;
      }),
      catchError((error) => {

        return throwError(error.error.message);
      })
    )
  }

  AssignServices(deliveriesId: number[], serviceCode: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      })
    };
    return this.httpClient.post<ResponseAPIMultipago>(this.serviceURL + '/insertAssignmentServiceDelivery', {
      code: serviceCode,
      delivery_id: deliveriesId
    }, httpOptions).pipe(
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
