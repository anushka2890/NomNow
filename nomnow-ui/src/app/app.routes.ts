import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { OrderStatusComponent } from './pages/order-status/order-status.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'restaurants', component: RestaurantsComponent },
    { path: 'order', component: PlaceOrderComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'status', component: OrderStatusComponent },
    {
      path: 'order-status/:id',
      loadComponent: () => import('./pages/order-status/order-status.component').then(m => m.OrderStatusComponent)
    },
    {
      path: 'profile',
      loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
      path: 'order-history',
      loadComponent: () =>
        import('./pages/order-history/order-history.component').then(m => m.OrderHistoryComponent)
    },
];
