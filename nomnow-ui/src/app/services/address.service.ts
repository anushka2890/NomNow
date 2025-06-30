import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private BASE_URL = `${environment.apiUrl}/addresses`;

  constructor(private http: HttpClient) { }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.BASE_URL, address);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }

  getUserAddress(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.BASE_URL}/user`);
  }
}
