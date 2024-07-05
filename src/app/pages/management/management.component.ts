import { Component, inject } from '@angular/core';
import { RouteModel } from '../../core/models';
import { NzCardComponent, NzCardGridDirective } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    NzCardComponent,
    RouterLink,
    NzCardGridDirective,
    NgStyle
  ],
  templateUrl: './management.component.html',
})
export class ManagementComponent {
  #translateService = inject(TranslateService);
  gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  routes: RouteModel[] = [
    { path: 'profile', title: this.#translateService.instant('PROFILE') },
  ];
}
