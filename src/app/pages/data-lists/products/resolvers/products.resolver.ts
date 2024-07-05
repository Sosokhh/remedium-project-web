import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ProductsService } from '../services';
import { Product } from '../models';
import { catchError, EMPTY } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';


export const productsResolver: ResolveFn<Product> = (route, state) => {
  const productService = inject(ProductsService);
  const router = inject(Router);
  const nzMessageService = inject(NzMessageService);
  const id = route.queryParams['productId'];

  return productService.getProductById(id).pipe(
    catchError(error => {
      router.navigate(['../list']);
      nzMessageService.error(error.error.message);
      return EMPTY
    })
  );
};
