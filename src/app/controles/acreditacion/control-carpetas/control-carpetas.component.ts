import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, OpcionesNotifi, Permisos, acreditacion } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';


import { ControlEvidenciaComponent } from '../export_controles_acreditacion';

@Component({
  selector: 'app-control-carpetas',
  templateUrl: './control-carpetas.component.html',
  styleUrls: ['./control-carpetas.component.css']
})
export class ControlCarpetasComponent implements OnInit {
  @Input() vistaActual: string;
  @Input() carpetas: any;
  @Input() autoevaluacion: boolean;
  @Input() cantidad_root: number;
  @Input() idcarpeta: number;
  @Input() barra: any;
  @Input() gestionar: boolean;
  @Output() cambioCarpeta: EventEmitter<any> = new EventEmitter();
  @Output() guardaR: EventEmitter<any> = new EventEmitter();
  @Output() guardaArchivos: EventEmitter<any> = new EventEmitter();



  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  solicitud = new Parametros().prm;
  flag_envio: boolean;

  data_visor: any;
  //VARIABLES DE CARPETAS
  idcarpeta_edit: number;
  nombre_carpeta: string;
  periodoActivo: number;
  cantidad_evi:number;

  // VARIABLES DE EVIDENCIAS
  tipo_evidencia = [];
  arch: boolean;
  video: boolean;
  file: boolean;
  extencion: '';
  _file: any;
  _lista_archivo: any;


  // VARIABLES VARIAS **
  opc: string;
  titulo_modal: string;
  evento: string;
  icon: string;
  colorBtn: string;
  tipo_evi: string;

  constructor(private rest: RestService, private router: Router, private notify: NotificationsService, private route: ActivatedRoute) { 
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
  }
  /*
    contiene el componente hijo 'input-file' =>
   */
  ngOnInit() {
    this.tipo_evi = "";
    this.idcarpeta = 0;
    this.tipo_evidencia = [
      {
        id: 1,
        nombre: 'Subir Archivos',
        arch: true,
        video: false,
        file: false,
        extencion: ''
      },
      {
        id: 2,
        nombre: 'Subir Video',
        arch: false,
        video: true,
        file: false,
        extencion: '.video'
      },
      {
        id: 3,
        nombre: 'Referencia a pagina Web',
        arch: false,
        video: true,
        file: false,
        extencion: '.link'
      }
    ]
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

  select_file(idcarpeta: number, idcarpeta_padre: number, nombre: string) {
    this.idcarpeta = idcarpeta;

    if (idcarpeta == 0) {
      this.barra = [];
    }
    else {
      this.barra.push({ id: this.barra.length, idcarpeta: idcarpeta, nombre: nombre });
    }
    this.cambioCarpeta.emit({ idcarpeta: this.idcarpeta, barra: this.barra });
  }

  cambio_tipoEvi(a) {
    this.arch = false;
    this.video = false;
    for (var i in this.tipo_evidencia) {
      if (this.tipo_evidencia[i].id == a) {
        this.arch = this.tipo_evidencia[i].arch;
        this.video = this.tipo_evidencia[i].video;
        this.file = this.tipo_evidencia[i].file;
        this.extencion = this.tipo_evidencia[i].extencion
      }
    }
  }

  /*
    Los metodos: crear, editar, eliminar reunen los parametros para luego ejecutar 'guardar()', donde se envian para ejecutar la consulta.
  */

  crear(a: any) {
    this.opc = 'crear_carpeta';
    this.titulo_modal = 'AGREGAR CARPETA';
    this.solicitud.nombre = '';

    this.evento = 'Guardar';//nombre del boton
    this.icon = 'save';//icono del boton
    this.colorBtn = 'w3-theme';//Color del boton

    document.getElementById('formulario_carpeta').style.display = 'block';
  }

  editar(a: any) {
    this.limpiar();
    this.opc = 'editar_carpeta';
    this.titulo_modal = 'EDITAR CARPETA';
    this.solicitud.nombre = a.nombre;
    this.solicitud.idcarpeta = a.idcarpeta;

    this.evento = 'Guardar';//nombre del boton
    this.icon = 'save';//icono del boton
    this.colorBtn = 'w3-theme';//Color del boton

    document.getElementById('formulario_carpeta').style.display = 'block';
  }

  eliminar(a: any) {
    this.opc = 'eliminar_carpeta';
    this.titulo_modal = 'ELIMINAR CARPETA';
    this.solicitud.idcarpeta = a.idcarpeta;
    this.nombre_carpeta = a.nombre;

    this.evento = 'Eliminar';//nombre del boton
    this.icon = 'trash';//icono del boton
    this.colorBtn = 'w3-red';//Color del boton

    document.getElementById('formulario_carpeta').style.display = 'block';
  }

  guardar_evidencia() {
    this.opc = 'crea_evidencia';
    this.solicitud.periodo = this.periodoActivo;
    this.solicitud.extencion = this.extencion;
    this.solicitud.idcarpeta = this.idcarpeta;
    this.solicitud.idsecuencia_pro = this.data_visor.idsecuencia_pro;
    this.guardar();
  }

  guardar() {
    this.solicitud.metodo = 3;
    this.solicitud.periodo = this.periodoActivo;
    this.solicitud.idcarpeta_padre = this.idcarpeta;
    this.solicitud.idsecuencia = this.data_visor.idsecuencia;

    // envia los datos de la solictud y la opcion que ejecutará.
    this.guardaR.emit({solicitud: this.solicitud, opc: this.opc});
  }

  cambio_periodo_activo(periodo: number) {
    // es ejecutado desde el componente control-gantt para hacer el cambio del periodo activo en proyectos.
    this.periodoActivo = periodo;
  }

  limpiar() {
    this.solicitud.nombre = '';
    this.solicitud.script = '';
  }

}
