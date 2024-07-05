import { Pipe, PipeTransform } from '@angular/core';
import { SalesManagerOrderItems } from '../models';

@Pipe({
  name: 'getFullPrice',
  standalone: true
})
export class GetFullPricePipe implements PipeTransform {

  transform(orders: SalesManagerOrderItems[]): string | number {
    if (!orders || !Array.isArray(orders)) {
      return 'N/A';
    }
    return orders.reduce((sum, order) => sum + order.total_price, 0);
  }

}
