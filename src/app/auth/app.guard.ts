import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './../Service/auth.service';
import { Login, ResLogin } from './exportAuth';
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    login: Login;
    respuesta: ResLogin;
    constructor(private router: Router, private auth: AuthService) {
        this.login = { correo: '', password: '', metodo: 5, tokent: '', tipoUsuario: false }
        this.respuesta = { mensaje: '', data: [], error: '', exito: false, tokent: '' };
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('_tokentUser')) {
            this.login.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

            this.auth.logIn(this.login).subscribe(
                (rs) => {
                    this.respuesta = JSON.parse(rs.text());
                    if (!this.respuesta.exito) {
                        this.router.navigate(['login']);
                    }
                },
                (err) => {
                    this.router.navigate(['login']);
                }
            )


        }
        // tslint:disable-next-line:one-line
        else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['login']);
            return false;
        }

        return true;

    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let data = [];
        const pagina = route.url[0].path;

        const permisos = {
            pp: Date.now().toString(),
            actualizar: 0,
            pp1: Date.now().toString() + 'primera',
            eliminar: 0,
            pp2: Date.now().toString() + 'segunda',
            registrar: 0,
            pagina: ''
        }
        if (localStorage.getItem('_menuUser')) {
            if (pagina !== 'dashboard') {
                data = JSON.parse(atob(localStorage.getItem('_menuUser')));

                for (const key in data) {
                    if (data[key].menu.length > 0) {
                        for (const a in data[key].menu) {
                            if (data[key].menu[a].link === pagina) {
                                permisos.registrar = data[key].menu[a].crear;
                                permisos.actualizar = data[key].menu[a].editar;
                                permisos.eliminar = data[key].menu[a].eliminar;
                                permisos.pagina = pagina + Date.now().toString();
                                localStorage._acess = btoa(JSON.stringify(permisos));
                                return true;
                            }
                        }
                    }
                }
            }
            else {

                return true;
            }
        }
        else {

            this.router.navigate(['login']);
            return false;
        }
        alert('Usted no posee permiso para acceder a esta esta pantalla. ' + route.url[0].path + ' Consulte con el (la) administrador (a).')
        // this.router.navigate(['dashboard']);
        return false;
    }
}
