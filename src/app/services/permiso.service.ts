import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {ErrorServicio} from '../helper/error-servicio';
import {throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {ResponseAPIMultipago} from '../models/ResponseAPI';
import {EnumCodigoRespuesta} from '../helper/enum';
import {Permiso} from '../models/permiso';

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  error: any;
  handleError: any;
  PermisoURL: string = `${environment.urlServicio}` + 'external_services/';

  constructor(private httpClient: HttpClient) {
  }

  obtenerLista(id: number, serviceCode: string) {
    let reqHeader = new HttpHeaders();
    reqHeader.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('id', id.toString());
    params = params.append('service_code', serviceCode);
    console.log(`${this.PermisoURL}getPermissionsByRole_ ${id}`);
    return this.httpClient
      .get(this.PermisoURL + 'getPermissionsByRole', {
        headers: reqHeader,
        params,
      })
      .pipe(
        map((response: ResponseAPIMultipago) => {
          if (response.status == EnumCodigoRespuesta.Correcto && id == 0) {
            let listaPermisos: Array<Permiso> = new Array<Permiso>();
            response.data.forEach((element) => {
              element.check = false;
              element.permissions.forEach((hijo) => {
                hijo.check = false;
              });
              listaPermisos.push(element);
            });
            response.data = listaPermisos;
          }
          console.log('permisos obtenerLista resp :>> ' + id, response.data);
          return response;
        }),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: Response) {
    if (error['error'] != null || error['error'] != undefined) {
      var miError: ErrorServicio = error['error'];
      return throwError(miError);
    }
    var jsonError = JSON.stringify(error);
    return throwError(error);
  }
}
