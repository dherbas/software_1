import {Injectable} from '@angular/core';
import {TreeviewItem, TreeItem} from 'ngx-treeview';
import {PermisoService} from 'src/app/services/permiso.service';
import {EnumCodigoRespuesta} from 'src/app/helper/enum';
import {PermisoLista} from 'src/app/models/permiso-lista';
import {Permiso} from 'src/app/models/permiso';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArbolPermisoService {
  mensageError: string = '';
  private treeviewItem = new Subject<Array<TreeviewItem>>();

  constructor(private permisoService: PermisoService) {
  }

  obtenerPermiso(id: number, serviceCode: string): Observable<any> {
    this.permisoService.obtenerLista(id, serviceCode).subscribe(
      (resultado) => {
        if (resultado.status == EnumCodigoRespuesta.Correcto) {
          // console.log('permisos resultado.data :>> ', resultado.data);
          this.treeviewItem.next(this.armarArbolPermiso(resultado.data));
        } else {
          this.mensageError = resultado.message;
        }
      },
      (error) => {
        this.mensageError = error.errorMessage;
      }
    );
    return this.treeviewItem.asObservable();
  }

  armarArbolPermiso(listaPermisos: Array<PermisoLista>): Array<TreeviewItem> {
    let treeviewItem: Array<TreeviewItem> = new Array<TreeviewItem>();
    console.log('armarArbolPermios  :>> ', listaPermisos);
    listaPermisos.forEach((padre) => {
      // console.log('padre2 :>> ', padre);
      const itemPadre = new TreeviewItem({
        text: padre.name,
        value: padre.id,
        checked: padre.check,
        children: this.armarHijoPermiso(padre.permissions),
      });
      treeviewItem.push(itemPadre);
    });
    return treeviewItem;
  }

  armarHijoPermiso(listaPermisoHijo: Array<Permiso>): TreeItem[] {
    let treeItem: Array<TreeItem> = new Array<TreeItem>();

    listaPermisoHijo.forEach((hijo) => {
      const itemHijo = new TreeviewItem({
        text: hijo.name,
        value: hijo.id,
        checked: hijo.check,
      });
      treeItem.push(itemHijo);
    });
    return treeItem;
  }
}
