import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductFilterModel, ProductOrderSell } from '../models';
import { PAGE_SIZE, TABLE_DATA_INITIAL, TableData } from '../../../../core/models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Product, ProductDto } from '../models';
import { catchError, debounceTime, distinctUntilChanged, finalize, Observable, of, tap } from 'rxjs';
import { getHttpParams } from '../../../../core/utils';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  #http = inject(HttpClient);

  #filterModel = signal<ProductFilterModel>({
    page: 1,
    limit: PAGE_SIZE,
  });

  tableData: WritableSignal<TableData<Product>> = signal(TABLE_DATA_INITIAL);
  filterModel$ = toObservable(this.#filterModel);
  loading: boolean = false;

  get filterModel(): ProductFilterModel {
    return this.#filterModel();
  }

  set filterModel(value: Partial<ProductFilterModel>) {
    this.#filterModel.update((filterModel) => (filterModel = { ...filterModel, ...value }));
  }

  constructor() {
    this.filterModel$
      .pipe(
        takeUntilDestroyed(),
        debounceTime(200),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => (this.loading = true)),
        debounceTime(200),
        tap((filterModel: ProductFilterModel) => this.getProducts(filterModel)),
      )
      .subscribe();
  }

  getProducts(productFilter?: ProductFilterModel) {
    const filters = productFilter || this.filterModel;
    const params = getHttpParams(filters);

    return this.#http
      .get<TableData<Product>>(`${environment.apiURL}/products`, {
        params,
      })
      .pipe(
        tap(() => (this.loading = true)),
        catchError(() => {
          this.loading = false;
          return of(TABLE_DATA_INITIAL);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (tableData) => this.tableData.set(tableData),
      });
  }

  getProductById(productId: number): Observable<Product> {
    return this.#http.get<Product>(`${environment.apiURL}/products/${productId}`);
  }

  addProduct(command: ProductDto): Observable<Product> {
    return this.#http.post<Product>(`${environment.apiURL}/products/add`, command).pipe(tap(() => this.getProducts()));
  }

  updateProduct(productId: number, command: ProductDto): Observable<Product> {
    return this.#http
      .put<Product>(`${environment.apiURL}/products/edit/${productId}`, command)
      .pipe(tap(() => this.getProducts()));
  }

  deactivateProduct(productId: number): Observable<void> {
    return this.#http
      .delete<void>(`${environment.apiURL}/products/remove/${productId}`)
      .pipe(tap(() => this.getProducts()));
  }

  sellProduct(order: ProductOrderSell) {
    return this.#http.post(`${environment.apiURL}/orders/sell`, order)
      .pipe(tap(() => this.getProducts()));

  }


}
