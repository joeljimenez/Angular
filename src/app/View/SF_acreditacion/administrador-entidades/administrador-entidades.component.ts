import { Component, OnInit } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-administrador-entidades',
  templateUrl: './administrador-entidades.component.html',
  styleUrls: ['./administrador-entidades.component.css']
})
export class AdministradorEntidadesComponent implements OnInit {

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  titulo_modal: string;

  titulo: string;
  breadcrumbArray = [];

  entidades = [];

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.titulo = 'Entidades';
    this.breadcrumbArray = [{ titulo: this.titulo, nombre: this.titulo, ruta: '../home/administrador-entidades', datos: '' }];

    this.solicitud.identidad = null;
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 1; // crea 2, actualiza 3, eliimina 4.
    this.Consulta_entidad();
  }

  Consulta_entidad() {
    this.flag_envio = true;

    if (this.solicitud.consulta === 3 || this.solicitud.consulta === 2) {
      if (!this.validacion()) {
        this.flag_envio = false;
        return false;
      }
    }

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log(datos);
        if (datos.exito) {

          this.entidades = datos.data;

          if (this.solicitud.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.entidades = datos.data;
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 1) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
            //this.rest.logout();
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
          document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  crear() {
    this.limpiar()
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 2;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    this.titulo_modal = 'CREAR ENTIDAD';
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: any) {
    this.limpiar()
    this.solicitud.metodo = 2;
    this.solicitud.consulta = 3;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.solicitud.nombre = data.nombre;
    this.solicitud.descripcion = data.descripcion;
    this.solicitud.identidad = data.identidad;

    this.titulo_modal = 'EDITAR ENTIDAD';
    document.getElementById('formulario').style.display = 'block';
  }

  eliminar(data: any) {
    if (confirm("Desea eliminar esta Entidad! Asegurese de que no tenga Datos enlazados.")) {
      this.solicitud.metodo = 2;
      this.solicitud.consulta = 4;
      this.solicitud.identidad = data.identidad;
      this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
      this.Consulta_entidad();
    }
  }

  validacion() {
    const a = this.solicitud;
    let retorno = true;

    if (a.nombre.length < 1) {
      this.notify.error('Completar campos', 'Por favor coloque un nombre a la caja.', this.optionconfig);
      retorno = false;
    }
    
    return retorno;
  }

  limpiar() {
    this.solicitud.descripcion = '';
    this.solicitud.nombre = '';
    this.solicitud.identidad = null;
    this.solicitud.consulta = 2;
    this.titulo_modal = '';
  }

  open(data: any) {
    const arreglo = {
      identidad: data.identidad,
      nombre: data.nombre,
      navegacion: this.breadcrumbArray
    }
    const paramatros = btoa(JSON.stringify(arreglo));
    this.router.navigate(['./home/administrador-esquemas', paramatros]);

  }

}
