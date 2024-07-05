import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, TranslationService } from '../../core/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthRequest } from '../../core/models';
import { CardComponent } from '../../components';
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';

const Components = [
  CardComponent,
  NzFormItemComponent,
  NzFormControlComponent,
  NzInputGroupComponent,
  NzButtonComponent,
  NzSelectComponent,
  NzOptionComponent,
]
const Modules = [
  FormsModule,
  TranslateModule,
  ReactiveFormsModule,
]
const Directives = [
  NzInputDirective,
  NzRowDirective,
  NzColDirective,
  NzFormDirective,
  NzIconDirective,
]

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ...Modules, ...Components, ...Directives,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  #fb = inject(NonNullableFormBuilder);
  #destroyRef = inject(DestroyRef);
  #authService = inject(AuthService);
  #translationService = inject(TranslationService);
  selectedLang: string | null = '';

  loginForm: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }> = this.#fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor() {
    this.selectedLang = localStorage.getItem('lang');
  }

  passwordVisible = signal(false);

  submitLoginForm(): void {
    if (this.loginForm.valid) {
      const authRequest = this.loginForm.value as AuthRequest;

      this.#authService.login(authRequest).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe();
    } else {
      Object.values(this.loginForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleChange(lang: string) {
    this.#translationService.translateLanguageTo(lang);
    window.location.reload();
  }
}
