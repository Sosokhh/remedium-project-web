import { FilterBase } from '../../../../core/models';

export interface OrderFilterModel extends FilterBase{
  quantity?: number | null
}
