import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';
import { ACCESS_TOKEN, JwtDecodedUser } from '../models';
import { SalesManagerDto } from '../../pages/data-lists';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http = inject(HttpClient);
  #localStorageService = inject(LocalStorageService);

  getUserInfo() {
    const access_token = this.#localStorageService.getItem(ACCESS_TOKEN);
    const decoded: JwtDecodedUser = jwtDecode(access_token);
    return this.#http.get<SalesManagerDto>(`${environment.apiURL}/sales-managers/${decoded.id}`);
  }

}
