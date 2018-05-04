import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Parametros } from './parametros';


import 'rxjs/add/operator/map';

@Injectable()
export class RestService {
  apiUrl = new Parametros().server_rest;
  tokentUser: any;
  constructor(private http: Http) { }
  // tslint:disable-next-line:member-ordering
  private headers: any = new Headers({ 'Content-type': 'application/json' });

  NuevoTokent(tokent): void {

    this.tokentUser = JSON.parse(atob(localStorage._tokentUser));
    this.tokentUser.tokent = tokent;
    localStorage.setItem('_tokentUser', btoa(JSON.stringify(this.tokentUser)));
  }

  Servicios(data) {
    return this.http.post(this.apiUrl + 'api/Servicios', data, this.headers);
  }

  controlAcceso(data) {
    return this.http.post(this.apiUrl + 'api/ControlAcceso', data, this.headers);
  }

  GestionSolicitudes(data) {
    return this.http.post(this.apiUrl + 'api/GestionSolicitudes', data, this.headers);
  }

  ulat_form(data) {
    return this.http.post(this.apiUrl + 'api/ulat_form', data, this.headers);
  }

  acreditacion(data) {
    return this.http.post(this.apiUrl + 'api/Acreditacion', data, this.headers);
  }

  // autoevaluacion
  loadfileAutoevaluacion(data) {
    const headers = new Headers({});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + 'api/APIActividadfile', data, options);
  }

  // proyectos
  loadfileProyectos(data) {
    const headers = new Headers({});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + 'api/APIfilerecolector', data, options);
  }

  Control_error(error) {
    let retorno = '';
    if (error === '2627') {
      retorno = 'Este registro ya existe.';
    }
    // tslint:disable-next-line:one-line
    else if (error === '547') {
      retorno = 'Este registro tiene dependencias no puede ser eliminado.';
    }
    else if (error === '1452') {
      retorno = 'Error al ejecutar consulta... Cannot add or update a child row:';
    }
    // tslint:disable-next-line:one-line
    else {
      retorno = error + ': Error no idetificado. ';
    }
    return retorno;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('_tokentUser');
    localStorage.removeItem('_menuUser');

    window.location.href = './';
  }
}
