import {Injectable} from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {StorageService} from '../services/storage.service';
import {UsuarioService} from '../services/usuario.service';
import {Observable} from 'rxjs';
import {take, map} from 'rxjs/operators';

@Injectable()
export class AuthorizatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private authenticationService: UsuarioService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authenticationService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        //debugger;
        if (this.storageService.isAuthenticated()) {
          return true;
        }

        this.router.navigate(['/login']);
      })
    );
  }
}
