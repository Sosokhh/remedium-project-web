import { HttpParams } from '@angular/common/http';

export function getHttpParams<T>(model: T, prefix: string = 'filter.'): HttpParams {
  let params = new HttpParams();

  if (model) {
    for (const [key, value] of Object.entries(model)) {
      if (value !== null && value !== undefined && value !== '') {
        // Add prefix to keys that are not 'page' or 'limit'
        const paramKey = key === 'page' || key === 'limit' ? key : `${prefix}${key}`;

        if (Array.isArray(value)) {
          value.forEach((val) => (params = params.append(paramKey, val)));
        } else {
          params = params.append(paramKey, value as any);
        }
      }
    }
  }
  return params;
}
