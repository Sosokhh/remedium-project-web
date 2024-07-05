import { FilterBase } from '../../../../core/models';

export interface SalesManagerFilterModel extends FilterBase{
  username?: string;
  firstName?: string;
  lastName?: string;
  created_at?: Date | null;
  registrationEndDate?: Date | null;
  salesTotalAmount?: number | null;
}
