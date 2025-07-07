import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private baseUrl = 'http://localhost:5007/chat';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<{reply: string}> {
    return this.http.post<{reply:string}>(this.baseUrl,{message});
  }
}
