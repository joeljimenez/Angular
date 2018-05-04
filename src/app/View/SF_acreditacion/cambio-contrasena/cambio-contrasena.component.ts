import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos, solicitudes } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.component.html',
  styleUrls: ['./cambio-contrasena.component.css']
})
export class CambioContrasenaComponent implements OnInit {

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  tituloModal: string;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService) { }

  ngOnInit() {
    this.tituloModal = 'CAMBIO DE CONTRASEÑA'
    document.getElementById('formulario').style.display = 'block';
  }

  run() {
    this.flag_envio = true;
    this.solicitud.estado = (this.solicitud.estado) ? 1 : 0;
    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          
          this.notify.success('Proceso exitoso', 'Se realizo el cambio contraseña', this.optionconfig);
          this.cerrar();
        }
        else {
          if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {
        if (this.solicitud.consulta >= 1) {
        }
      }
    )
  }

  ejecuta_cambio_password() {
    if (this.solicitud.nombre.length > 0 && this.solicitud.password.length > 0 && this.solicitud.new_password.length > 0) {
      if (this.solicitud.nombre == this.solicitud.new_password) {

        this.solicitud.metodo= 4;
        this.solicitud.consulta = 3;
        this.run();

      } else {
        this.notify.error('Error', 'Las Contraseñas no son identicas. por favor verifique', this.optionconfig);
      }
    } else {
      this.notify.error('Error', 'Debe completar todos los campos para el cambio', this.optionconfig);
    }
  }

  cerrar(){
    this.solicitud.password = '';
    this.solicitud.new_password ='';
    this.solicitud.nombre = '';
    window.history.back();
    // this.router.navigate(['./home/Matriz']);
  }

}