import { Component, computed, inject, Signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { OrdersService } from './services';
import { TableData } from '../../../core/models';
import { Order } from './models';
import { OrderFilterModel } from './models';
import { FilterOrdersComponent } from './filter-orders/filter-orders.component';
import { TranslateModule } from '@ngx-translate/core';

const Modules = [NgClass, NzTableModule, NzIconModule, TranslateModule]
const Components = [FilterOrdersComponent];
const Pipes = [DatePipe]


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [...Modules, ...Components, ...Pipes ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  #orderService = inject(OrdersService);
  ordersData: Signal<TableData<Order>> = computed(() => this.#orderService.tableData());
  tableFilterModel: Signal<OrderFilterModel> = computed(() => this.#orderService.filterModel);

  get tableLoading(): boolean {
    return this.#orderService.loading;
  }

  onFilter(filter: Partial<OrderFilterModel>) {
    this.#orderService.filterModel = {...this.tableFilterModel(), ...filter, page: 1};
  }

  onTableParamsChange(event: NzTableQueryParams) {
    const { pageIndex, pageSize } = event;

    this.#orderService.filterModel = {
      page: pageIndex,
      limit: pageSize,
    };
  }

}
