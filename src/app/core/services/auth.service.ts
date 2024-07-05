import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { AuthRequest, AuthResponse } from '../models';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../models';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);

  isAuthenticated = signal<boolean>(false);
  id = 0;

  constructor() {
    if (this.isLoggedIn) {
      this.isAuthenticated.set(true);
    }
  }

  login(user: AuthRequest) {
    return this.http.post<AuthResponse>(`${environment.apiURL}/login`, user).pipe(
      tap((res: AuthResponse) => {
        this.doLoginUser(res);
        this.router.navigate(['main']);
      }),
    );
  }

  private doLoginUser(tokens: AuthResponse) {
    this.localStorageService.setItem(ACCESS_TOKEN, tokens.accessToken);
    this.localStorageService.setItem(REFRESH_TOKEN, tokens.refreshToken);
    this.isAuthenticated.set(true);
  }

  get isLoggedIn(): boolean {
    return !!this.localStorageService.getItem(ACCESS_TOKEN) || !!this.localStorageService.getItem(REFRESH_TOKEN);
  }

  doLogoutUser() {
    this.localStorageService.removeItem(ACCESS_TOKEN);
    this.localStorageService.removeItem(REFRESH_TOKEN);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  get isTokenExpired(): boolean {
    const access_token = this.localStorageService.getItem(ACCESS_TOKEN);
    if (!access_token) return true;
    const decoded = jwtDecode(access_token);
    if (!decoded.exp) return true;
    const expirationDate = decoded.exp * 1000;
    const now = new Date().getTime();

    return expirationDate < now;
  }

  refreshToken(refresh_token: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiURL}/sales-managers/refresh-token`, null, {
        headers: {
            Authorization: `Bearer ${refresh_token}`,
        },
      })
      .pipe(tap((res: AuthResponse) => this.doLoginUser(res)));
  }
}
