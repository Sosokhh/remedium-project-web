import { Component, computed, inject, Signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommandComponent } from '../../../components';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SalesManagersService } from './services';
import { Command, CommandPlaceHolder } from '../../../components/command/model/command.model';
import { SalesManager, SalesManagerFilterModel } from './models';
import { TableData } from '../../../core/models';
import { FilterSalesManagersComponent } from './filter-sales-managers/filter-sales-managers.component';
import { Confirmable } from '../../../core/decorators';
import { GetFullPricePipe } from './pipes';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const Modules = [NgClass, NzTableModule, NzIconModule, TranslateModule];
const Components = [CommandComponent, FilterSalesManagersComponent ];
const Pipes = [GetFullPricePipe, DatePipe];

@Component({
  selector: 'app-sales-managers',
  standalone: true,
  imports: [...Modules, ...Components, ...Pipes],
  templateUrl: './sales-managers.component.html',
  styleUrl: './sales-managers.component.scss'
})
export class SalesManagersComponent  {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #nzMessageService = inject(NzMessageService);
  #salesManagerService = inject(SalesManagersService);
  #translateService = inject(TranslateService);

  commandPlaceHolders: typeof CommandPlaceHolder = CommandPlaceHolder;
  commands: Command[] = [];
  tableCommands: Command<SalesManager>[] = [];


  salesManagersData: Signal<TableData<SalesManager>> = computed(() => this.#salesManagerService.tableData());
  tableFilterModel: Signal<SalesManagerFilterModel> = computed(() => this.#salesManagerService.filterModel);

  get tableLoading(): boolean {
    return this.#salesManagerService.loading;
  }

  constructor() {
    this.initCommands();
    this.initTableCommands();
  }

  initCommands() {
    const addSalesManagerCommand: Command = {
      routerLink: '../add',
      icon: 'plus',
      visible: () => true,
      isLink: true,
      iconButtonType: 'primary',
      tooltipTitle: this.#translateService.instant('ADD_SALES_MANAGERS'),
    };

    this.commands = [addSalesManagerCommand];
  }

  initTableCommands() {
    const showOrdersTableCommand: Command<SalesManager> = {
      action: (salesManager: SalesManager) => this.#showOrders(salesManager),
      isLink: false,
      icon: 'edit',
      visible: () => true,
      tooltipTitle: this.#translateService.instant('SEE_SALES_MANAGER_ORDERS'),
    };
    const editSalesManagerTableCommand: Command<SalesManager> = {
      action: (salesManager: SalesManager) => this.goToEditSalesManager(salesManager),
      isLink: false,
      icon: 'edit',
      visible: () => true,
      tooltipTitle: this.#translateService.instant('EDIT'),
    };
    const deactivateSalesManagerTableCommand: Command<SalesManager> = {
      action: (salesManager: SalesManager) => this.deactivateSalesManager(salesManager),
      isLink: false,
      icon: 'minus-circle',
      visible: () => true,
      tooltipTitle: this.#translateService.instant('REMOVE'),
    };
    this.tableCommands = [showOrdersTableCommand, editSalesManagerTableCommand, deactivateSalesManagerTableCommand];
  }

  goToEditSalesManager(salesManager: SalesManager) {
    this.#router.navigate(['../edit'], {
      relativeTo: this.#route,
      queryParams: {
        salesManagerId: salesManager.id,
      },
    });
  }

  @Confirmable({ nzContent: 'ნამდვილად გსურთ გაყიდვების მენეჯერის გაუქმება?' })
  deactivateSalesManager(salesManager: SalesManager) {
    this.#salesManagerService.deactivateSalesManager(salesManager.id).subscribe({
      next: () => {
        this.#nzMessageService.success( this.#translateService.instant('SALES_MANAGER_CANCEL_SUCCESS')``);
      },
    });
  }

  onFilter(filter: Partial<SalesManagerFilterModel>) {
    this.#salesManagerService.filterModel = {...this.tableFilterModel(), ...filter, page: 1};
  }

  onTableParamsChange(event: NzTableQueryParams) {
    const { pageIndex, pageSize } = event;

    this.#salesManagerService.filterModel = {
      page: pageIndex,
      limit: pageSize,
    };
  }

  #showOrders(salesManager: SalesManager) {
    this.#router.navigate(['../detail-list', salesManager.id], {
      relativeTo: this.#route,
    });
  }
}
