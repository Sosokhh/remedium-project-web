import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, LocalStorageService } from '../services';
import { catchError, switchMap, tap } from 'rxjs';
import { ACCESS_TOKEN, EXCLUDE_FROM_AUTH_INTERCEPTOR_URLS, REFRESH_TOKEN } from '../models';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req;
  const localStorageService = inject(LocalStorageService);
  const authService = inject(AuthService);
  const access_token: string | null = localStorageService.getItem(ACCESS_TOKEN);
  const refresh_token: string | null =
    localStorageService.getItem(REFRESH_TOKEN);

  if (!authService.isTokenExpired) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return next(authReq);
  }

  if (
    refresh_token &&
    !EXCLUDE_FROM_AUTH_INTERCEPTOR_URLS.some((url) => req.url.includes(url))
  ) {
    return authService.refreshToken(refresh_token).pipe(
      switchMap((refreshTokenResponse) => {
        authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${refreshTokenResponse.accessToken}`,
          },
        });
        localStorageService.setItem(
          ACCESS_TOKEN,
          refreshTokenResponse.accessToken
        );
        localStorageService.setItem(
          REFRESH_TOKEN,
          refreshTokenResponse.refreshToken
        );
        console.log('Access Token:', access_token);
        return next(authReq);
      }),
      catchError(() => {
        return next(authReq).pipe(tap(() => authService.doLogoutUser()));
      })
    );
  }

  return next(authReq);
};
