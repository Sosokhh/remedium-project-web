import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingSubForGet = signal<boolean>(false);
  loadingSubForRest = signal<boolean>(false);

  loadingMap: Map<string, { loading: boolean; method: string }> = new Map<
    string,
    { loading: boolean; method: string }
  >();

  constructor() {}

  setLoading(loading: boolean, url: string, method: string): void {
    if (!url) {
      throw new Error(
        'The request URL must be provided to the LoadingService.setLoading function'
      );
    }
    if (loading) {
      this.loadingMap.set(url, { loading, method });
      if (method == 'GET') {
        this.loadingSubForGet.set(true);
      } else {
        this.loadingSubForRest.set(true);
      }
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSubForGet.set(false);
      this.loadingSubForRest.set(false);
    }
  }
}
