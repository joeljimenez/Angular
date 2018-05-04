import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos, acreditacion } from '../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Rx"

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent implements OnInit {

  @Input() periodo_activo: number;
  @Input() vistaActual: string;
  @Input() idcarpeta: number;
  @Output() enviar: EventEmitter<any> = new EventEmitter();

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;

  files = [];
  lista_archivo = [];
  evidencias = [];
  time: boolean;
  cant_arch: number;
  cant_arch_env: number;
  data_visor: any;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { }
  
  /*
      En el metodo loadFile(){};
      se ejecuta la validacion  if (this.vistaActual == '-- nom_vista --') para verificar la vist en que se encuentr ya se aautoevaluacion o proyectos
      ya que los datos concatenados en el nombre son diferentes.
      al igual se ejecuta esa validacion al ejeucatar la consulta ya que va dirigida a componente diferentes en el Servidor.
  */
 
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.data_visor = JSON.parse(atob(params['data'])).data;
        } catch (error) {
          window.history.back();
        }
      }
      else {
        window.history.back();
      }
    });
  }

  OnChange(e) {
    this.files = e.srcElement.files;
    this.lista_archivo = [];

    if (this.files.length > 0) {
      this.time = true;
    } else {
      this.time = false;
    }
    for (let i = 0; i < this.files.length; i++) {
      this.lista_archivo.push({ id: i, nombre: this.files[i].name.split('.')[0], activo: true, loading: false, error: false })
    }
  }

  eliminar_archivo(a: any) {
    if (a.activo) {
      a.activo = false;
    }
    else {
      a.activo = true;
    }
  }

  subirArchivo_Autoevaluacion(data: any) {
    this.flag_envio = true;
    this.rest.loadfileAutoevaluacion(data).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log(datos)
        if (datos.exito) {
          this.evidencias = datos.data;
          //         this.enumera_evidencias_carpetas();
          this.notify.success('Proceso Exitoso', 'El archivo se inserto con Exito', this.optionconfig);
        }
        else {
          if (datos.numero === 0) {
            this.notify.error('Error', datos.mensaje, this.optionconfig);
          } else if (datos.numero === '-7') {
            this.notify.error('Error', datos.mensaje, this.optionconfig);
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
          }
        }
      },
      (err) => { },
      () => {
      }
    )
  }

  subirArchivo_Proyecto(data: any) {
    // data.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    this.flag_envio = true;
    this.rest.loadfileProyectos(data).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text()); console.log(datos);
        if (datos.exito) {
          this.evidencias = datos.data;
          console.log(this.evidencias);
          //this.enumera_evidencias_carpetas();
          this.notify.success('Proceso Exitoso', 'El archivo se inserto con Exito', this.optionconfig);
        }
        else {
          if (datos.numero === "0") {
            this.notify.error('Error', datos.mensaje, this.optionconfig);
          } else if (datos.numero === '-7') {
            this.notify.error('Error', datos.mensaje, this.optionconfig);
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
          }
        }
      },
      (err) => { },
      () => {
      }
    )
  }

  loadFile() {
    if (this.files.length > 0) {

      this.cant_arch = 0;
      this.cant_arch_env = this.files.length;
      for (let i = 0; i < this.files.length; i++) {

        let data = new FormData();
        if (this.lista_archivo[i].activo) {
          let nombre = this.lista_archivo[i].nombre;
          let extencion = (this.files[i].name.substring(this.files[i].name.lastIndexOf('.'))).toLowerCase();

          let nombre_archivo = '';

          if (this.vistaActual == 'autoevaluacion') {
            nombre_archivo = this.data_visor.idsecuencia + '°' + nombre + '°' + extencion + '°' + this.idcarpeta;
          } else if (this.vistaActual == 'proyecto') {
            nombre_archivo = this.data_visor.idsecuencia_pro + '°' + nombre + '°' + extencion + '°' + this.idcarpeta + '°' + this.periodo_activo;
          }
          data.append("file", this.files[i], nombre_archivo);
          let megas = this.files[i].size / (1024 * 1024);
          if (megas < 2600.00) {

            if (this.vistaActual == 'proyecto') {
              this.subirArchivo_Proyecto(data);
            } else if (this.vistaActual == 'autoevaluacion') {
              this.subirArchivo_Autoevaluacion(data);
            }

          } else {
            this.notify.error('Proceso error', 'El archivo es muy pesado para subirlo como evidencia, máximo permitido 26Mb. Contacte al departamento sistemas para que le ayuden con el tema.', this.optionconfig);
          }
        } else {
          alert('Error');
        }

      }
    }
  }

}
