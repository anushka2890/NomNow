import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalWrapperComponent } from './auth-modal-wrapper.component';

describe('AuthModalWrapperComponent', () => {
  let component: AuthModalWrapperComponent;
  let fixture: ComponentFixture<AuthModalWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModalWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
