import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductsService } from './services';
import { Command, CommandPlaceHolder } from '../../../components/command/model/command.model';
import { Product, ProductFilterModel } from './models';
import { TableData } from '../../../core/models';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Confirmable } from '../../../core/decorators';
import { CommandComponent } from '../../../components';
import { NgClass } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FilterProductsComponent } from './filter-products/filter-products.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const Modules = [NgClass, NzTableModule, NzIconModule, TranslateModule];
const Components = [CommandComponent, FilterProductsComponent];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [...Modules, ...Components ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #nzMessageService = inject(NzMessageService);
  #productService = inject(ProductsService);
  #translateService = inject(TranslateService);

  commandPlaceHolders: typeof CommandPlaceHolder = CommandPlaceHolder;
  commands: Command[] = [];
  tableCommands: Command<Product>[] = [];


  productsData: Signal<TableData<Product>> = computed(() => this.#productService.tableData());
  tableFilterModel: Signal<ProductFilterModel> = computed(() => this.#productService.filterModel);

  get tableLoading(): boolean {
    return this.#productService.loading;
  }

  constructor() {

  }

  ngOnInit() {

    this.initCommands();
    this.initTableCommands();
  }

  initCommands() {
      const addProductCommand: Command = {
        routerLink: '../add',
        icon: 'plus',
        visible: () => true,
        isLink: true,
        iconButtonType: 'primary',
        tooltipTitle: this.#translateService.instant('ADD_PRODUCT'),
      };

      this.commands = [addProductCommand];
  }

  initTableCommands() {
    const sellProductTableCommand: Command<Product> = {
      action: (Product: Product) => this.getOrder(Product),
      isLink: false,
      icon: 'shopping-cart',
      visible: () => true,
      tooltipTitle: this.#translateService.instant('SELL_PRODUCT'),
    };
    const editProductTableCommand: Command<Product> = {
      action: (Product: Product) => this.goToEditProduct(Product),
      isLink: false,
      icon: 'edit',
      visible: () => true,
      tooltipTitle: this.#translateService.instant('EDIT'),
    };
    const deactivateProductTableCommand: Command<Product> = {
      action: (Product: Product) => this.removeProduct(Product),
      isLink: false,
      icon: 'minus-circle',
      visible: () => true,
      tooltipTitle: this.#translateService.instant('REMOVE'),
    };
    this.tableCommands = [sellProductTableCommand, editProductTableCommand, deactivateProductTableCommand];
  }

  goToEditProduct(product: Product) {
    this.#router.navigate(['../edit'], {
      relativeTo: this.#route,
      queryParams: {
        productId: product.id,
      },
    });
  }

  // this.#translateService.instant('CANCEL_PRODUCT')
  @Confirmable({ nzContent: 'ნამდვილად გსურთ პროდუქტის გაუქმება?' })
  removeProduct(product: Product) {
    this.#productService.deactivateProduct(product.id).subscribe({
      next: () => {
        this.#nzMessageService.success(this.#translateService.instant('PRODUCT_CANCEL_SUCCESS'));
      },
    });
  }

  onFilter(filter: Partial<ProductFilterModel>) {
    this.#productService.filterModel = {...this.tableFilterModel(), ...filter, page: 1};
  }

  onTableParamsChange(event: NzTableQueryParams) {
    const { pageIndex, pageSize } = event;

    this.#productService.filterModel = {
      page: pageIndex,
      limit: pageSize,
    };
  }

  private getOrder(product: Product) {
    this.#router.navigate(['../order'], {
      relativeTo: this.#route,
      queryParams: {
        productId: product.id,
      },
    });
  }
}
