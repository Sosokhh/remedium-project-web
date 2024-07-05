import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommandComponent } from '../../../../components';
import { SalesManagersService } from '../services';
import { SalesManagerFilterModel } from '../models';
import { Command } from '../../../../components/command/model/command.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { DtoService } from '../../../../core/services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzTableCellDirective, NzThMeasureDirective } from 'ng-zorro-antd/table';

type SalesManagerFilterForm = {
  username: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  created_at: FormControl<Date | null>;
};

const Modules = [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzCollapseModule, TranslateModule];
const Components = [CommandComponent, NzDatePickerComponent];
const Directives  = [NzTableCellDirective, NzThMeasureDirective];

@Component({
  selector: 'app-filter-sales-managers',
  standalone: true,
  imports: [...Modules, ...Components, ...Directives ],
  templateUrl: './filter-sales-managers.component.html',
  styleUrl: './filter-sales-managers.component.scss'
})
export class FilterSalesManagersComponent {
  #fb = inject(NonNullableFormBuilder);
  #salesManagerService = inject(SalesManagersService);
  #dtoService = inject(DtoService);
  #translateService = inject(TranslateService);
  filter = output<Partial<SalesManagerFilterModel>>();

  filterForm: FormGroup<SalesManagerFilterForm> = this.#fb.group({
    username: [''],
    firstName: [''],
    lastName: [''],
    created_at: [null as Date | null],
  });

  commands: Command[] = [];

  constructor() {
    this.#salesManagerService.filterModel$.pipe(takeUntilDestroyed()).subscribe({
      next: (filterModel) => {
        this.filterForm.setValue({
          username: filterModel.username ?? '',
          firstName: filterModel.firstName ?? '',
          lastName: filterModel.lastName ?? '',
          created_at: filterModel.created_at ?? null,
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
      tooltipTitle: this.#translateService.instant('FILTER')
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
    const res = this.#dtoService.transformDates(this.filterForm.value);
    this.filter.emit(res);
  }

  resetForm() {
    this.filterForm.reset();
    this.filter.emit(this.filterForm.value);
  }

}
