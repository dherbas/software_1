import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {StorageService} from './storage.service';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private storage: StorageService) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentSession = this.storage.getCurrentSession();
    let request = req;
    //debugger;
    if (currentSession) {
      const token = req.url.includes(environment.urlServicio)
        ? currentSession.tokens.multipagoCliente
        : currentSession.tokens.accessToken;

      if (token) {
        request = req.clone({
          setHeaders: {
            authorization: `Bearer ${token}`,
          },
        });
      }
      // console.log('token :>> ', token);
      console.log('request :>> ', request);
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }

        return throwError(err);
      })
    );
  }
}
