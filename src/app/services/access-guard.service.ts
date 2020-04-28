import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CloudService } from './cloud.service';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuardService implements CanActivate {

  constructor(
    private cloudService: CloudService,
    private router: Router,
    private alertService: AlertsService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    const requiresLogin = route.data.requiresLogin || false;
    if(requiresLogin && this.cloudService.user === undefined) {
      this.alertService.showAlert(0, "", "Primero tienes que iniciar sesión");
      this.router.navigateByUrl('/login');
      return false;
    } else if(!requiresLogin && this.cloudService.user != undefined) {
      this.router.navigateByUrl('/initial-screen');
      return false;
    }
    return true;
  }
}
