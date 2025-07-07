import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChatMessage } from '../models/chatMessage.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private API_URL = 'http://localhost:5007/chat';
  private sessionId = localStorage.getItem('df-session') || this.generateSessionId();

private generateSessionId(): string {
  const id = Math.random().toString(36).substring(2);
  localStorage.setItem('df-session', id);
  return id;
}

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<ChatMessage> {
    const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'x-session-id': this.sessionId
  });
  return this.http.post<any>(this.API_URL, { message }, {headers}).pipe(
    map(res => {
      const fulfillment = res.reply;

      console.log('🧠 Fulfillment:', fulfillment);
      console.log('📦 Raw payload:', res.details?.responseMessages);

      let suggestions: string[] = [];

      const payload = res.details?.responseMessages?.find((msg: any) => msg.payload)?.payload;
      const richContent = payload?.fields?.richContent?.listValue?.values;

      if (richContent && richContent.length > 0) {
        const firstLayer = richContent[0]?.listValue?.values || [];
        const chipGroup = firstLayer.find(
          (v: any) => v?.structValue?.fields?.type?.stringValue === 'chips'
        );

        const options = chipGroup?.structValue?.fields?.options?.listValue?.values || [];
        suggestions = options.map((opt: any) => opt.structValue.fields.text.stringValue);

        console.log('🎯 Parsed Suggestions:', suggestions);
      }

      return {
        text: fulfillment,
        sender: 'bot',
        suggestions
      };
    })
  );
}

}
