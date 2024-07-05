import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SalesManagerOrder, SalesManagerOrderFilterModel } from '../models';
import { environment } from '../../../../../environments/environment';
import { catchError, debounceTime, distinctUntilChanged, finalize, of, tap } from 'rxjs';
import { PAGE_SIZE, TABLE_DATA_INITIAL, TableData } from '../../../../core/models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { getHttpParams } from '../../../../core/utils';

@Injectable({
  providedIn: 'root'
})
export class SalesManagerOrdersService {
  #http = inject(HttpClient);

  #filterModel = signal<SalesManagerOrderFilterModel>({
    page: 1,
    limit: PAGE_SIZE,
  });

  filterModel$ = toObservable(this.#filterModel);
  salesManagerId: WritableSignal<number> = signal(0);
  tableData: WritableSignal<TableData<SalesManagerOrder>> = signal(TABLE_DATA_INITIAL);
  loading: boolean = false;

  get filterModel(): SalesManagerOrderFilterModel {
    return this.#filterModel();
  }

  set filterModel(value: Partial<SalesManagerOrderFilterModel>) {
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
        tap((filterModel: SalesManagerOrderFilterModel) => this.getSalesManagerOrders(filterModel)),
      )
      .subscribe();
  }

  getSalesManagerOrders(salesManagerFilter?: SalesManagerOrderFilterModel): void {
    const filters = salesManagerFilter || this.filterModel;
    const params = getHttpParams(filters);

    this.#http
      .get<TableData<SalesManagerOrder>>(`${environment.apiURL}/orders/${this.salesManagerId()}`,{
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
