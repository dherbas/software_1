import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { isNil, remove, reverse } from 'lodash';
import {
  DownlineTreeviewItem,
  OrderDownlineTreeviewEventParser,
  TreeviewComponent,
  TreeviewConfig,
  TreeviewEventParser,
  TreeviewHelper,
  TreeviewItem,
} from 'ngx-treeview';
import { ArbolPermisoService } from './arbol-permiso.service';
import { Permiso } from 'src/app/models/permiso';
import { PermisoLista } from 'src/app/models/permiso-lista';
import { EnumCodigoRespuesta } from 'src/app/helper/enum';
import { PermisoService } from 'src/app/services/permiso.service';

@Injectable()
export class ProductTreeviewConfig extends TreeviewConfig {
  hasAllCheckBox = false;
  hasFilter = false;
  hasCollapseExpand = false;
}

// tslint:disable: prefer-const
@Component({
  selector: 'app-arbol-permiso',
  templateUrl: './arbol-permiso.component.html',
  styleUrls: ['./arbol-permiso.component.css'],
  providers: [
    ArbolPermisoService,
    {
      provide: TreeviewEventParser,
      useClass: OrderDownlineTreeviewEventParser,
    },
    { provide: TreeviewConfig, useClass: ProductTreeviewConfig },
  ],
})
export class ArbolPermisoComponent implements OnInit {
  @ViewChild(TreeviewComponent, { static: true })
  treeviewComponent: TreeviewComponent;
  items: TreeviewItem[];
  rows: string[];
  mensageError: string = '';

  @Input() id: number;
  @Input() serviceCode: string;

  constructor(
    private arbolPermisoService: ArbolPermisoService,
    private permisoService: PermisoService
  ) {}

