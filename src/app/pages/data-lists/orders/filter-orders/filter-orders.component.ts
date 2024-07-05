import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommandComponent } from '../../../../components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrderFilterModel } from '../models';
import { OrdersService } from '../services';
import { Command } from '../../../../components/command/model/command.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type orderFilterForm = {
  quantity: FormControl<number | null>;
};

const Modules = [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzCollapseModule, TranslateModule];
const Components = [CommandComponent];

@Component({
  selector: 'app-filter-orders',
  standalone: true,
  imports: [...Modules, ...Components],
  templateUrl: './filter-orders.component.html',
  styleUrl: './filter-orders.component.scss'
})
export class FilterOrdersComponent {
  #fb = inject(NonNullableFormBuilder);
  #orderService = inject(OrdersService);
  #translateService = inject(TranslateService);

  filter = output<Partial<OrderFilterModel>>();

  filterForm: FormGroup<orderFilterForm> = this.#fb.group({
    quantity: [null as number | null],
  });

  commands: Command[] = [];


  constructor() {
    this.#orderService.filterModel$.pipe(takeUntilDestroyed()).subscribe({
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
