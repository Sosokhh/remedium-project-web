import { Component, computed, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CardComponent } from '../../../../components';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductsService } from '../services';
import { ViewMode } from '../../../../core/models';
import { Product, ProductDto } from '../models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export type AddProductForm = {
  name: FormControl<string>;
  price: FormControl <number | null>;
  quantity: FormControl <number | null>;
}

const Modules = [NzButtonModule, NzFormModule, NzInputModule, NzSelectModule, ReactiveFormsModule, TranslateModule];
const Components = [CardComponent];

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [...Modules, ...Components],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit, OnDestroy {
  #fb = inject(NonNullableFormBuilder);
  #nzMessageService = inject(NzMessageService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #productService = inject(ProductsService);
  #translateService = inject(TranslateService);

  productId = input<number>();
  submitBtnTitle: string = this.#translateService.instant('ADD');
  headlineTitle: string = this.#translateService.instant('ADD_PRODUCT');
  routeSubscription!: Subscription;

  productForm: FormGroup<AddProductForm> = this.#fb.group({
    name: ['', [Validators.required]],
    price: [null as number | null, [Validators.required]],
    quantity: [null as number | null, [Validators.required]],
  });

  isEditMode = computed(() => this.#route.snapshot.url[0].path === ViewMode.Edit);

  ngOnInit(): void {
    if (this.isEditMode()) {
      if (!this.productId()) {
        this.#nzMessageService.error(this.#translateService.instant('PRODUCT_ID_ERROR'));
        this.#router.navigate(['../list'], {relativeTo: this.#route});
      }

      this.submitBtnTitle = this.#translateService.instant('EDIT');
      this.headlineTitle = this.#translateService.instant('EDIT_PRODUCT');

      this.getProduct();
    }
  }

  getProduct() {
   this.routeSubscription = this.#route.data.subscribe({
      next: (data) => {
        const product: Product = (data['products']);
        this.productForm.setValue({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        });
      }
    })
  }

  submitForm() {
    const command: ProductDto = {
      ...(this.productForm.getRawValue() as ProductDto),
    };

    if (this.isEditMode()) {
      const productId = this.productId();
      productId &&
      this.#productService.updateProduct(productId, command).subscribe({
        next: (res) => {
          this.#nzMessageService.success(this.#translateService.instant('PRODUCT_EDIT_SUCCESS'));
          this.#router.navigate(['../list'], { relativeTo: this.#route });
        },
      });
    } else {
      this.#productService.addProduct(command).subscribe({
        next: (res) => {
          this.#nzMessageService.success(this.#translateService.instant('PRODUCT_ADD_SUCCESS'));
          this.#router.navigate(['../list'], { relativeTo: this.#route });
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.isEditMode()) this.routeSubscription.unsubscribe();
  }

}
