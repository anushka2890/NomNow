import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OfferDTO } from '../models/offer.model';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private baseUrl = `${environment.apiUrl}/special-offers`;

  private selectedOfferSubject = new BehaviorSubject<OfferDTO | null>(null);
  selectedOffer$ = this.selectedOfferSubject.asObservable();
  constructor(private http: HttpClient) {}

  applyOffer(offer: OfferDTO) {
    this.selectedOfferSubject.next(offer);
  }

  removeOffer() {
    this.selectedOfferSubject.next(null);
  }

  getAllOffers(): Observable<OfferDTO[]> {
    return this.http.get<OfferDTO[]>(this.baseUrl);
  }

  getOffersByCategory(category: string): Observable<OfferDTO[]> {
    return this.http.get<OfferDTO[]>(`${this.baseUrl}/category/${category}`);
  }

  getOffersByRestaurantId(id: number): Observable<OfferDTO[]> {
    return this.http.get<OfferDTO[]>(`${this.baseUrl}/restaurant/${id}`);
  }

  getExclusiveItemOffers(): Observable<OfferDTO[]> {
    return this.getAllOffers().pipe(
      map(offers => offers.filter(o => !!o.menuItemId))
    );
  }
}
