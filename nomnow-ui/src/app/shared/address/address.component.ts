import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Address } from '../../models/address.model';


@Component({
  selector: 'app-address',
  imports: [],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit{
  @Input() addresses: Address[] = [];
  @Input() selectable: boolean = false;

  @Output() addressSelected = new EventEmitter<Address>();
  @Output() addressDeleted = new EventEmitter<number>();

  selectedId: number | null = null;

  ngOnInit(): void {}

  selectAddress(address: Address) {
    this.selectedId = address.id;
    this.addressSelected.emit(address);
  }

  deleteAddress(id: number) {
    this.addressDeleted.emit(id);
  }
}
