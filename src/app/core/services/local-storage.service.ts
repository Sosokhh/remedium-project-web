import { Injectable, inject, InjectionToken } from '@angular/core';

const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  #storage = inject(BROWSER_STORAGE);

  setItem(key: string, data: any): void {
    this.#storage.setItem(key, JSON.stringify(data));
  }

  getItem(key: string): any {
    const obj = this.#storage.getItem(key);
    if (obj) {
      return JSON.parse(obj);
    }
    return null;
  }

  removeItem(key: string): void {
    this.#storage.removeItem(key);
  }

  clear() {
    this.#storage.clear();
  }
}
