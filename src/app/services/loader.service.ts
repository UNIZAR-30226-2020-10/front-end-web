import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = new Subject<boolean>();
  necessary: Boolean = true;
  show() {
    if(this.necessary) this.isLoading.next(true);
  }
  hide() {
      this.isLoading.next(false);
  }
}
