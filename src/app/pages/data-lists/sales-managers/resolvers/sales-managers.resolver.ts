import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, EMPTY } from 'rxjs';
import { SalesManager } from '../models';
import { SalesManagersService } from '../services';

export const salesManagersResolver: ResolveFn<SalesManager> = (route, state) => {
  const salesManagerService = inject(SalesManagersService);
  const router = inject(Router);
  const nzMessageService = inject(NzMessageService);
  const id = route.queryParams['salesManagerId'];

  return salesManagerService.getSalesManagerById(id).pipe(
    catchError(error => {
      router.navigate(['../list']);
      nzMessageService.error(error.error.message);
      return EMPTY
    })
  );};
