import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SalesManager, SalesManagerDto, SalesManagerFilterModel } from '../models';
import { PAGE_SIZE, TABLE_DATA_INITIAL, TableData } from '../../../../core/models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, finalize, Observable, of, tap } from 'rxjs';
import { getHttpParams } from '../../../../core/utils';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesManagersService {
  #http = inject(HttpClient);

  #filterModel = signal<SalesManagerFilterModel>({
    page: 1,
    limit: PAGE_SIZE,
  });

  filterModel$ = toObservable(this.#filterModel);
  tableData: WritableSignal<TableData<SalesManager>> = signal(TABLE_DATA_INITIAL);
  loading: boolean = false;

  get filterModel(): SalesManagerFilterModel {
    return this.#filterModel();
  }

  set filterModel(value: Partial<SalesManagerFilterModel>) {
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
        tap((filterModel: SalesManagerFilterModel) => this.getSalesManagers(filterModel)),
      )
      .subscribe();
  }

  getSalesManagers(salesManagerFilter?: SalesManagerFilterModel): void {
    const filters = salesManagerFilter || this.filterModel;
    const params = getHttpParams(filters);

    this.#http
      .get<TableData<SalesManager>>(`${environment.apiURL}/sales-managers`, {
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

  getSalesManagerById(salesManagerId: number): Observable<SalesManager> {
    return this.#http.get<SalesManager>(`${environment.apiURL}/sales-managers/${salesManagerId}`);
  }

  registerSalesManager(command: SalesManagerDto): Observable<SalesManager> {
    return this.#http.post<SalesManager>(`${environment.apiURL}/sales-managers/register`, command).pipe(tap(() => this.getSalesManagers()));
  }

  updateSalesManager(salesManagerId: number, command: SalesManagerDto): Observable<SalesManager> {
    return this.#http
      .put<SalesManager>(`${environment.apiURL}/sales-managers/edit/${salesManagerId}`, command)
      .pipe(tap(() => this.getSalesManagers()));
  }

  deactivateSalesManager(salesManagerId: number): Observable<void> {
    return this.#http
      .delete<void>(`${environment.apiURL}/sales-managers/remove/${salesManagerId}`)
      .pipe(tap(() => this.getSalesManagers()));
  }
}
