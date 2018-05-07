import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RestService, Parametros, acreditacion, OpcionesNotifi, Permisos, solicitudes } from '../../../Service/export';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-form-nodo',
  templateUrl: './form-nodo.component.html',
  styleUrls: ['./form-nodo.component.css']
})
export class FormNodoComponent implements OnInit {
  @Input() tituloModal: string;

  @Input() piezas_esquema: any;
  @Input() cualitativa: any;
  @Input() cripterios: any;
  @Input() categorias: any;

  @Output() guardar: EventEmitter<any> = new EventEmitter();

  options = new OpcionesNotifi().options;
  optionconfig = new OpcionesNotifi().config;
  permisos = new Permisos().access;
  prm = new Parametros().prm;
  solicitud = new Parametros().prm;
  flag_envio: boolean;
  piezas_esquema2 = [];

  nom_anexo_1 = "";
  nom_anexo_2 = "";
  n_pieza: string;
  vista_nombre: boolean;
  vista_descripcion: boolean;
  vista_evidencia: boolean;
  vista_categoria: boolean;
  vista_hallasgo: boolean;
  vista_anexo_1: boolean;
  vista_anexo_2: boolean;
  vista_cripterio: boolean;
  constructor(private rest: RestService, private router: Router, private notify: NotificationsService) { }

  ngOnInit() {
  }

  crear_nodo(data: any) {
    this.limpiar();
    this.solicitud = data;
    this.ctr_formulario(this.solicitud.idpieza);
    // filtra el esquema por el id de la pieza que se le envie.
    this.piezas_esquema2 =  this.piezas_esquema.filter(value => value.idpieza === this.solicitud.idpieza);
    this.n_pieza = this.piezas_esquema2[0].nombre_p;
  
    document.getElementById('formulario').style.display = 'block';
  }

  editar(data: any) {
    this.limpiar();
    this.solicitud = data;
    console.log(this.solicitud);
    this.ctr_formulario(this.solicitud.idpieza);
    this.piezas_esquema2 =  this.piezas_esquema.filter(value => value.idpieza === this.solicitud.idpieza);
    document.getElementById('formulario').style.display = 'block';
  }

  limpiar() {

    this.solicitud.orden = 0;
    this.solicitud.nombre = '';
    this.solicitud.descripcion = '';

    for (var i in this.categorias) {
      if (this.categorias[i].defaul == 1) {
        this.solicitud.idcategoria = this.categorias[i].idcategoria;
      }
    }
    //this.solicitud.idpieza = null;
    this.solicitud.anexo_2 = '';
    this.solicitud.anexo_1 = '';
    this.solicitud.idcripterio = 1;
    this.solicitud.hallasgo = '';
    this.solicitud.idcualitativa = 1;
    this.solicitud.puntuacion = 0;
    this.nom_anexo_1 = "";
    this.nom_anexo_2 = "";


    this.vista_nombre = false;
    this.vista_descripcion = false;
    this.vista_evidencia = false;
    this.vista_categoria = false;
    this.vista_hallasgo = false;
    this.vista_anexo_1 = false;
    this.vista_anexo_2 = false;
    this.vista_cripterio = false;
  }

  cerrar() {
    document.getElementById('formulario').style.display = 'none';
  }

  ctr_formulario(data: any) {
    // habilita y desabilita los campos para los diferentes esquemas.
    if (data == null) {
      this.limpiar();
    }
    else {
      for (var i in this.piezas_esquema) {

        if (this.piezas_esquema[i].idpieza == data) {

          if (this.piezas_esquema[i].act_nombre == 1) { this.vista_nombre = true; }
          else { this.vista_nombre = false; }
          if (this.piezas_esquema[i].act_descripcion == 1) { this.vista_descripcion = true; }
          else { this.vista_descripcion = false; }
          if (this.piezas_esquema[i].act_hallasgo == 1) { this.vista_hallasgo = true; }
          else { this.vista_hallasgo = false; }
          if (this.piezas_esquema[i].act_categoria == 1) { this.vista_categoria = true; }
          else { this.vista_evidencia = false; }
          if (this.piezas_esquema[i].act_evidencia == 1) { this.vista_evidencia = true; }
          else { this.vista_categoria = false; }
          if (this.piezas_esquema[i].act_anexo_1 == 1) { this.vista_anexo_1 = true; }
          else { this.vista_anexo_1 = false; }
          if (this.piezas_esquema[i].act_anexo_2 == 1) { this.vista_anexo_2 = true; }
          else { this.vista_anexo_2 = false; }
          if (this.piezas_esquema[i].act_cripterio == 1) { this.vista_cripterio = true; }
          else { this.vista_cripterio = false; }

          this.nom_anexo_1 = this.piezas_esquema[i].nom_anexo_1;
          this.nom_anexo_2 = this.piezas_esquema[i].nom_anexo_2;
        }

      }
    }
  }

