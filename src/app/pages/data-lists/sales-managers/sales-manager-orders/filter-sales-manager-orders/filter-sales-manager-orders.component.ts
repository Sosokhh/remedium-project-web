import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SalesManagerOrdersService } from '../../services';
import { SalesManagerOrderFilterModel } from '../../models';
import { Command } from '../../../../../components/command/model/command.model';
import { CommandComponent } from '../../../../../components';

type salesManagerOrderFilterForm = {
  quantity: FormControl<number | null>;
};

const Modules = [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzCollapseModule, TranslateModule];
const Components = [CommandComponent];

@Component({
  selector: 'app-filter-sales-manager-orders',
  standalone: true,
  imports: [...Modules, ...Components],
  templateUrl: './filter-sales-manager-orders.component.html',
  styleUrl: './filter-sales-manager-orders.component.scss'
})
export class FilterSalesManagerOrders {
  #fb = inject(NonNullableFormBuilder);
  #salesManagerOrderService = inject(SalesManagerOrdersService);
  #translateService = inject(TranslateService);

  filter = output<Partial<SalesManagerOrderFilterModel>>();

  filterForm: FormGroup<salesManagerOrderFilterForm> = this.#fb.group({
    quantity: [null as number | null],
  });

  commands: Command[] = [];


  constructor() {
    this.#salesManagerOrderService.filterModel$.pipe(takeUntilDestroyed()).subscribe({
      next: (filterModel) => {
        this.filterForm.setValue({
          quantity: filterModel.quantity ?? null,
        });
      },
    });

    this.initCommands();
  }

  initCommands() {
    const filterCommand: Command = {
      action: () => this.submitForm(),
      icon: 'search',
      visible: () => true,
      isLink: false,
      iconButtonType: 'primary',
      tooltipTitle: this.#translateService.instant('FILTER'),
    };

    const resetFilterCommand: Command = {
      action: () => this.resetForm(),
      icon: 'clear',
      visible: () => true,
      isLink: false,
      tooltipTitle: this.#translateService.instant('CLEAR_FILTER'),
    };

    this.commands = [resetFilterCommand, filterCommand];
  }

  submitForm() {
    this.filter.emit(this.filterForm.value);
  }

  resetForm() {
    this.filterForm.reset();
    this.filter.emit(this.filterForm.value);
  }
}
