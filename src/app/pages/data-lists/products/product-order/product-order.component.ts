import { Component, inject, input } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CardComponent } from '../../../../components';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductOrderSell } from '../models';

export type AddProductOrderForm = {
  quantity: FormControl <number | null>;
}

const Modules = [NzButtonModule, NzFormModule, NzInputModule, ReactiveFormsModule];
const Components = [CardComponent];

@Component({
  selector: 'app-product-order',
  standalone: true,
  imports: [...Modules, ...Components, TranslateModule],
  templateUrl: './product-order.component.html',
  styleUrl: './product-order.component.scss'
})
export class ProductOrderComponent {
  #fb = inject(NonNullableFormBuilder);
  #nzMessageService = inject(NzMessageService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #productService = inject(ProductsService);
  #translateService = inject(TranslateService);

  productId = input<number>();

  orderForm: FormGroup<AddProductOrderForm> = this.#fb.group({
    quantity: [null as number | null, [Validators.required]],
  });

  submitForm() {
    const command: ProductOrderSell = {
      ...(this.orderForm.getRawValue() as ProductOrderSell),
      productId: this.productId()
    };

      this.#productService.sellProduct(command).subscribe({
        next: () => {
          this.#nzMessageService.success(this.#translateService.instant('PRODUCT_SELL_SUCCESS'));
          this.#router.navigate(['../list'], { relativeTo: this.#route });
        },
      });
  }


}