  guardar_valida() {
    let validado = true;

    if (this.solicitud.idpieza != null) {
      if (this.solicitud.orden > 0) {

        for (const i in this.piezas_esquema) {

          if (this.piezas_esquema[i].idpieza == this.solicitud.idpieza) {

            if (this.piezas_esquema[i].act_nombre != 1) {
              this.solicitud.nombre = "";
            }
            else {
              if (this.solicitud.nombre.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo nombre es obligatorio...', this.optionconfig);
              }
            }

            if (this.piezas_esquema[i].act_descripcion != 1) {
              this.solicitud.descripcion = "";
            }
            else {
              if (this.solicitud.descripcion.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo descripcion es obligatorio...', this.optionconfig);
              }
            }

            if (this.piezas_esquema[i].act_hallasgo != 1) {
              this.solicitud.hallasgo = "";
              this.solicitud.puntuacion = 0;
              this.solicitud.idcualitativa = 1;
            }
            else {
              if (this.solicitud.hallasgo.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo hallasgo es obligatorio...', this.optionconfig);
              }
              else {
                if (this.solicitud.idcualitativa == 1 || this.solicitud.idcualitativa == null) {
                  validado = false;
                  this.notify.warn('Valiadar campos', 'El Campo Calificacion Cualitativa es obligatorios...', this.optionconfig);
                }
                else {
                  for (const e in this.cualitativa) {
                    if (this.cualitativa[e].idcualitativa == this.solicitud.idcualitativa) {
                      if (this.solicitud.puntuacion >= this.cualitativa[e].rango_inicio && this.solicitud.puntuacion <= this.cualitativa[e].rango_fin) {

                      }
                      else {
                        validado = false;
                        this.notify.warn('Valiadar campos', 'El  Puntuacion esta fuera de rango..', this.optionconfig);
                      }
                    }
                  }
                }
              }
            }
console.log(1)
            if (this.piezas_esquema[i].act_categoria != 1) {

              for (const cat in this.categorias) {
                if (this.categorias[cat].defaul == 1) {
                  this.solicitud.idcategoria = this.categorias[cat].idcategoria;
                }
              }
            }
            else {
              let seleccion_categoria = 0;
              for (const i in this.categorias) {
                if (this.categorias[i].defaul == 1) {
                  seleccion_categoria = this.categorias[i].idcategoria;
                }
              }

              if (this.solicitud.idcategoria == seleccion_categoria) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El seleccione un categoría es obligatorio...', this.optionconfig);

              }
            }


            if (this.piezas_esquema[i].act_cripterio != 1) {

              this.solicitud.idcripterio = 1;
            }
            else {
              if (this.solicitud.idcripterio == 1) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El seleccione un Cripterio es obligatorio...', this.optionconfig);
              }
            }

            if (this.piezas_esquema[i].act_anexo_1 != 1) {
              this.solicitud.anexo_1 = "";
            }
            else {
              if (this.solicitud.anexo_1.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo ' + this.nom_anexo_1 + ' es obligatorio...', this.optionconfig);
              }
            }

            if (this.piezas_esquema[i].act_anexo_2 != 1) {
              this.solicitud.anexo_2 = "";
            }
            else {
              if (this.solicitud.anexo_2.length == 0) {
                validado = false;
                this.notify.warn('Valiadar campos', 'El Campo ' + this.nom_anexo_2 + ' es obligatorio...', this.optionconfig);
              }
            }

            if (validado) {
              this.solicitud.tokent = JSON.parse(atob(localStorage._tokentUser)).tokent;
              this.guardar.emit(JSON.stringify(this.solicitud));
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
