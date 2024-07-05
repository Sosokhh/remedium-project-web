import { ModalOptions } from 'ng-zorro-antd/modal';
import { DecoratorService } from '../services';

export function Confirmable(options?: ModalOptions) {
  const modalService = DecoratorService.getNzModalService();

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    let config: ModalOptions = {
      nzTitle: 'შეკითხვა',
      nzContent: 'ნამდვილად გსურთ ამ მოქმედების განხორციელება?',
      nzOkText: 'დიახ',
      nzCancelText: 'არა',
      nzCentered: true,
    };


    if (options) {
      config = {
        ...config,
        ...options,
      };
    }

    descriptor.value = function (...args: any) {
      modalService.confirm({
        ...config,
        nzOnOk: () => {
          return originalMethod.apply(this, args);
        },
        nzOnCancel: () => {
          return descriptor;
        },
      });
    };
  };
}
