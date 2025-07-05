import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.css'],
  standalone: true
})
export class DeliveryTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() restaurantCoords: [number, number] = [19.0760, 72.8777];
  @Input() deliveryCoords: [number, number] = [19.0950, 72.8850];
  private map?: any;
  private marker?: any;
  private intervalId?: any;

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    const L = await import('leaflet');

    this.map = L.map('map').setView(this.restaurantCoords, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
    }).addTo(this.map);

    // Draw the delivery route
    const route = [this.restaurantCoords, this.deliveryCoords];

    const routeLine = L.polyline(route, {
      color: '#00ffff',
      weight: 5,
      opacity: 0.8
    }).addTo(this.map);

    this.map.fitBounds(routeLine.getBounds());

    // Add delivery marker
    const deliveryIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [40, 40]
    });

    this.marker = L.marker(this.restaurantCoords, { icon: deliveryIcon }).addTo(this.map);

    this.animateMarkerAlongPath(L, route);
  }
  private animateMarkerAlongPath(L: any, route: [number, number][]): void {
    const [start, end] = route;
    const steps = 100;
    let i = 0;

    this.intervalId = setInterval(() => {
      if (i >= steps) {
        clearInterval(this.intervalId);
        return;
      }

      const lat = start[0] + ((end[0] - start[0]) * i) / steps;
      const lng = start[1] + ((end[1] - start[1]) * i) / steps;

      this.marker.setLatLng([lat, lng]);
      this.map?.panTo([lat, lng]);

      i++;
    }, 300);
  }


  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.map?.remove();
  }
}
