import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicialScreenComponent } from './inicial-screen.component';

describe('InicialScreenComponent', () => {
  let component: InicialScreenComponent;
  let fixture: ComponentFixture<InicialScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicialScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicialScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
