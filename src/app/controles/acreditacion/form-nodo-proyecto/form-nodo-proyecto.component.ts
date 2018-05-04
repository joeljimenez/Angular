import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos, solicitudes } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-form-nodo-proyecto',
  templateUrl: './form-nodo-proyecto.component.html',
  styleUrls: ['./form-nodo-proyecto.component.css']
})
export class FormNodoProyectoComponent implements OnInit {

  @Input() piezas_proyecto: any;
  @Input() cripterios: any;
  @Input() categorias: any;
  @Output() guardar: EventEmitter<any> = new EventEmitter();

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  tituloModal: string;

  idpieza_proyecto: number;

  vista_nombre: boolean;
  vista_descripcion: boolean;
  vista_anexo_1: boolean;
  vista_anexo_2: boolean;
  vista_anexo_3: boolean;
  vista_presupuesto: boolean;
  vista_objetivo: boolean;
  nom_anexo_1: string;
  nom_anexo_2: string;
  nom_anexo_3: string;
  opc: string;
  es_contenedor:number;
  piezas_proyecto2 = [];


  constructor(private rest: RestService, private router: Router, private notify: NotificationsService) { }

  ngOnInit() {
  }

  crear(data: any) {
    console.log(data)
    this.opc = 'crear';
    this.limpia_paramatros_matriz_proyecto();
    this.solicitud = data;
    this.es_contenedor = data.es_contenedor;
    this.tituloModal = data.tituloModal;
    this.piezas_proyecto2 = this.piezas_proyecto.filter(value => value.act_pieza_contenedor_reporte === data.es_contenedor);
    this.solicitud.idpieza_proyecto = this.piezas_proyecto2[0].idpieza_proyecto;
    this.controlador_formulario();
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: any) {
    this.opc = 'editar';
    this.limpia_paramatros_matriz_proyecto();
    this.solicitud = data;
    this.tituloModal = data.tituloModal;
    this.piezas_proyecto2 = this.piezas_proyecto.filter(value => value.act_pieza_contenedor_reporte === data.es_contenedor);
    this.solicitud.idpieza_proyecto = this.piezas_proyecto2[0].idpieza_proyecto;
    this.controlador_formulario();
    document.getElementById('formulario').style.display = 'block';
  }

  limpia_paramatros_matriz_proyecto() {
    this.solicitud.idsecuencia_pro = 0;
    //this.solicitud.idsecuencia_pro_padre = 0;
    this.solicitud.idpieza_proyecto = null;
    this.solicitud.orden = 0;
    this.solicitud.nombre = '';
    this.solicitud.descripcion = '';

    
    
    this.solicitud.anexo_3 = '';
    this.solicitud.anexo_2 = '';
    this.solicitud.anexo_1 = '';
   
    this.solicitud.presupuesto = 0;
    this.solicitud.descripcion = '';
    this.solicitud.objetivo = '';
    this.solicitud.fecha_inicio = null;
    this.solicitud.fecha_cierre = null;
    this.solicitud.estado = 0;
    this.solicitud.consulta = 0;
    this.nom_anexo_1 = "";
    this.nom_anexo_2 = "";
    this.nom_anexo_3 = "";


    this.vista_nombre = false;
    this.vista_descripcion = false;

    this.vista_anexo_1 = false;
    this.vista_anexo_2 = false;
    this.vista_anexo_3 = false;
    this.vista_presupuesto = false;
    this.vista_objetivo = false;
  }

  cerrar() {
    document.getElementById('formulario').style.display = 'none';
  }

