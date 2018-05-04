import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Roles,Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: Roles;
  titulo_modal: string;
  filter: any;
  titulo_padre: string;
  params: any;
  titulo:string;
  breadcrumbArray = [];
  filtro: string;
  constructor(private rest: RestService, private router: Router, private _service: NotificationsService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.filter = 0;
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.solicitud.idsoftware = JSON.parse(atob(params['data'])).idsoftware;
          this.titulo_padre = JSON.parse(atob(params['data'])).nombre;
          this.params = JSON.parse(atob(params['data']));

          this.titulo = 'Roles ('+this.titulo_padre+')';
          this.breadcrumbArray = JSON.parse(atob(params['data'])).navegacion;
          this.breadcrumbArray.push({titulo: this.titulo, nombre: this.titulo, ruta: '../home/Roles', datos: JSON.parse(atob(params['data']))});

        } catch (error) {

          this.router.navigate(['./home/Softwares'])
        }
      }
      // tslint:disable-next-line:one-line
      else {
        this.router.navigate(['./home/Softwares'])
      }
    });

    this.solicitud.consulta = 1;
    this.solicitud.metodo = 9;
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
    this.solicitud.descripcion = '';
    this.titulo_modal = 'Crear Rol';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: Roles) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.nombre;
    this.solicitud.descripcion = data.descripcion;
    this.solicitud.idrole = data.idrole;


    document.getElementById('formulario').style.display = 'block';
    this.titulo_modal = 'Editar Rol';
  }

  eliminar(data: Roles) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.nombre = data.nombre;
    this.solicitud.idrole = data.idrole;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'Eliminar Rol';
  }

  open(data: Roles) {
    const arreglo = {
      idsoftware: data.idsoftware,
      nombre: data.nombre,
      idrole: data.idrole,
      software: this.titulo_padre,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['./home/MenuRol', paramatros]);

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
