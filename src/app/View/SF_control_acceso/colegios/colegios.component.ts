import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, Parametros, colegio, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-colegios',
  templateUrl: './colegios.component.html',
  styleUrls: ['./colegios.component.css']
})
export class ColegiosComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: colegio;
  titulo_modal: string;
  titulo:string;
  breadcrumbArray = [];
  filtro: string;
  constructor(private rest: RestService, private router: Router, private _service: NotificationsService ) { }

  ngOnInit() {
    this.titulo = 'Compañia';
    this.breadcrumbArray = [{titulo: this.titulo, nombre: this.titulo, ruta:'../home/colegios', datos:''}];

    this.solicitud.metodo = 2;
    this.solicitud.consulta = 1;
    this.run();
  }

  run() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }
    
    this.rest.controlAcceso(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.rest.NuevoTokent(datos.tokent);
          this.respuesta = datos.data;

          if (this.solicitud.consulta === 3) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro actualizado con éxito')
          }
          else if (this.solicitud.consulta === 2) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro insertado con éxito')
          }
          if (this.solicitud.consulta === 4) {
            this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
          }
        }
        else {
          if (datos.error === '0') {
            this.respuesta = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.solicitud.consulta === 4) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro eliminado con éxito')
            }
            if (this.solicitud.consulta === 1) {
              this.Show_notificacion(1, 'Proceso exitoso', 'Registro no existe')
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.Show_notificacion(2, 'Error controlado', this.rest.Control_error(datos.error))
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          document.getElementById('formulario').style.display = 'none';
          document.getElementById('eliminar').style.display = 'none';
        }
      }
    )

    
  }

  crear() {
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.nombre = '';
    this.solicitud.idcompany = 0;
    this.solicitud.nombre = '';
    this.solicitud.siglas = '';
    this.solicitud.registro_fiscal = '';
    this.solicitud.email = '';
    this.solicitud.telefono = '';
    this.solicitud.web = '';
    this.solicitud.direccion = '';
    this.solicitud.facebook = '';
    this.solicitud.twitter = '';
    this.solicitud.color_primario = '';
    this.solicitud.color_secundario = '';
    this.solicitud.color_extra = '';
    this.solicitud.ruta_imagen = '';
    this.titulo_modal = 'Crear Colegio';
    document.getElementById('formulario').style.display = 'block';
  }
  editar(data: colegio) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idcompany = data.idcompany;
    this.solicitud.nombre = data.nombre;
    this.solicitud.siglas = data.siglas;
    this.solicitud.registro_fiscal = data.registro_fiscal;
    this.solicitud.email = data.email;
    this.solicitud.telefono = data.telefono;
    this.solicitud.web = data.web;
    this.solicitud.direccion = data.direccion;
    this.solicitud.facebook = data.facebook;
    this.solicitud.twitter = data.twitter;
    this.solicitud.color_primario = data.color_primario;
    this.solicitud.color_secundario = data.color_secundario;
    this.solicitud.color_extra = data.color_extra;
    this.solicitud.ruta_imagen = data.ruta_imagen;

    document.getElementById('formulario').style.display = 'block';
    this.titulo_modal = 'Editar colegio';
  }
  eliminar(data: colegio) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idcompany = data.idcompany;
    this.solicitud.nombre = data.nombre;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'Eliminar Colegio';
  }

  open(data: colegio) {
    const arreglo = {
      idcompany: data.idcompany,
      nombre_company: data.nombre,
      navegacion: this.breadcrumbArray
    }

    const paramatros = btoa(JSON.stringify(arreglo));

    this.router.navigate(['./home/Sedes', paramatros]);

  }
  validacion() {
    const a = this.solicitud;
    let retorno = true;


    if (a.nombre.length < 1) {
      this.Show_notificacion(2, 'Completar campos', 'Por favor coloque un nombre a la caja.')
      retorno = false;
    }

    return retorno;
  }
  Show_notificacion(tipo, titulo, mensaje) {
    if (tipo === 1) {
      this._service.success(titulo, mensaje, this.optionconfig);
    }
    // tslint:disable-next-line:one-line
    else if (tipo === 2) {
      this._service.error(titulo, mensaje, this.optionconfig);
    }
  }
    
}
