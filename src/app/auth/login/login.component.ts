import { Component, OnInit } from '@angular/core';
import { AuthService, RestService } from './../../Service/export';
import { Login, ResLogin } from './../exportAuth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // private login: Login;
  // private respuesta: ResLogin;
   login: Login;
   respuesta: ResLogin;

  constructor(private auth: AuthService, private router: Router) {
    this.login = { correo: '', password: '', metodo: 1, tokent: '', tipoUsuario: false}
    this.respuesta = { mensaje: '', data: [], error: '', exito: false, tokent: '' };
  }

  ngOnInit() {
    this.auth.logout();
  }

  autenticar() {
    this.auth.logIn(this.login).subscribe( 
      (rs) => {
        this.respuesta = JSON.parse(rs.text());
        if (this.respuesta.exito) {
          localStorage.setItem('_tokentUser', btoa(JSON.stringify(this.respuesta)));
          this.login.tokent = this.respuesta.tokent;
          this.router.navigate(['sofware']);
        //   this.login.metodo = 4;
        //  this.cargaMenu();
        }
      },
      (err) => {
        this.respuesta.mensaje = err + 'Error 404 Servidor desconectado. ';
      },
      () => {

      }
    )
  }
}
