import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UsuarioService } from './../services/usuario.service';
import { UsuarioLogin } from '../models/usuario-login';
import { Usuario } from 'src/app/models/usuario';
import { map } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { PermisoLista } from 'src/app/models/permiso-lista';
import { Router } from '@angular/router';
import { EnumCodigoRespuesta, EnumEstado } from 'src/app/helper/enum';

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobalesService {
  private nombreUsuario = new Subject<string>();
  private nombreComponente = new Subject<string>();

  private _UsuarioLogin: Usuario = new Usuario();

  constructor(
    private usuarioService: UsuarioService,
    private storageService: StorageService,
    private router: Router
  ) {}

  public setNombreUsuario(nombreUsuario: string) {
    this.nombreUsuario.next(nombreUsuario);
  }

  public getNombreUsuario() {
    return this.nombreUsuario.asObservable();
  }

  public setNombreComponente(nombreComponente: string) {
    this.nombreComponente.next(nombreComponente);
  }

  public getNombreComponente() {
    return this.nombreComponente.asObservable();
  }

  public ValidarSession(): Observable<boolean> {
    const subject = new Subject<boolean>();
    subject.next(true);
    return subject.asObservable();
  }
}
