import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DecoratorService, LoadingService, TranslationService } from './core/services';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export class Loading {
  public static isLoadingForGet = false;
  public static isLoadingForRest = false;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NzSpinComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DecoratorService, NzModalService],

})
export class AppComponent {
  title = 'remedium-project-web';
  private _ = inject(DecoratorService);
  private _loadingService = inject(LoadingService);
  #translationService = inject(TranslationService);
  #translateService = inject(TranslateService);

  get isLoadingForGet(): boolean {
    return Loading.isLoadingForGet;
  }

  get isLoadingForRest(): boolean {
    return Loading.isLoadingForRest;
  }

  constructor() {
    effect(() => {
      Loading.isLoadingForGet = this._loadingService.loadingSubForGet();
      Loading.isLoadingForRest = this._loadingService.loadingSubForRest();
    });
  }

  handleChange($event: Event) {

  }
}
