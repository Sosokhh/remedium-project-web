import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, delay, finalize, throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { LoadingService } from '../services';
import { EXCLUDE_FROM_GLOBAL_ERROR_HANDLING_URLS } from '../models';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  const nzMessageService = inject(NzMessageService);
  const router = inject(Router);

  const handleError = (error: HttpErrorResponse): void => {
    if (error.status === 401) {
      router.navigate(['/login']);
      return;
    }

    nzMessageService.error(error.error.message);
  };

  loading.setLoading(true, req.url, req.method);
  return next(req).pipe(
    // delay(150),
    catchError((error: HttpErrorResponse) => {
      if (
        !EXCLUDE_FROM_GLOBAL_ERROR_HANDLING_URLS.some((url) =>
          req.url.includes(url)
        )
      ) {
        handleError(error);
      }
      return throwError(error);
    }),
    finalize(() => {
      loading.setLoading(false, req.url, req.method);
    })
  );
};
