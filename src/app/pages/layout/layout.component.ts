import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services';
import { RouteModel } from '../../core/models';
import { Confirmable } from '../../core/decorators';
import { NzContentComponent, NzHeaderComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { NzBreadCrumbComponent } from 'ng-zorro-antd/breadcrumb';
import { FormsModule } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { TranslationService } from '../../core/services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

const Components = [
  NzLayoutComponent,
  NzSiderComponent,
  NzSubMenuComponent,
  NzMenuItemComponent,
  NzHeaderComponent,
  NzBreadCrumbComponent,
  NzContentComponent,
  NzOptionComponent,
  NzSelectComponent,
]

const Modules = [
  FormsModule,
  TranslateModule
]

const Directives = [
  NzIconDirective,
  NzTooltipDirective,
  NzMenuDirective,
]

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    ...Modules,
    ...Components,
    ...Directives,
    RouterLink,
    NgClass,
    RouterOutlet,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  #authService = inject(AuthService);
  #translationService = inject(TranslationService);
  #translateService = inject(TranslateService);
  isCollapsed = true;

  dataListsRoutes: RouteModel[] = [
    { path: 'data-lists/products', title: this.#translateService.instant('PRODUCTS') },
    { path: 'data-lists/sales-managers', title: this.#translateService.instant('SALES_MANAGERS') },
    { path: 'data-lists/orders', title: this.#translateService.instant('ORDERS_HISTORY') },
  ];
  selectedLang: string | null = '';

  constructor() {
    this.selectedLang = localStorage.getItem('lang');
  }


  @Confirmable({ nzContent: 'ნამდვილად გსურთ სისტემიდან გასვლა?' })
  logout() {
    this.#authService.doLogoutUser();
  }

  handleChange(lang: string) {
    this.#translationService.translateLanguageTo(lang);
    window.location.reload();
  }
}
