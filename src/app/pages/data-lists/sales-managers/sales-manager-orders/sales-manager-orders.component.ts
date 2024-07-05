import { Component, computed, inject, input, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SalesManagerOrdersService } from '../services';
import { SalesManagerOrder, SalesManagerOrderFilterModel } from '../models';
import { DatePipe, NgClass } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TableData } from '../../../../core/models';
import { FilterSalesManagerOrders } from './filter-sales-manager-orders/filter-sales-manager-orders.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const Modules = [NgClass, NzTableModule, NzIconModule];

@Component({
  selector: 'app-sales-manager-orders',
  standalone: true,
  imports: [...Modules, DatePipe, FilterSalesManagerOrders, TranslateModule],
  templateUrl: './sales-manager-orders.component.html',
  styleUrl: './sales-manager-orders.component.scss'
})
export class SalesManagerOrdersComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #nzMessageService = inject(NzMessageService);
  #salesManagerOrderService = inject(SalesManagerOrdersService);
  #translateService = inject(TranslateService);

  salesManagerId = input.required<number>();
  salesManagerOrdersData: Signal<TableData<SalesManagerOrder>> = computed(() => this.#salesManagerOrderService.tableData());
  tableFilterModel: Signal<SalesManagerOrderFilterModel> = computed(() => this.#salesManagerOrderService.filterModel);


  get tableLoading(): boolean {
    return this.#salesManagerOrderService.loading;
  }


  ngOnInit() {
    if (this.salesManagerId()) {
      this.#salesManagerOrderService.salesManagerId.set(this.salesManagerId());
      this.#salesManagerOrderService.getSalesManagerOrders();
    } else {
      this.#nzMessageService.error(this.#translateService.instant('SALES_MANAGER_ID_ERROR'));
      this.#router.navigate(['../list'], { relativeTo: this.#route });
    }
  }


  onFilter(filter: Partial<SalesManagerOrderFilterModel>) {
    this.#salesManagerOrderService.filterModel = {...this.tableFilterModel(), ...filter, page: 1};
  }

  onTableParamsChange(event: NzTableQueryParams) {
    const { pageIndex, pageSize } = event;

    this.#salesManagerOrderService.filterModel = {
      page: pageIndex,
      limit: pageSize,
    };
  }


}
