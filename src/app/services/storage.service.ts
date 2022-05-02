import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {User} from '../models/user';
import {Session} from '../models/Session';
import {cmbService} from '../models/cmbService';
import {EnumTypeUser} from '../helper/enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private localStorageService;
  private currentSession: Session = null;
  private mostrarMenu = true;

  constructor(private router: Router) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  setCurrentSession(session: Session): boolean {
    this.currentSession = session;
    this.localStorageService.setItem('currentUser', JSON.stringify(session));
    return true;
  }

  loadSessionData(): Session {
    const sessionStr = this.localStorageService.getItem('currentUser');
    return sessionStr != null && sessionStr != undefined
      ? <Session> JSON.parse(sessionStr)
      : null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    const session: Session = this.getCurrentSession();
    return session && session.user ? session.user : null;
  }

  getListCodeServices(): string[] {
    const user = this.getCurrentUser();
    let listCodeServices: string[];
    if (user) {
      listCodeServices = user.list_code_service.map(({code}) => code);
      return listCodeServices;
    }
    return listCodeServices;
  }

  getServiceSelected(): cmbService {
    const session = this.getCurrentSession();
    if (session) {
      return session.serviceSelected;
    }
    return null;
  }

  setServiceSelected(serviceSelected: cmbService) {
    const session = this.getCurrentSession();
    if (session) {
      session.serviceSelected = serviceSelected;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentToken() != null ? true : false;
  }

  isAdministratorUser(): boolean {
    const userType = this.currentSession.user.type_code;
    return userType == EnumTypeUser.Gerencia || userType == EnumTypeUser.Contabilidad ? true : false;

  }

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return session && session.tokens && session.tokens.multipagoCliente
      ? session.tokens.multipagoCliente
      : null;
  }

  logout(): void {
    this.removeCurrentSession();
    // this.router.navigate(['/login']);
  }

  // Menu
  setVisualizarMenu(valor: boolean) {
    this.mostrarMenu = valor;
  }

  getVisualizarMenu(): boolean {
    return this.mostrarMenu;
  }
}
