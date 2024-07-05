import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class DecoratorService {
  private static nzModalService: NzModalService | undefined = undefined;
  public constructor(nzModalService: NzModalService) {
    DecoratorService.nzModalService = nzModalService;
  }
  public static getNzModalService(): NzModalService {
    if (!DecoratorService.nzModalService) {
      throw new Error('DecoratorService not initialized');
    }
    return DecoratorService.nzModalService;
  }
}
