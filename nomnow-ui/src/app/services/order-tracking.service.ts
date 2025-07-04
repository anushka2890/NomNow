import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService {
  private stompClient?: Client;
  private orderStatusSubject = new BehaviorSubject<string>('INITIAL');
  public orderStatus$: Observable<string> = this.orderStatusSubject.asObservable();

  private subscription?: any;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.wsEndpoint),
      reconnectDelay: 5000,
      debug: (str: string) => {
        console.log('[STOMP]', str);
      },
    });

    this.stompClient.onStompError = (frame) => {
      console.error('❌ STOMP error:', frame.headers['message']);
      console.error('🔍 Details:', frame.body);
    };
  }

  connect(orderId: number): void {
    this.disconnect(); // 🧹 Cleanup before connecting again

    this.stompClient!.onConnect = () => {
      console.log('✅ Connected to WebSocket');

      this.subscription = this.stompClient!.subscribe(
        `/topic/order-status/${orderId}`,
        (message: IMessage) => {
          try {
            const data = JSON.parse(message.body);
            console.log('📦 Received update:', data);
            this.orderStatusSubject.next(data.status);
          } catch (err) {
            console.error('❗ Error parsing WebSocket message', err);
          }
        }
      );
    };

    this.stompClient!.activate();
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }

    if (this.stompClient?.active) {
      this.stompClient.deactivate();
    }

    this.orderStatusSubject.next('INITIAL'); // Reset state to avoid UI leak
    console.log('🔌 WebSocket disconnected and cleaned up');
  }
}