  // controla el formulario dependiendo de la pieza seleccionada
  controlador_formulario() {
    if (this.solicitud.idpieza_proyecto == null) {
      this.limpia_paramatros_matriz_proyecto();
    }
    else {
      for (var i in this.piezas_proyecto) {

        if (this.piezas_proyecto[i].idpieza_proyecto == this.solicitud.idpieza_proyecto) {

          if (this.piezas_proyecto[i].act_nombre == 1) { this.vista_nombre = true; } else { this.vista_nombre = false; }

          if (this.piezas_proyecto[i].act_descripcion == 1) { this.vista_descripcion = true; } else { this.vista_descripcion = false; }

          if (this.piezas_proyecto[i].act_anexo_1 == 1) { this.vista_anexo_1 = true; } else { this.vista_anexo_1 = false; }

          if (this.piezas_proyecto[i].act_anexo_2 == 1) { this.vista_anexo_2 = true; } else { this.vista_anexo_2 = false; }

          if (this.piezas_proyecto[i].act_anexo_3 == 1) { this.vista_anexo_3 = true; } else { this.vista_anexo_3 = false; }

          if (this.piezas_proyecto[i].act_presupuesto == 1) { this.vista_presupuesto = true; } else { this.vista_presupuesto = false; }

          if (this.piezas_proyecto[i].act_objetivo == 1) { this.vista_objetivo = true; } else { this.vista_objetivo = false; }



          this.nom_anexo_1 = this.piezas_proyecto[i].nom_anexo_1;
          this.nom_anexo_2 = this.piezas_proyecto[i].nom_anexo_2;
          this.nom_anexo_3 = this.piezas_proyecto[i].nom_anexo_3;
        }

      }
    }
  }

  guarda_valida_matriz_proyecto() {
    let validado = true;
    if (this.solicitud.idpieza_proyecto != null) {
      if (this.solicitud.orden > 0) {

        for (var i in this.piezas_proyecto) {

          if (this.piezas_proyecto[i].idpieza_proyecto == this.solicitud.idpieza_proyecto) {

            if (this.piezas_proyecto[i].act_nombre != 1) {
              this.solicitud.nombre = "";
            }
            else {
              if (this.solicitud.nombre.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo nombre es obligatorio...', this.optionconfig);

              }
            }

            if (this.piezas_proyecto[i].act_descripcion != 1) {
              this.solicitud.descripcion = "";
            }
            else {
              if (this.solicitud.descripcion.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo descripcion es obligatorio...', this.optionconfig);

              }
            }

            if (this.piezas_proyecto[i].act_anexo_1 != 1) {
              this.solicitud.anexo_1 = "";
            }
            else {
              if (this.solicitud.anexo_1.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo ' + this.nom_anexo_1 + ' es obligatorio...', this.optionconfig);
              }
            }

            if (this.piezas_proyecto[i].act_anexo_2 != 1) {
              this.solicitud.anexo_2 = "";
            }
            else {
              if (this.solicitud.anexo_2.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo ' + this.nom_anexo_2 + ' es obligatorio...', this.optionconfig);

              }
            }

            if (this.piezas_proyecto[i].act_anexo_3 != 1) {
              this.solicitud.anexo_3 = "";
            }
            else {
              if (this.solicitud.anexo_3.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo ' + this.nom_anexo_3 + ' es obligatorio...', this.optionconfig);

              }
            }

            if (this.piezas_proyecto[i].act_presupuesto != 1) {
              this.solicitud.presupuesto = 0;
            }
            else {
              if (this.solicitud.presupuesto == null) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo Presupuesto es obligatorio...', this.optionconfig);

              }
            }

            if (this.piezas_proyecto[i].act_objetivo != 1) {
              this.solicitud.objetivo = '';
            }
            else {
              if (this.solicitud.objetivo.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo Objetivo es obligatorio...', this.optionconfig);

              }
            }

            if (validado) {
              //this.Consultas_proyecto_matriz();
                this.guardar.emit({opc: this.opc, solicitud: this.solicitud})
            }

          }

        }
      }
      else {
        this.notify.warn('Valiadar campos', 'El orden del nodo no puede faltar coloquelo. esta a un lado de la pieza gracias.', this.optionconfig);

      }
    }
    else {
      this.notify.warn('Valiadar campos', 'Seleccione un pieza porfavor para empezar con el registro.', this.optionconfig);
    }
  }
}
