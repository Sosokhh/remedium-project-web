import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../services';
import { ProductFilterModel } from '../models';
import { Command } from '../../../../components/command/model/command.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommandComponent } from '../../../../components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type ProductFilterForm = {
  name: FormControl<string>;
};

const Modules = [ReactiveFormsModule, NzFormModule, NzInputModule, NzSelectModule, NzCollapseModule, TranslateModule];
const Components = [CommandComponent];

@Component({
  selector: 'app-filter-products',
  standalone: true,
  imports: [...Modules, ...Components, ],
  templateUrl: './filter-products.component.html',
  styleUrl: './filter-products.component.scss'
})
export class FilterProductsComponent {
  #fb = inject(NonNullableFormBuilder);
  #productService = inject(ProductsService);
  #translateService = inject(TranslateService);

  filter = output<Partial<ProductFilterModel>>();

  filterForm: FormGroup<ProductFilterForm> = this.#fb.group({
    name: [''],
  });

  commands: Command[] = [];

  constructor() {
    this.#productService.filterModel$.pipe(takeUntilDestroyed()).subscribe({
      next: (filterModel) => {
        this.filterForm.setValue({
          name: filterModel.name ?? '',
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
