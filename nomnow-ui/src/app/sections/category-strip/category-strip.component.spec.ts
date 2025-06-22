import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryStripComponent } from './category-strip.component';

describe('CategoryStripComponent', () => {
  let component: CategoryStripComponent;
  let fixture: ComponentFixture<CategoryStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryStripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
