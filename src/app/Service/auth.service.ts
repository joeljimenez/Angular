import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Parametros } from './parametros';

const apiUrl = new Parametros().server_rest;
import 'rxjs/add/operator/map';
@Injectable()
export class AuthService {

  constructor(private http: Http) { }
  // tslint:disable-next-line:member-ordering
  private headers:any = new Headers({ 'Content-type': 'application/json' });

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('_tokentUser');
    localStorage.removeItem('_menuUser');
  }

  logIn(data) {
    return this.http.post(apiUrl + 'api/authAdministrativos', data, this.headers);
  }

  Menu(data){
    return this.http.post(apiUrl + 'api/authAdministrativos', data, this.headers);
  }

}
