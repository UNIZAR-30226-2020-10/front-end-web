import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarAmigosComponent } from './buscar-amigos.component';

describe('BuscarAmigosComponent', () => {
  let component: BuscarAmigosComponent;
  let fixture: ComponentFixture<BuscarAmigosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarAmigosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarAmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
