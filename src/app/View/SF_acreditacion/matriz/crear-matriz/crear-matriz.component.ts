import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos, solicitudes } from '../../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
 
@Component({
  selector: 'app-crear-matriz',
  templateUrl: './crear-matriz.component.html',
  styleUrls: ['./crear-matriz.component.css']
})
export class CrearMatrizComponent implements OnInit {

  @Input() tituloModal: string;
  @Input() solicitud = new Parametros().prm;

  @Output() guardar: EventEmitter<any> = new EventEmitter();

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  // solicitud = new Parametros().prm;
  flag_envio: boolean;
  mensaje_error: string;
  matriz: acreditacion;
  entidades: acreditacion;
  esquemas: acreditacion;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService) {}
    /* 
      En este componente se muestra el formulario para gestionar los datos de la matriz.
      los datos reunidos en este formulario ya sea para editar o crear son enviados al componente padre 'MatrizComponent', para realizar
      la consulta deseada.
    */
  ngOnInit() {
    this.entidades = null;
    this.esquemas = null;

    this.prm.metodo = 2;
    this.prm.consulta = 1;
    this.consulta_entidades();
  }

  consulta_entidades() {
    this.flag_envio = true;
    this.rest.acreditacion(this.prm).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.entidades = datos.data;
          if (this.prm.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          else if (this.prm.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro Actualizado.', this.optionconfig);
          }
          if (this.prm.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.entidades = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.prm.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.prm.consulta === 1) {
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
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.prm.consulta > 1) {
          //document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  consulta_esquema() {
    this.flag_envio = true;
    this.rest.acreditacion(this.prm).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {
          this.esquemas = datos.data;
          if (this.prm.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          else if (this.prm.consulta === 3) {
            this.notify.success('Proceso exitoso', 'Registro Actualizado.', this.optionconfig);
          }
          if (this.prm.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.esquemas = datos.data;
            this.rest.NuevoTokent(datos.tokent)
            if (this.prm.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.prm.consulta === 1) {
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
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.prm.consulta > 1) {
          //document.getElementById('formulario').style.display = 'none';
          // document.getElementById('eliminar').style.display = 'none';
        }
      }
    )
  }

  cambio_entiidad() {
    if (this.solicitud.identidad !== null || this.solicitud.identidad !== undefined) {
      this.prm.identidad = this.solicitud.identidad
      this.prm.metodo = 2;
      this.prm.consulta = 21;
      this.consulta_esquema();
    }
    else {
      this.esquemas = null;
    }
  }

  crearMatriz(datos: any){
    this.solicitud = datos;
    this.limpiar()
    document.getElementById('formulario').style.display = 'block';
  }

  editarMatriz(datos: any){
    this.solicitud = datos;
    this.cambio_entiidad();
    document.getElementById('formulario').style.display = 'block';
  }

  guardar_valida() {
    if (this.solicitud.nombre.length > 1 && this.solicitud.identidad != null && this.solicitud.idesquema != null) {
      if (this.solicitud.vigencia_inicio <= this.solicitud.vigencia_fin) {
        /*
          Se evia los datos al componente padre (en este caso MatrizComponent)  y proceder a ejecutar la consulta.
        */
        this.guardar.emit(JSON.stringify(this.solicitud));
      } else {
        this.notify.error('Valiadar campos', 'El inicio de la vigencia debe ser menor al del Cierre..', this.optionconfig);
      }
    } else {
      this.notify.error('Completar campos', 'Todos los campos son obligatorios', this.optionconfig);
    }
  }

  limpiar() {
    this.solicitud.identidad = null;
    this.solicitud.idesquema = null;
    this.solicitud.nombre = '';
    this.solicitud.descripcion = '';
    this.solicitud.vigencia_inicio = 0;
    this.solicitud.vigencia_fin = 0;
    this.esquemas = null;
  }

  cerrar() {
    this.limpiar();
    document.getElementById('formulario').style.display = 'none';
  }
}