  ngOnInit() {
    this.arbolPermisoService
      .obtenerPermiso(this.id, this.serviceCode)
      .subscribe(
        (resultado) => {
          this.items = resultado;
        },
        (error) => {
          this.mensageError = error.errorMessage;
        }
      );
  }

  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    this.rows = [];
    downlineItems.forEach((downlineItem) => {
      const item = downlineItem.item;
      const value = item.value;
      const texts = [item.text];
      let parent = downlineItem.parent;
      while (!isNil(parent)) {
        texts.push(parent.item.text);
        parent = parent.parent;
      }
      const reverseTexts = reverse(texts);
      const row = `${reverseTexts.join(' -> ')} : ${value}`;
      this.rows.push(row);
    });
  }

  removeItem(item: TreeviewItem) {
    let isRemoved = false;
    for (const tmpItem of this.items) {
      if (tmpItem === item) {
        remove(this.items, item);
      } else {
        isRemoved = TreeviewHelper.removeItem(tmpItem, item);
        if (isRemoved) {
          break;
        }
      }
    }

    if (isRemoved) {
      this.treeviewComponent.raiseSelectedChange();
    }
  }

  obtenerPermisoMarcado(): Array<Permiso> {
    let permisoMarcado: Array<Permiso> = new Array<Permiso>();
    this.items.forEach((padre) => {
      let permisoPadre: Permiso = new Permiso();
      if (padre.checked || padre.checked == undefined) {
        permisoPadre.id = padre.value;
        permisoPadre.name = padre.text;
        permisoPadre.check = true;
        permisoMarcado.push(permisoPadre);
      }
      if (padre.children != undefined) {
        padre.children.forEach((hijo) => {
          let permisoHijo: Permiso = new Permiso();
          if (hijo.checked) {
            permisoHijo.id = hijo.value;
            permisoHijo.name = hijo.text;
            permisoHijo.check = true;
            permisoMarcado.push(permisoHijo);
          }
        });
      }
    });
    console.log(permisoMarcado);
    return permisoMarcado;
  }

  ponerPermisos(
    listaPermisoTotal: Array<Permiso>,
    listaPermisoMarcado: Array<Permiso>
  ) {
    let listaPermisosUnion: Array<PermisoLista>;
    this.permisoService.obtenerLista(0, this.serviceCode).subscribe(
      (resultado) => {
        if (resultado.status == EnumCodigoRespuesta.Correcto) {
          listaPermisosUnion = resultado.data;
          console.log('listaPermisoTotal :>> ', listaPermisoTotal);
          console.log('listaPermisosUnion :>> ', listaPermisosUnion);
          console.log('listaPermisoMarcado :>> ', listaPermisoMarcado);
          listaPermisoTotal.forEach((permiso) => {
            if (
              permiso.router_link.includes('#') &&
              permiso.parent_id == null
            ) {
              // Marcar padre
              listaPermisosUnion.find((x) => x.id === permiso.id).check =
                permiso.check;

              // let listaHijos: Array<Permiso> = listaPermisoTotal.filter(
              //   (x) => x.parent_id === permiso.id
              // );
              let listaHijos = permiso.permissions;
              listaHijos.forEach((hijo) => {
                listaPermisosUnion
                  .find((x) => x.id === permiso.id)
                  .permissions.find((y) => y.id === hijo.id).check = hijo.check;
              });
            } else if (permiso.parent_id == null) {
              listaPermisosUnion.find((x) => x.id === permiso.id).check =
                permiso.check;
            }
          });
          console.log('listaPermisoMarcado :>> ', listaPermisoMarcado);
          if (listaPermisoMarcado) {
            listaPermisoMarcado.forEach((permiso) => {
              // Saber si es padre

              let idPermisoPadre = 0;
              if (
                listaPermisosUnion.find((x) => x.id === permiso.id) != undefined
              ) {
                listaPermisosUnion.find((x) => x.id === permiso.id).check =
                  permiso.check;
              } else {
                listaPermisosUnion.forEach((padre) => {
                  if (padre.permissions.length > 0) {
                    if (
                      padre.permissions.find((x) => x.id === permiso.id) !=
                      undefined
                    ) {
                      idPermisoPadre = padre.id;
                    }
                  }
                });

                if (idPermisoPadre != null) {
                  // Marcar padre
                  listaPermisosUnion.find(
                    (x) => x.id === idPermisoPadre
                  ).check = true;
                  // Marcar hijo
                  listaPermisosUnion
                    .find((x) => x.id === idPermisoPadre)
                    .permissions.find((y) => y.id === permiso.id).check = true;
                }
              }
            });
          }
          console.log('listaPermisosUnion final :>> ', listaPermisosUnion);
          this.items =
            this.arbolPermisoService.armarArbolPermiso(listaPermisosUnion);
          listaPermisoTotal = this.colocarPermisosHijos(listaPermisoTotal);
          this.deshabilitarPermisosPerfiles(listaPermisoTotal);
        } else {
          this.mensageError = resultado.message;
        }
      },
      (error) => {
        this.mensageError = error.errorMessage;
      }
    );
  }

  colocarPermisosHijos(listaPermisoTotal: Permiso[]): Permiso[] {
    const listaPermisosPadres = listaPermisoTotal.filter(
      (x) => x.permissions != null && x.permissions.length > 0
    );
    listaPermisosPadres.forEach(
      (element) =>
        (listaPermisoTotal = listaPermisoTotal.concat(element.permissions))
    );
    return listaPermisoTotal;
  }

  deshabilitarPermisosPerfiles(listaPermisoTotal: Array<Permiso>) {
    console.log('listaPermisoTotal :>> ', listaPermisoTotal);
    console.log('this.items :>> ', this.items);
    this.items.forEach((padre) => {
      // Preguntar si el padre esta el la lista para deshabilitarlo
      if (padre.value == 3) console.log('padre gestion :>> ', padre);
      if (listaPermisoTotal.find((x) => x.id == padre.value) != undefined) {
        if (padre.children == undefined) {
          padre.disabled = true;
        } else {
          if (
            padre.children.length ===
            listaPermisoTotal.filter((x) => x.parent_id === padre.value).length
          ) {
            padre.disabled = true;
          }
        }
      }
      // Recorrer hijos
      if (padre.children != undefined) {
        padre.disabled = true;
        padre.children.forEach((hijo) => {
          // Preguntar si el hijo esta el la lista para deshabilitarlo

          if (listaPermisoTotal.find((x) => x.id == hijo.value) != undefined) {
            hijo.disabled = true;
          }
        });
      }
    });
  }
}
