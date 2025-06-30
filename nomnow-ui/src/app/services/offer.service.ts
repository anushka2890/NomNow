import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Offer } from '../models/offer.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseUrl = `${environment.apiUrl}/special-offers`;

  private selectedOfferSubject = new BehaviorSubject<Offer | null>(null);
  selectedOffer$ = this.selectedOfferSubject.asObservable();
  constructor(private http: HttpClient) {}

  applyOffer(offer: Offer) {
    this.selectedOfferSubject.next(offer);
  }

  removeOffer() {
    this.selectedOfferSubject.next(null);
  }

  getAllOffers(): Observable<Offer[]> {
    return this.http.get<Offer[]>(this.baseUrl);
  }

  getOffersByCategory(category: string): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/category/${category}`);
  }

  getOffersByRestaurantId(id: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/restaurant/${id}`);
  }
}
