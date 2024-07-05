import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CardComponent } from '../../../../components';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesManagersService } from '../services';
import { ViewMode } from '../../../../core/models';
import { SalesManager, SalesManagerDto } from '../models';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export type AddSalesManagerForm = {
  username: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  password: FormControl<string | null>;
};

const Modules = [NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, ReactiveFormsModule, TranslateModule];
const Components = [CardComponent];

@Component({
  selector: 'app-add-sales-manager',
  standalone: true,
  imports: [...Modules, ...Components, ],
  templateUrl: './add-sales-manager.component.html',
  styleUrl: './add-sales-manager.component.scss'
})
export class AddSalesManagerComponent implements OnInit, OnDestroy {
  #fb = inject(NonNullableFormBuilder);
  #nzMessageService = inject(NzMessageService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #salesManagerService = inject(SalesManagersService);
  #translateService = inject(TranslateService);

  salesManagerId = input<number>();
  submitBtnTitle: string = this.#translateService.instant('ADD');
  headlineTitle: string = this.#translateService.instant('ADD_SALES_MANAGER');

  passwordTitle: string = this.#translateService.instant('PASSWORD');
  routeSubscription!: Subscription;

  salesManagerForm: FormGroup<AddSalesManagerForm> = this.#fb.group({
    username: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: [null as string | null],
  });

  isEditMode = computed(() => this.#route.snapshot.url[0].path === ViewMode.Edit);


  ngOnInit(): void {
    if (this.isEditMode()) {
      if (!this.salesManagerId()) {
        this.#nzMessageService.error(this.#translateService.instant('SALES_MANAGER_ID_ERROR'));
        this.#router.navigate(['../list'], { relativeTo: this.#route });
      }

      this.submitBtnTitle = this.#translateService.instant('EDIT');
      this.headlineTitle = this.#translateService.instant('SALES_MANAGER_EDIT');
      this.passwordTitle = this.#translateService.instant('NEW_PASSWORD');

      this.getSalesManager();
    }
  }

  getSalesManager() {
    this.routeSubscription = this.#route.data.subscribe({
      next: (data) => {
        const salesManager: SalesManager = (data['salesManagers']);
        this.salesManagerForm.setValue({
          username: salesManager.username,
          firstName: salesManager.firstName,
          lastName: salesManager.lastName,
          password: null,
        });
      }
    })
  }

  submitForm() {
    const formValue = this.salesManagerForm.getRawValue();
    const command: Partial<SalesManagerDto> = {
      username: formValue.username,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      ...(formValue.password ? { password: formValue.password } : {}),
    };

    if (this.isEditMode()) {
      const salesManagerId = this.salesManagerId();
      salesManagerId &&
      this.#salesManagerService.updateSalesManager(salesManagerId, command as SalesManagerDto).subscribe({
        next: () => {
          this.#nzMessageService.success(this.#translateService.instant('SALES_MANAGER_EDIT_SUCCESS'));
          this.#router.navigate(['../list'], { relativeTo: this.#route });
        },
      });
    } else {
      this.#salesManagerService.registerSalesManager(command as SalesManagerDto).subscribe({
        next: () => {
          this.#nzMessageService.success(this.#translateService.instant('SALES_MANAGER_ADD_SUCCESS'));
          this.#router.navigate(['../list'], { relativeTo: this.#route });
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.isEditMode()) this.routeSubscription.unsubscribe();
  }
}
