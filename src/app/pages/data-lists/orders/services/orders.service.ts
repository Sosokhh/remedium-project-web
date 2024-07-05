import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PAGE_SIZE, TABLE_DATA_INITIAL, TableData } from '../../../../core/models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Order } from '../models';
import { OrderFilterModel } from '../models';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, tap } from 'rxjs';
import { getHttpParams } from '../../../../core/utils';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  #http = inject(HttpClient);

  #filterModel = signal<OrderFilterModel>({
    page: 1,
    limit: PAGE_SIZE,
  });

  filterModel$ = toObservable(this.#filterModel);
  tableData: WritableSignal<TableData<Order>> = signal(TABLE_DATA_INITIAL);
  loading: boolean = false;

  get filterModel(): OrderFilterModel {
    return this.#filterModel();
  }

  set filterModel(value: Partial<OrderFilterModel>) {
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
        tap((filterModel: OrderFilterModel) => this.getOrders(filterModel)),
      )
      .subscribe();
  }

  getOrders(orderFilter?: OrderFilterModel): void {
    const filters = orderFilter || this.filterModel;
    const params = getHttpParams(filters);

    this.#http
      .get<TableData<Order>>(`${environment.apiURL}/orders`,{
        params
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
}
