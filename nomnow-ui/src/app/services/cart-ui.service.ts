import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartUiService {
  private sidebarVisible = new BehaviorSubject<boolean>(false);
  sidebarVisible$ = this.sidebarVisible.asObservable();

  open() {
    this.sidebarVisible.next(true);
  }

  close() {
    this.sidebarVisible.next(false);
  }

  toggle() {
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }
}
