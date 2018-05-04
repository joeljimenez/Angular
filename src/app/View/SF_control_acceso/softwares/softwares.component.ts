import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, software, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-softwares',
  templateUrl: './softwares.component.html',
  styleUrls: ['./softwares.component.css']
})
export class SoftwaresComponent implements OnInit {
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;

  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  permisos = new Permisos().access; // permisos globales de la pantalla
  flag_envio: boolean;
  mensaje_error: string;
  respuesta: software;
  titulo_modal: string;
  titulo:string;
  breadcrumbArray = [];
  filtro: string;
  constructor( private rest: RestService, private router: Router, private _service: NotificationsService) { }

  ngOnInit() {
    this.titulo = 'Softwares';
    this.breadcrumbArray = [{titulo: this.titulo, nombre: this.titulo, ruta:'../home/Softwares', datos:''}];

    this.solicitud.metodo = 11;
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
    this.solicitud.descripcion = '';
    this.titulo_modal = 'Crear Software';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: software) {
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idsoftware = data.idsoftware;
    this.solicitud.nombre = data.nombre;
    this.solicitud.descripcion = data.descripcion;


    document.getElementById('formulario').style.display = 'block';
    this.titulo_modal = 'Editar Software';
  }

  eliminar(data: software) {
    this.solicitud.consulta = 4;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.solicitud.idsoftware = data.idsoftware;
    this.solicitud.nombre = data.nombre;

    document.getElementById('eliminar').style.display = 'block';
    this.titulo_modal = 'Eliminar Software';
  }

  open(data: software, numero) {
    const arreglo = {
      idsoftware: data.idsoftware,
      nombre: data.nombre,
      navegacion: this.breadcrumbArray
    }

    const paramatros = btoa(JSON.stringify(arreglo));

    if(numero == 1){
      this.router.navigate(['./home/Roles', paramatros]);
    }
    else{
      this.router.navigate(['./home/Menus', paramatros]);
    }
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
