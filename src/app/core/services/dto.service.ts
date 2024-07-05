import { DatePipe } from '@angular/common';
import { Injectable, inject } from '@angular/core';

const DATE_FORMAT = 'yyyy-MM-dd';

@Injectable({
  providedIn: 'root',
})
export class DtoService {
  #datePipe = inject(DatePipe);

  transformDates<T extends Object>(obj: T): T {
    let transformedObj: T = obj;
    Object.entries(obj).forEach(([key, value]) => {
      if (value instanceof Date) {
        transformedObj = {
          ...transformedObj,
          [key]: this.#datePipe.transform(value, DATE_FORMAT),
        };
      }
    });

    return transformedObj;
  }
}
