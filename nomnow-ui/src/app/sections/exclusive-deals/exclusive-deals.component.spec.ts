import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveDealsComponent } from './exclusive-deals.component';

describe('ExclusiveDealsComponent', () => {
  let component: ExclusiveDealsComponent;
  let fixture: ComponentFixture<ExclusiveDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExclusiveDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExclusiveDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
