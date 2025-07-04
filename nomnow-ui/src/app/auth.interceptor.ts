import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthRequest =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  const token = authService.getToken();

  // Don't attach token for auth requests
  const authReq = token && !isAuthRequest
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        console.warn('Unauthorized, logging out...');
        authService.logout();

        // Optional: redirect or show login modal
        router.navigate(['/']);
      }
      return throwError(() => err);
    })
  );
};

// import {
//   HttpEvent,
//   HttpHandlerFn,
//   HttpInterceptorFn,
//   HttpRequest
// } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { catchError, Observable, throwError } from 'rxjs';
// import { AuthService } from './services/auth.service';
// import { Router } from '@angular/router';

// export const AuthInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<unknown>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<unknown>> => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

//   // ✅ Skip expiration check for login/register requests
//   if (!isAuthRequest && authService.isTokenExpired()) {
//     authService.logout();
//     return throwError(() => new Error('Session expired'));
//   }

//   const token = authService.getToken();

//   const authReq = token
//     ? req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       })
//     : req;

//   return next(authReq).pipe(
//     catchError(err => {
//       if (err.status === 401) {
//         authService.logout();
//       }
//       return throwError(() => err);
//     })
//   );
// };
