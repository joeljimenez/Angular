import { Component, OnInit, ViewChild, Input, forwardRef } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos, acreditacion } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ControlCarpetasComponent } from '../../../controles/acreditacion/export_controles_acreditacion';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-evidencia',
  templateUrl: './evidencia.component.html',
  styleUrls: ['./evidencia.component.css']
})
export class EvidenciaComponent implements OnInit {


  @Input() gestionar: boolean;
  @Input() periodos: any;

  // Parametros para saber en que vista esta ubicado
  @Input() proyecto: boolean;
  @Input() autoevaluacion: boolean;

  //VARIABLES GENERALES
  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  data_visor: any;
  carpetas = [];
  evidencias = [];
  barra = [];
  lista_archivo = [];

  cantidad_root: number;
  cantidad_evi: number;
  idcarpeta: number;
  cant_arch: number;
  cant_arch_env: number;

  files: any;
  Encabezado = {'titulo': '', 'nombre1': '', 'nombre2': ''};

  vistaActual: string;

  //VARIABLES DE PROYECTOS
  cantidad_pieza_matriz_en_actividad: number;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) {
  }

  /*
    En este componente interactuan  componentes diferentes:
    
    control-carpetas: gestiona los procesos de mostrar, crear, actualizar y eliminar carpetas.
    Adicional en el ese mismo componente exite otro componente:
                                                                'input-file': es donde se realiza el proceso de subir lo archivos.

    control-evidencia: gestiona los procesos de mostrar, crear, actualizar y eliminar las evidencias.

    En este componente se realizan las consultas de carpetas y evidencias y se le envian los resultados a los componentes hijos antes mencionados.
    
    Existen dos metodos llamados guardar_Cambios(event: any) y guardar_Cambios_evidencia(event: any)
    en donde se reciben los parametros enviados por los componentes hijos para ejecutar las consultas.
  */

  ngOnInit() {
    this.vistaActual = 'autoevaluacion';
    this.cantidad_pieza_matriz_en_actividad = 0;
    this.cierra_contenido();
    this.cant_arch = 0;
    this.cant_arch_env = 0;

    this.route.params.subscribe(params => {
      if (params['data'] != null) {
        try {
          this.data_visor = JSON.parse(atob(params['data'])).data;
          let titulo = JSON.parse(atob(params['data'])).nombre_encabezado;
          this.Encabezado = {
            'titulo': titulo, 'nombre1': this.data_visor.nombre_pieza,
            'nombre2': '<strong>[' + this.data_visor.orden + ']</strong> ' + this.data_visor.nombre
          };
        } catch (error) {
          window.history.back();
        }
      }
      else {
        window.history.back();
      }
    });
    this.solicitud.metodo = 3;
    this.solicitud.consulta = 5;
    this.solicitud.idsecuencia = this.data_visor.idsecuencia;
    this.consultar_carpeta();
  }

  consultar_carpeta() {
    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());console.log(datos);
        if (datos.exito) {

          this.carpetas = datos.data;
          /*consulta la envidencias del nodo si tiene*/

          this.evidencias = [];
          this.consulta_evidencias(this.data_visor.idsecuencia, 1);

          if (this.solicitud.consulta === 7) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 6) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
          }
          if (this.solicitud.consulta === 5 && this.solicitud.metodo === 5) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          this.consulta_evidencias(this.data_visor.idsecuencia, 1);
          if (datos.error === '0') {
            this.carpetas = datos.data;
            if (this.solicitud.consulta === 5 && this.solicitud.metodo === 5) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
          }
          else if (datos.numero == 0) {
            this.carpetas = [];
            if (this.solicitud.consulta === 5 && this.solicitud.metodo === 5) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            /*consulta la envidencias del nodo si tiene*/
            // this.evidencias = [];
            // this.consulta_evidencias(this.data_visor.idsecuencia, 1)

          }
          // tslint:disable-next-line:one-line
          else if (datos.error === '-2') {
            alert('Sesión Expirada.  ' + datos.mensaje)
          }
          else {
            this.notify.error('Error controlado', this.rest.Control_error(datos.error), this.optionconfig);
            this.rest.NuevoTokent(datos.tokent)
          }
        }
      },
      (err) => { },
      () => {

        if (this.solicitud.consulta > 1) {
        }
      }
    )
  }

  consulta_evidencias(idsecuencia: any, consulta: number) {
    this.solicitud.metodo = 3;
    this.solicitud.consulta = consulta;
    this.solicitud.idsecuencia = idsecuencia;

    this.flag_envio = true;

    this.rest.acreditacion(this.solicitud).subscribe(
      (rs) => {
        this.flag_envio = false;
        const datos = JSON.parse(rs.text());
        if (datos.exito) {

          this.evidencias = datos.data;
          this.limpiar();
          this.enumera_evidencias_carpetas();

          if (this.solicitud.consulta === 7) {
            this.notify.success('Proceso exitoso', 'Registro actualizado con éxito', this.optionconfig);
          }
          else if (this.solicitud.consulta === 6 || this.solicitud.consulta === 2) {
            this.notify.success('Proceso exitoso', 'Registro insertado con éxito', this.optionconfig);
            // this.limpiar()
          }
          if (this.solicitud.consulta === 4) {
            this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
          }
        }
        else {
          if (datos.error === '0') {
            this.evidencias = [];
            if (this.solicitud.consulta === 4) {
              this.notify.success('Proceso exitoso', 'Registro eliminado con éxito', this.optionconfig);
            }
            if (this.solicitud.consulta === 5) {
              this.notify.success('Proceso exitoso', 'Registro no existe', this.optionconfig);
            }
          }
          else if (datos.numero == 0) {
            this.evidencias = [];
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

        if (this.solicitud.consulta > 1) {
        }
      }
    )
  }

  enumera_evidencias_carpetas() {
    this.cantidad_root = 0;
    for (const i in this.carpetas) {
      this.cantidad_evi = 0;
      for (const a in this.evidencias) {
        if (this.evidencias[a].idcarpeta == this.carpetas[i].idcarpeta) {
          this.cantidad_evi = this.cantidad_evi + 1;
        }
      }
      this.carpetas[i].cantidad = this.cantidad_evi;
    }

    for (const a in this.evidencias) {
      if (this.evidencias[a].idcarpeta === 0) {
        this.cantidad_root = this.cantidad_root + 1;
      }
    }
    document.getElementById('formulario_carpeta').style.display = 'none';
    document.getElementById('reporte').style.display = 'none';
    document.getElementById('formulario_evidencia').style.display = 'none';
  }

  select_barra(a: number) {
    if (a == -1) {
      this.barra = [];
      this.idcarpeta = 0;
    }
    else {
      let temp = this.barra;
      this.barra = [];
      for (const i in temp) {

        if (a == temp[i].id) {
          this.idcarpeta = temp[i].idcarpeta;
          this.barra.push(temp[i])
        } else {
          if (temp[i].id <= a) {
            this.barra.push(temp[i])
          }
        }
      }
    }

  }

  select_file(evento) {
    this.idcarpeta = evento.idcarpeta;
    this.barra = evento.barra;
  }

  cierra_contenido = function () {
    /*al cerar contenido vuelve a la vista principal*/
    //this.vista_contenido = 'principal';
    /*borra los datos de la vista*/
    this.data_visor = '';
    /*elimina la evidencias consultadas*/
    this.evidencias = [];

    /*limpia los visor de documentos*/
    this.pdf = false;
    this.img = false;
    this.vdo = false;
    /*------------------------------*/
    /*oculta el visor si no fue cerrado*/
    this.nuestra_visor = false;
    /**/
    this.flim = "";
    this.idcarpeta = 0;
    this.barra = [];
  }

  limpiar() {
    this.solicitud.nombre = '';
    this.solicitud.script = '';
  }

  guardar_Cambios(event: any) {
    /*
      guaradar_Cambios se ejecuta desde el componente *control_carpetas*, trae los datos para realizar la consulta.
    */
    this.solicitud = event.solicitud;
    let opc = event.opc;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;

    if (opc == 'crear_carpeta') {
      this.solicitud.consulta = 6;
      this.consultar_carpeta();
    }
    else if (opc == 'editar_carpeta') {
      this.solicitud.consulta = 7;
      this.consultar_carpeta();
    }
    else if (opc == 'eliminar_carpeta') {
      this.solicitud.metodo = 5;
      this.solicitud.consulta = 5;
      this.consultar_carpeta();
    }
    else if (opc == 'crea_evidencia') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 2;
      this.consulta_evidencias(this.solicitud.idsecuencia, this.solicitud.consulta);
    }
    else if (opc == 'editar_archivo') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 3;
      this.consulta_evidencias(this.solicitud.idsecuencia, this.solicitud.consulta);
    }
    else if (opc == 'eliminar_archivo') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 4;
      this.consulta_evidencias(this.solicitud.idsecuencia, this.solicitud.consulta);
    }
    else {
      alert('ERROR');
    }
  }

  guardar_Cambios_evidencia(event: any) {
    /*
      guardar_Cambios_evidencia se ejecuta desde el componente *control_evidencia*, trae los datos para realizar la consulta.
    */
    let opc = event.opc;
    this.solicitud = event.solicitud;
    this.solicitud.idsecuencia = this.data_visor.idsecuencia;
    this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
    if (opc == 'editar_archivo') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 3;
      this.consulta_evidencias(this.solicitud.idsecuencia, this.solicitud.consulta);
    }
    else if (opc == 'eliminar_archivo') {
      this.solicitud.metodo = 3;
      this.solicitud.consulta = 4;
      this.consulta_evidencias(this.solicitud.idsecuencia, this.solicitud.consulta);
    }
  }
}


