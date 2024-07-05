import { Component, inject } from '@angular/core';
import { RouteModel } from '../../core/models';
import { NzCardComponent, NzCardGridDirective } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-lists',
  standalone: true,
  imports: [
    NzCardComponent,
    RouterLink,
    NzCardGridDirective,
    NgStyle
  ],
  templateUrl: './data-lists.component.html',
  styleUrl: './data-lists.component.scss'
})
export class DataListsComponent {
  #translateService = inject(TranslateService);

  gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  routes: RouteModel[] = [
    { path: 'products', title: this.#translateService.instant('PRODUCTS') },
    { path: 'sales-managers', title: this.#translateService.instant('SALES_MANAGERS') },
    { path: 'order-history', title: this.#translateService.instant('ORDER_HISTORY') },

  ];
}
